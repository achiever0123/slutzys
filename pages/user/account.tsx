import { PureComponent } from 'react';
import { Layout, Tabs, message } from 'antd';
import {
  SettingOutlined
} from '@ant-design/icons';
import Head from 'next/head';
import { connect } from 'react-redux';
import { UserAccountForm } from '@components/user/account-form';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import { IUser, IUserFormData } from 'src/interfaces/user';
import { userService, authService, utilsService } from 'src/services';
import {
  updateUser, updateCurrentUserAvatar
} from 'src/redux/user/actions';
import { getResponseError } from '@lib/utils';
import './index.less';
import { IUIConfig, ICountry } from 'src/interfaces';

interface IProps {
  user: IUser;
  updating: boolean;
  updateUser: Function;
  updateCurrentUserAvatar: Function;
  updateSuccess: boolean;
  error: any;
  ui: IUIConfig;
  countries: ICountry[];
}
interface IState {
  pwUpdating: boolean;
}

class UserAccountSettingPage extends PureComponent<IProps, IState> {
  static authenticate = true;

  static async getInitialProps() {
    const [countries] = await Promise.all([
      utilsService.countriesList()
    ]);
    return {
      countries: countries?.data || []
    };
  }

  state = { pwUpdating: false };

  componentDidUpdate(preProps: IProps) {
    const { error, updateSuccess } = this.props;
    if (error !== preProps.error) {
      message.error(getResponseError(error));
    }
    if (updateSuccess && updateSuccess !== preProps.updateSuccess) {
      message.success('Changes saved.');
    }
  }

  onFinish(data: IUserFormData) {
    const { updateUser: handleUpdate } = this.props;
    handleUpdate(data);
  }

  uploadAvatar(data) {
    const { updateCurrentUserAvatar: handleUpdateAvatar } = this.props;
    handleUpdateAvatar(data.response.data.url);
  }

  async updatePassword(data: any) {
    try {
      await this.setState({ pwUpdating: true });
      await authService.updatePassword(data.password, 'user');
      message.success('Changes saved.');
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'An error occurred, please try again!');
    } finally {
      this.setState({ pwUpdating: false });
    }
  }

  render() {
    const {
      user, updating, ui, countries
    } = this.props;
    const { pwUpdating } = this.state;
    const uploadHeader = {
      authorization: authService.getToken()
    };
    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | Edit Profile`}
          </title>
        </Head>
        <div className="main-container user-account">
          <h3 className="page-heading" style={{ marginBottom: 0 }}>
            <SettingOutlined />
            {' '}
            Edit Profile
          </h3>
          <Tabs
            defaultActiveKey="user-profile"
            tabPosition="top"
            className="nav-tabs"
          >
            <Tabs.TabPane tab={<span>Basic Info</span>} key="basic">
              <UserAccountForm
                onFinish={this.onFinish.bind(this)}
                updating={updating}
                user={user}
                options={{
                  uploadHeader,
                  avatarUrl: userService.getAvatarUploadUrl(),
                  uploadAvatar: this.uploadAvatar.bind(this)
                }}
                countries={countries}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>Change password</span>} key="password">
              <UpdatePaswordForm
                onFinish={this.updatePassword.bind(this)}
                updating={pwUpdating}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Layout>
    );
  }
}
const mapStates = (state) => ({
  user: state.user.current,
  updating: state.user.updating,
  error: state.user.error,
  updateSuccess: state.user.updateSuccess,
  ui: state.ui
});
const mapDispatch = {
  updateUser, updateCurrentUserAvatar
};
export default connect(mapStates, mapDispatch)(UserAccountSettingPage);
