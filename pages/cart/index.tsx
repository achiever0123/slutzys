import React, { PureComponent } from 'react';
import {
  Layout, message, Spin, PageHeader
} from 'antd';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import { TableCart } from '@components/cart/table-cart';
import { CheckOutForm } from '@components/cart/form-checkout';
import { removeCart } from 'src/redux/cart/actions';
import { paymentService, productService, cartService } from 'src/services';
import {
  IProduct, IUIConfig, ICoupon, ISettings
} from 'src/interfaces';
import './cart.less';

interface IProps {
  cart: any;
  removeCart: Function;
  ui: IUIConfig;
  settings: ISettings;
}

function mapQuantiy(items, existCart) {
  existCart.forEach((item) => {
    const index = items.findIndex((element) => element._id === item._id);
    // eslint-disable-next-line no-param-reassign
    if (index > -1) items[index].quantity = item.quantity;
  });
  return items;
}

const calTotal = (items, couponValue: number) => {
  let total = 0;
  items?.length
    && items.forEach((item) => {
      total += (item.quantity || 1) * item.price;
    });
  if (couponValue) {
    // total -= total * couponValue;
    total *= couponValue;
  }
  return total.toFixed(2) || 0;
};

class CartPage extends PureComponent<IProps> {
  static authenticate = true;

  state = {
    products: [],
    coupon: null as ICoupon,
    isApplyCoupon: false,
    requesting: false,
    submiting: false,
    loading: false
  };

  async componentDidMount() {
    this.getProducts();
  }

  async onChangeQuantity(item, quantity) {
    const { products } = this.state;
    const index = products.findIndex((element) => element._id === item._id);
    if (index > -1) {
      const newArray = [...products];
      newArray[index] = {
        ...newArray[index],
        quantity: quantity || 1
      };
      this.setState({ products: newArray });
    }
  }

  async onRemove(item) {
    const { removeCart: removeCartHandler } = this.props;
    const { products } = this.state;
    removeCartHandler([item]);
    this.removeItemCart(item);
    this.setState({ products: products.filter((product: IProduct) => product._id !== item._id) });
  }

  async getProducts() {
    try {
      await this.setState({ loading: true });
      const existCart = await cartService.getCartItems();
      if (existCart && existCart.length > 0) {
        const itemIds = existCart.map((i) => i._id);
        const resp = await productService.userSearch({
          includedIds: itemIds,
          limit: 10
        });
        this.setState({
          products: mapQuantiy(resp.data.data, existCart),
          loading: false
        });
      } else {
        this.setState({ loading: false });
      }
    } catch (e) {
      message.error('An error occured, please try again later');
      this.setState({ loading: false });
    }
  }

  removeItemCart(product: IProduct) {
    let oldCart = localStorage.getItem('cart') as any;
    oldCart = oldCart && oldCart.length ? JSON.parse(oldCart) : [];
    let newCart = [...oldCart];
    newCart = newCart.filter((item: IProduct) => item._id !== product._id);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  async purchaseProducts({
    deliveryAddress, phoneNumber, postalCode, couponCode, paymentGateway = 'ccbill'
  }) {
    const { products } = this.state;
    if (!products.length) return;
    try {
      await this.setState({ submiting: true });
      const items = products.map((p) => ({
        quantity: p.quantity || 1,
        _id: p._id
      }));
      const data = {
        paymentGateway,
        products: items,
        couponCode: couponCode || '',
        phoneNumber,
        postalCode,
        deliveryAddress
      };
      const resp = await (await paymentService.purchaseProducts(data)).data;
      message.info('Redirecting to payment gateway, do not reload page at this time', 15);
      window.location.href = resp.paymentUrl;
    } catch (error) {
      const e = await error;
      message.error(e?.message || 'Error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  async handleApplyCoupon(couponCode: string) {
    try {
      const { isApplyCoupon, products } = this.state;
      if (isApplyCoupon) {
        this.setState({ isApplyCoupon: false, coupon: null });
        return;
      }
      await this.setState({ requesting: true });
      const resp = await paymentService.applyCoupon(couponCode);
      this.setState({ isApplyCoupon: true, coupon: resp.data, requesting: false });
      message.success(`Yay! You have saved $${calTotal(products, resp.data.value)}!`);
    } catch (error) {
      const e = await error;
      message.error(e?.message || 'Error occured, please try again later');
      this.setState({ requesting: false });
    }
  }

  render() {
    const { ui, settings } = this.props;
    const {
      products, isApplyCoupon, coupon, requesting, submiting, loading
    } = this.state;

    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Shopping Cart
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Shopping Cart"
          />
          {!loading && products && products.length > 0 && (
            <div className="table-responsive">
              <TableCart
                dataSource={products}
                rowKey="_id"
                onChangeQuantity={this.onChangeQuantity.bind(this)}
                onRemoveItemCart={this.onRemove.bind(this)}
              />
            </div>
          )}
          {!loading && products && products.length > 0 && (
            <CheckOutForm settings={settings} onFinish={this.purchaseProducts.bind(this)} products={products} submiting={submiting || requesting} coupon={coupon} isApplyCoupon={isApplyCoupon} onApplyCoupon={this.handleApplyCoupon.bind(this)} />
          )}
          {!loading && !products.length && (
            <p className="text-center">
              You have an empty cart,
              {' '}
              <a className="text-link" href="/store">let&apos;s go shopping</a>
            </p>
          )}
          {loading && <div className="text-center"><Spin /></div>}
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  cart: state.cart,
  ui: state.ui,
  settings: state.settings
});

const mapDispatch = { removeCart };
export default connect(mapStates, mapDispatch)(CartPage);
