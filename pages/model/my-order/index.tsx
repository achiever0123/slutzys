import { PureComponent } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { message, Layout, PageHeader } from 'antd';
import { orderService } from '@services/index';
import { OrderSearchFilter } from '@components/order';
import OrderTableList from '@components/order/table-list';
import { connect } from 'react-redux';
import { IUIConfig, IUser } from 'src/interfaces';
import ShadowBox from '@components/elements/ShadowBox';

interface IProps {
  user: IUser;
  ui: IUIConfig;
}

class ModelOrderPage extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    pagination: {} as any,
    searching: false,
    list: [] as any,
    limit: 12,
    filter: {} as any,
    sortBy: 'createdAt',
    sort: 'desc'
  };

  async componentDidMount() {
    this.search();
  }

  handleTableChange = async (pagination, filters, sorter) => {
    const { pagination: paginationState } = this.state;
    const pager = { ...paginationState };
    pager.current = pagination.current;
    await this.setState({
      pagination: pager,
      sortBy: sorter.field || 'createdAt',
      // eslint-disable-next-line no-nested-ternary
      sort: sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
    });
    this.search(pager.current);
  };

  async handleFilter(filter) {
    await this.setState({ filter });
    this.search();
  }

  async search(page = 1) {
    try {
      const {
        filter, limit, sort, sortBy, pagination
      } = this.state;
      await this.setState({ searching: true });
      const resp = await orderService.search({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy
      });
      await this.setState({
        searching: false,
        list: resp.data.data,
        pagination: {
          ...pagination,
          total: resp.data.total,
          pageSize: limit
        }
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      await this.setState({ searching: false });
    }
  }

  render() {
    const { list, searching, pagination } = this.state;
    const { ui, user } = this.props;

    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Order History
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Order History"
          />
          <ShadowBox>
            <OrderSearchFilter
              onSubmit={this.handleFilter.bind(this)}
            />
          </ShadowBox>
          <div style={{ marginBottom: '20px' }} />
          <ShadowBox>
            <OrderTableList
              user={user}
              dataSource={list}
              rowKey="_id"
              loading={searching}
              pagination={{ ...pagination, showSizeChanger: false }}
              onChange={this.handleTableChange.bind(this)}
            />
          </ShadowBox>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui,
  user: state.user.current
});
export default connect(mapStates)(ModelOrderPage);
