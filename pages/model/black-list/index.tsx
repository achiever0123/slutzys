import {
  Layout, Button, message, Modal, Form, Input, PageHeader, Tabs
} from 'antd';
import Head from 'next/head';
import Router from 'next/router';
import React, { PureComponent } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { IUIConfig, ICountry, IPerformer } from 'src/interfaces';
import {
  PerformerBlockCountriesForm
} from '@components/performer';
import { SelectUserDropdown } from '@components/user/select-users-dropdown';
import { blockService, utilsService } from 'src/services';
import UsersBlockList from '@components/user/users-block-list';
import './index.less';
import ShadowBox from '@components/elements/ShadowBox';

interface IProps {
  ui: IUIConfig;
  countries: ICountry[];
  user: IPerformer;
}

class blockPage extends PureComponent<IProps> {
  static onlyPerformer = true;

  static authenticate = true;

  static async getInitialProps() {
    const [countries] = await Promise.all([
      utilsService.countriesList()
    ]);
    return {
      countries: countries?.data || []
    };
  }

  state = {
    loading: false,
    submiting: false,
    limit: 12,
    offset: 0,
    blockUserId: '',
    userBlockedList: [],
    totalBlockedUsers: 0,
    openBlockModal: false
  }

  componentDidMount() {
    this.getBlockList();
  }

  async getBlockList() {
    const { limit, offset } = this.state;
    try {
      await this.setState({ loading: true });
      const kq = await blockService.getBlockListUsers({
        limit,
        offset: offset * limit
      });
      this.setState({
        userBlockedList: kq.data.data,
        totalBlockedUsers: kq.data.total,
        loading: false
      });
    } catch (e) {
      message.error('An error occured, please try again later');
      this.setState({ loading: false });
    }
  }

  async blockUser(data) {
    const { blockUserId } = this.state;
    if (!blockUserId) {
      message.error('Please select a user');
      return;
    }
    try {
      await this.setState({ submiting: true });
      await blockService.blockUser({ targetId: blockUserId, target: 'user', reason: data.reason });
      await this.setState({ submiting: false, openBlockModal: false });
      message.success('Blocked user successfully');
      this.getBlockList();
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'An error occured, please try again later');
      this.setState({ submiting: false, openBlockModal: false });
    }
  }

  async handlePageChange(data) {
    await this.setState({ offset: data.current - 1 });
    this.getBlockList();
  }

  async handleUnblockUser(userId: string) {
    if (!window.confirm('Are you sure to unblock this user')) return;
    try {
      const { userBlockedList } = this.state;
      await this.setState({ submiting: true });
      await blockService.unBlockUser(userId);
      this.setState({
        userBlockedList: userBlockedList.filter((u) => u.targetId !== userId),
        submiting: false
      });
      message.success('Unblocked user successfully');
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'An error occured. Please try again later');
      this.setState({ submiting: false });
    }
  }

  async handleUpdateBlockCountries(data) {
    try {
      await this.setState({ submiting: true });
      await blockService.blockCountries(data);
      message.success('Blocked countries were updated successfully!');
      this.setState({ submiting: false });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try againl later');
      this.setState({ submiting: false });
    }
  }

  render() {
    const {
      userBlockedList, totalBlockedUsers, loading, limit, submiting, openBlockModal
    } = this.state;
    const { ui, countries, user } = this.props;
    return (
      <Layout>
        <Head>
          <title>{`${ui?.siteName} | Blacklist`}</title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Blacklist"
          />
          <ShadowBox>
            <Tabs>
              <Tabs.TabPane key="block-user" tab={<span>Blacklist Users</span>}>
                <div className="block-user">
                  <Button style={{marginBottom: "10px"}} className="" type="primary" onClick={() => this.setState({ openBlockModal: true })}>
                    Block user
                  </Button>
                </div>
                <div className="users-blocked-list">
                  <UsersBlockList
                    items={userBlockedList}
                    searching={loading}
                    total={totalBlockedUsers}
                    onPaginationChange={this.handlePageChange.bind(this)}
                    pageSize={limit}
                    submiting={submiting}
                    unblockUser={this.handleUnblockUser.bind(this)}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane key="block-countries" tab={<span>Blacklist Countries</span>}>
                <PerformerBlockCountriesForm
                  onFinish={this.handleUpdateBlockCountries.bind(this)}
                  updating={submiting}
                  blockCountries={user.blockCountries}
                  countries={countries}
                />
              </Tabs.TabPane>
            </Tabs>
          </ShadowBox>
        </div>
        <Modal
          title="Block user"
          visible={openBlockModal}
          onCancel={() => this.setState({ openBlockModal: false })}
          footer={null}
          destroyOnClose
        >
          <Form
            name="blockForm"
            onFinish={this.blockUser.bind(this)}
            initialValues={{
              reason: 'Disturbing'
            }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="account-form"
          >
            <Form.Item label="Please select user you want to block">
              <SelectUserDropdown onSelect={(val) => this.setState({ blockUserId: val })} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: 'Tell us your reason' }]}
            >
              <Input.TextArea maxLength={150} showCount />
            </Form.Item>
            <Form.Item>
              <Button
                className="primary"
                htmlType="submit"
                loading={submiting}
                disabled={submiting}
              >
                Submit
              </Button>
              <Button
                className="secondary"
                onClick={() => this.setState({ openBlockModal: false })}
              >
                Close
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

const mapStates = (state) => ({
  ui: state.ui,
  user: state.user.current
});
export default connect(mapStates)(blockPage);
