import React from 'react';
import App from 'next/app';
import { Provider } from 'react-redux';
import nextCookie from 'next-cookies';
import withReduxSaga from '@redux/withReduxSaga';
import { Store } from 'redux';
import BaseLayout from '@layouts/base-layout';
import {
  authService, userService, settingService, setGlobalConfig
} from '@services/index';
import Router from 'next/router';
import { NextPageContext } from 'next';
import { loginSuccess } from '@redux/auth/actions';
import { updateCurrentUser } from '@redux/user/actions';
import { updateUIValue } from '@redux/ui/actions';
import { updateSettings } from '@redux/settings/actions';
import { Socket } from 'src/socket';
import Head from 'next/head';
import '../style/index.less';
import '../style/global.css'
//import 'bootstrap/dist/css/bootstrap.css';

declare global {
  interface Window {
    ReactSocketIO: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

function redirectLogin(ctx: any) {
  if (process.browser) {
    authService.removeToken();
    Router.push('/auth/login');
    return;
  }

  ctx.res.clearCookie && ctx.res.clearCookie('token');
  ctx.res.clearCookie && ctx.res.clearCookie('role');
  ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/auth/login' });
  ctx.res.end && ctx.res.end();
}

async function auth(
  ctx: NextPageContext,
  noredirect: boolean,
  onlyPerformer: boolean
) {
  try {
    const { store } = ctx;
    const state = store.getState();
    const { token } = nextCookie(ctx);
    if (state.auth && state.auth.loggedIn) {
      return;
    }
    if (token) {
      authService.setToken(token);
      const user = await userService.me({
        Authorization: token
      });
      if (!user.data.isPerformer && onlyPerformer) {
        redirectLogin(ctx);
        return;
      }
      store.dispatch(loginSuccess());
      store.dispatch(updateCurrentUser(user.data));
      return;
    }
    !noredirect && redirectLogin(ctx);
  } catch (e) {
    redirectLogin(ctx);
  }
}

async function updateSettingsStore(ctx: NextPageContext, settings) {
  const { store } = ctx;
  store.dispatch(
    updateUIValue({
      logo: settings.logoUrl,
      siteName: settings.siteName,
      favicon: settings.favicon,
      loginPlaceholderImage: settings.loginPlaceholderImage,
      menus: settings.menus,
      footerContent: settings.footerContent,
      userBenefit: settings.userBenefit,
      modelBenefit: settings.modelBenefit
    })
  );

  store.dispatch(
    updateSettings({
      ...settings
    })
  );
}

interface AppComponent extends NextPageContext {
  layout: string;
}

interface IApp {
  store: Store;
  layout: string;
  authenticate: boolean;
  Component: AppComponent;
  settings: any;
  config: any;
}

const publicConfig = {} as any;

class Application extends App<IApp> {
  // TODO - consider if we need to use get static props in children component instead?
  static async getInitialProps({ Component, ctx }) {
    if (!process.browser) {
      // eslint-disable-next-line global-require
      const dotenv = require('dotenv');
      const myEnv = dotenv.config().parsed;

      // publish to server config with app
      setGlobalConfig(myEnv);

      // load public config and api-endpoint?
      Object.keys(myEnv).forEach((key) => {
        if (key.indexOf('NEXT_PUBLIC_') === 0) {
          publicConfig[key] = myEnv[key];
        }
      });
    }
    // won't check auth for un-authenticated page such as login, register
    // use static field in the component
    const { noredirect, onlyPerformer, authenticate } = Component;
    authenticate && await auth(ctx, noredirect, onlyPerformer);
    const { token } = nextCookie(ctx);
    ctx.token = token || '';
    // server side to load settings, once time only
    let settings = {};
    if (!process.browser) {
      const [setting] = await Promise.all([
        settingService.all('all', true)
      ]);
      settings = { ...setting.data };
      await updateSettingsStore(ctx, settings);
    }
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return {
      settings,
      pageProps,
      layout: Component.layout,
      config: publicConfig
    };
  }

  constructor(props) {
    super(props);
    setGlobalConfig(this.props.config);
  }

  render() {
    const {
      Component, pageProps, store, settings
    } = this.props;
    const { layout } = Component;
    return (
      <Provider store={store}>
        <Head>
          <title>{settings?.siteName}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          {/* GA code */}
          {settings && settings.gaCode && [
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaCode}`} />,
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `
                 window.dataLayer = window.dataLayer || [];
                 function gtag(){dataLayer.push(arguments);}
                 gtag('js', new Date());
                 gtag('config', '${settings.gaCode}');
             `
              }}
            />
          ]}
          {/* extra script */}
          {settings && settings.headerScript && (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: settings.headerScript }} />
          )}
        </Head>
        <Socket>
          <BaseLayout
            layout={layout}
            settings={settings}
          >
            <Component {...pageProps} />
          </BaseLayout>
        </Socket>
        {settings && settings.afterBodyScript && (
          // eslint-disable-next-line react/no-danger
          <div dangerouslySetInnerHTML={{ __html: settings.afterBodyScript }} />
        )}
      </Provider>
    );
  }
}

export default withReduxSaga(Application);
