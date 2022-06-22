import { PureComponent } from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import {
  Layout, Tabs, message, PageHeader
} from 'antd';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import Router from 'next/router';
import {
  IPerformer, IBanking, IUIConfig
} from 'src/interfaces';
import {
  updatePerformer, updateCurrentUserAvatar, updateCurrentUserCover
} from 'src/redux/user/actions';
import {
  performerService, utilsService
} from '@services/index';
import {
  PerformerPaypalForm, PerformerBankingForm
} from '@components/performer';
import { getResponseError } from '@lib/utils';

interface IProps {
  ui: IUIConfig;
  currentUser: IPerformer;
  countries: any;
}

class AccountSettings extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps() {
    const [countries] = await Promise.all([
      utilsService.countriesList()
    ]);
    return {
      countries: countries?.data || []
    };
  }

  state = {
    submiting: false
  }

  async handleUpdateBanking(data: IBanking) {
    try {
      this.setState({ submiting: true });
      const { currentUser } = this.props;
      const info = { ...data, performerId: currentUser._id };
      await performerService.updateBanking(currentUser._id, info);
      this.setState({ submiting: false });
      message.success('Banking account was updated successfully!');
    } catch (error) {
      this.setState({ submiting: false });
      message.error(getResponseError(await error) || 'An error orccurred, please try again.');
    }
  }

  async handleUpdatePaypal(data) {
    const { currentUser } = this.props;
    try {
      this.setState({ submiting: false });
      const payload = { key: 'paypal', value: data, performerId: currentUser._id };
      await performerService.updatePaymentGateway(currentUser._id, payload);
      message.success('Paypal account was updated successfully!');
      this.setState({ submiting: false });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try againl later');
      this.setState({ submiting: false });
    }
  }

  render() {
    const {
      currentUser, ui, countries
    } = this.props;
    const { submiting } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {`${ui.siteName} | Banking (to earn)`}
          </title>
        </Head>
        <div className="main-container user-account">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Banking (to earn)"
          />
          <Tabs
            defaultActiveKey="basic"
            tabPosition="top"
            className="nav-tabs"
          >
            <Tabs.TabPane
              tab={(
                <span>
                  <img src="/banking-ico.png" alt="banking" height="25px" />
                </span>
              )}
              key="bankInfo"
            >
              <PerformerBankingForm
                onFinish={this.handleUpdateBanking.bind(this)}
                updating={submiting}
                user={currentUser}
                countries={countries}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={(
                <span>
                  <img src="/paypal-ico.png" alt="paypal" height="25px" />
                </span>
              )}
              key="paypalInfo"
            >
              <PerformerPaypalForm
                onFinish={this.handleUpdatePaypal.bind(this)}
                updating={submiting}
                user={currentUser}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  currentUser: state.user.current,
  updating: state.user.updating,
  ui: state.ui
});
const mapDispatch = {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover
};
export default connect(mapStates, mapDispatch)(AccountSettings);
