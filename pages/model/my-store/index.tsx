import { PureComponent } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import {
  message, Button, Row, Col, Layout, PageHeader
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productService } from '@services/product.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListProduct } from '@components/product/table-list-product';
import Link from 'next/link';
import { connect } from 'react-redux';
import { IPerformer, IUIConfig } from 'src/interfaces';
import ShadowBox from '@components/elements/ShadowBox';

interface IProps {
  performerId: string;
  user: IPerformer;
  ui: IUIConfig;
}

class Products extends PureComponent<IProps> {
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
    const { pagination: paginationVal } = this.state;
    const pager = { ...paginationVal };
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
      const resp = await productService.search({
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
      this.setState({ searching: false });
    }
  }

  async deleteProduct(id: string) {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      const { pagination } = this.state;
      await productService.delete(id);
      message.success('Deleted successfully');
      await this.search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  }

  render() {
    const { list, searching, pagination } = this.state;
    const { ui } = this.props;
    const statuses = [
      {
        key: '',
        text: 'All status'
      },
      {
        key: 'active',
        text: 'Active'
      },
      {
        key: 'inactive',
        text: 'Inactive'
      }
    ];

    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | My Store
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="My Store"
          />
          <ShadowBox>
            <Row>
              <Col xl={21} md={14} xs={24}>
                <SearchFilter
                  statuses={statuses}
                  onSubmit={this.handleFilter.bind(this)}
                  searchWithKeyword
                  searchWithCategory
                />
              </Col>
              <Col xl={3} md={10} xs={24} style={{ display: 'flex', alignItems: 'center' }}>
                <Button className="secondary">
                  <Link href="/model/my-store/create">
                    <a>Upload new</a>
                  </Link>
                </Button>
              </Col>
            </Row>
          </ShadowBox>
          <div style={{ marginBottom: '20px' }} />
          <ShadowBox>
            <div className="table-responsive">
              <TableListProduct
                dataSource={list}
                rowKey="_id"
                loading={searching}
                pagination={{ ...pagination, showSizeChanger: false }}
                onChange={this.handleTableChange.bind(this)}
                deleteProduct={this.deleteProduct.bind(this)}
              />
            </div>
          </ShadowBox>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});
export default connect(mapStates)(Products);
