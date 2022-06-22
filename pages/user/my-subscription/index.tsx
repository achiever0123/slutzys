import { PureComponent } from 'react';
import { message, Layout, PageHeader } from 'antd';
import Router from 'next/router';
import Head from 'next/head';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { TableListSubscription } from '@components/subscription/table-list-subscription';
import { ISubscription, IUIConfig } from 'src/interfaces';
import { subscriptionService, paymentService } from '@services/index';
import { getResponseError } from '@lib/utils';
import { connect } from 'react-redux';
import { formatDate } from '@lib/date';

interface IProps {
  ui: IUIConfig;
}
interface IStates {
  subscriptionList: ISubscription[];
  loading: boolean;
  pagination: {
    pageSize: number;
    current: number;
    total: number;
  };
  sort: string;
  sortBy: string;
  filter: {};
}

class SubscriptionPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  constructor(props: IProps) {
    super(props);
    this.state = {
      subscriptionList: [],
      loading: false,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      sort: 'desc',
      sortBy: 'updatedAt',
      filter: {}
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      const {
        filter, sort, sortBy, pagination
      } = this.state;
      await this.setState({ loading: true });
      const resp = await subscriptionService.userSearch({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      await this.setState({
        subscriptionList: resp.data.data,
        pagination: { ...pagination, total: resp.data.total }
      });
    } catch (error) {
      message.error(
        getResponseError(error) || 'An error occured. Please try again.'
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  async cancelSubscription(subscription: ISubscription) {
    if (subscription.subscriptionType === 'system' && !window.confirm(`You are trying to cancel a subscription created by the site admin. Cancelling this will block access to ${subscription?.performerInfo?.name || subscription?.performerInfo?.username || 'the model'}'s content immediately. Do you wish to continue?`)) {
      return;
    }
    if (subscription.subscriptionType !== 'system' && !window.confirm(`Are you sure want to cancel this subscription? You can still enjoy the subscription benefits until ${formatDate(subscription?.expiredAt, 'll')}`)) {
      return;
    }
    try {
      await paymentService.cancelSubscription(subscription._id);
      message.success('This subscription have been suspended');
      this.getData();
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try again later');
    }
  }

  async handleTabChange(data) {
    const { pagination } = this.state;
    await this.setState({
      pagination: { ...pagination, current: data.current }
    });
    this.getData();
  }

  render() {
    const { subscriptionList, pagination, loading } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | My Subscriptions
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="My Subscriptions"
          />
          <div className="table-responsive">
            <TableListSubscription
              dataSource={subscriptionList}
              pagination={{ ...pagination, showSizeChanger: false }}
              loading={loading}
              onChange={this.handleTabChange.bind(this)}
              rowKey="_id"
              cancelSubscription={this.cancelSubscription.bind(this)}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapState = (state: any) => ({ ui: state.ui });
const mapDispatch = {};
export default connect(mapState, mapDispatch)(SubscriptionPage);
