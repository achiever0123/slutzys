import React, { PureComponent } from 'react';
import {
  Row, Col, Layout, Pagination, Spin
} from 'antd';
import { connect } from 'react-redux';
import { listProducts } from '@redux/product/actions';
import { ShoppingOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { SearchFilter } from '@components/common/search-filter';
import { IProduct, IUser, IUIConfig } from 'src/interfaces/';
import ProductCard from '@components/product/product-card';
import '@components/performer/performer.less';

interface IProps {
  productState: {
    requesting: boolean;
    error: any;
    success: boolean;
    items: IProduct[];
    total: number;
  };
  listProducts: Function;
  ui: IUIConfig;
  user: IUser;
}

interface IStates {
  offset: number;
  limit: number;
  filter: number;
}

class Products extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static noredirect = true;

  state = {
    offset: 0,
    limit: 12,
    filter: {
      sortBy: 'updatedAt',
      sort: -1
    } as any
  };

  componentDidMount() {
    const { listProducts: getListHandler } = this.props;
    const { limit, offset, filter } = this.state;
    getListHandler({
      ...filter,
      limit,
      offset
    });
  }

  async handleFilter(values: any) {
    const { listProducts: getListHandler } = this.props;
    const { limit, filter } = this.state;
    await this.setState({ offset: 0, filter: { ...filter, ...values } });
    getListHandler({
      ...filter,
      ...values,
      limit,
      offset: 0
    });
  }

  async pageChanged(page: number) {
    const { listProducts: getListHandler } = this.props;
    const { limit, filter } = this.state;
    await this.setState({ offset: page - 1 });
    getListHandler({
      limit,
      offset: (page - 1) * limit,
      ...filter
    });
  }

  render() {
    const {
      productState,
      ui
    } = this.props;
    const {
      requesting = true, total = 0, items = []
    } = productState;
    const {
      limit, offset
    } = this.state;
    const type = [
      {
        key: '',
        text: 'All type'
      },
      {
        key: 'physical',
        text: 'Physical'
      },
      {
        key: 'digital',
        text: 'Digital'
      }
    ];

    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Products
          </title>
        </Head>
        <div className="main-container">
          <div className="page-heading">
            <span className="box">
              <ShoppingOutlined />
              {' '}
              Products
            </span>
          </div>
          <SearchFilter
            type={type}
            searchWithKeyword
            searchWithCategory
            categoryGroup="product"
            onSubmit={this.handleFilter.bind(this)}
          />
          <div className="main-background">
            <Row>
              {items && items.length > 0
                  && !requesting
                  && items.map((p) => (
                    <Col xs={12} md={6} lg={6} key={p._id}>
                      <ProductCard
                        product={p}
                      />
                    </Col>
                  ))}
            </Row>
            {!total && !requesting && <p className="text-center">No product was found</p>}
            {requesting && <div className="text-center"><Spin /></div>}
            {total && total > limit ? (
              <div className="paging">
                <Pagination
                  current={offset + 1}
                  total={total}
                  pageSize={limit}
                  onChange={this.pageChanged.bind(this)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  productState: { ...state.product.products },
  ui: { ...state.ui }
});

const mapDispatch = { listProducts };
export default connect(mapStates, mapDispatch)(Products);
