import { PureComponent } from 'react';
import dynamic from 'next/dynamic';
import { Layout, BackTop } from 'antd';
import { connect } from 'react-redux';
import { Router } from 'next/router';
import { updateUIValue, loadUIValue } from 'src/redux/ui/actions';
import { IUIConfig } from 'src/interfaces/ui-config';
import './primary-layout.less';

/* const Header = dynamic(() => import('@components/common/layout/header'));
const Footer = dynamic(() => import('@components/common/layout/footer'));
const Loader = dynamic(() => import('@components/common/base/loader')); */
import Header from '@components/common/layout/header';
import Footer from '@components/common/layout/footer';
import Loader from '@components/common/base/loader';

interface DefaultProps extends IUIConfig {
  children: any;
  config: IUIConfig;
  updateUIValue: Function;
  loadUIValue: Function;
}

export async function getStaticProps() {
  return {
    props: {}
  };
}

class PrimaryLayout extends PureComponent<DefaultProps> {
  state = {
    routerChange: false
  };

  componentDidMount() {
    process.browser && this.handleStateChange();
  }

  handleStateChange() {
    Router.events.on('routeChangeStart', async () => this.setState({ routerChange: true }));
    Router.events.on('routeChangeComplete', async () => this.setState({ routerChange: false }));
  }

  render() {
    const {
      children
    } = this.props;
    const {
      routerChange
    } = this.state;

    return (
      <Layout>
        <div
          className="primary-container"
          id="primaryLayout"
        >
          <Header />
          <Layout.Content
            className="content"
            style={{ position: 'relative' }}
          >
            {routerChange && <Loader />}
            {children}
          </Layout.Content>
          <BackTop className="backTop" />
          <Footer />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => ({
  ...state.ui
});
const mapDispatchToProps = { updateUIValue, loadUIValue };

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);
