import { PureComponent } from 'react';
import { message, Layout, PageHeader } from 'antd';
import Head from 'next/head';
import Router from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { TableListSubscription } from '@components/subscription/user-table-list-subscription';
import { ISubscription, IUIConfig } from 'src/interfaces';
import { subscriptionService } from '@services/subscription.service';
import { getResponseError } from '@lib/utils';
import { connect } from 'react-redux';
import ShadowBox from '@components/elements/ShadowBox';

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

class SubscriberPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

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
      const resp = await subscriptionService.search({
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
            | My Subscribers
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="My Subscribers"
          />
          <ShadowBox>
            <div className="table-responsive">
              <TableListSubscription
                dataSource={subscriptionList}
                pagination={{ ...pagination, showSizeChanger: false }}
                loading={loading}
                onChange={this.handleTabChange.bind(this)}
                rowKey="_id"
              />
            </div>
          </ShadowBox>
        </div>
      </Layout>
    );
  }
}

const mapState = (state: any) => ({ ui: state.ui });
const mapDispatch = {};
export default connect(mapState, mapDispatch)(SubscriberPage);
