import { PureComponent } from 'react';
import {
  Layout, Button, message, Spin, Carousel, Image as AntImage, Avatar, PageHeader, Result
} from 'antd';
import {
  ShoppingCartOutlined, DollarOutlined, ArrowLeftOutlined, EyeOutlined, HomeOutlined, ContactsOutlined
} from '@ant-design/icons';
import { TickIcon } from 'src/icons';
import { connect } from 'react-redux';
import Head from 'next/head';
import { productService } from '@services/index';
import { PerformerListProduct } from '@components/product/performer-list-product';
import { addCart, clearCart } from '@redux/cart/actions';
import Router from 'next/router';
import {
  IUser, IUIConfig, IProduct, IError
} from 'src/interfaces';
import Link from 'next/link';
import { shortenLargeNumber } from '@lib/number';
import './store.less';

interface IProps {
  addCart: Function;
  clearCart: Function;
  cart: any;
  user: IUser;
  ui: IUIConfig;
  product: IProduct;
  error: IError;
}

class ProductViewPage extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect = true;

  static async getInitialProps({ ctx }) {
    try {
      const product = await (await productService.userView(ctx.query.id)).data;
      return { product };
    } catch (e) {
      return { error: await e };
    }
  }

  state = {
    fetching: true,
    relatedProducts: []
  };

  async componentDidMount() {
    this.getRelatedProducts();
  }

  async componentDidUpdate(prevProps) {
    const { product } = this.props;
    if (prevProps?.product?._id !== product?._id) {
      this.getRelatedProducts();
    }
  }

  async onAddCart() {
    const {
      addCart: addCartHandler, clearCart: clearAllCart, cart, product, user
    } = this.props;
    if (!user._id) {
      message.error('Please login or register to buy merchandise from your favorite models.');
      Router.push('/auth/login');
      return;
    }
    if (cart.items.length === 10) {
      message.error('You reached 10 items, please process payment first.');
      return;
    }
    const { stock, type, performerId } = product;
    if ((type === 'physical' && !stock) || (type === 'physical' && stock < 1)) {
      message.error('Out of stock');
      return;
    }
    if (type === 'digital' && !!cart.items.find((item) => item._id === product._id)) {
      return;
    }
    const difPerformerProducts = cart.items.filter((item) => item.performerId !== performerId);
    if (difPerformerProducts && difPerformerProducts.length) {
      if (!window.confirm('There is one or more items from another model in your cart. Would you like to clear that and add this instead?')) return;
      // clear cart before add new item from another performer
      clearAllCart();
      localStorage.setItem('cart', '[]');
    }
    message.success('Item has been added to cart');
    addCartHandler([{ _id: product._id, quantity: 1, performerId }]);
    this.updateCartLocalStorage({ _id: product._id, quantity: 1, performerId });
  }

  onBuyNow() {
    const {
      user
    } = this.props;
    if (!user._id) {
      message.error('Please login or register to buy merchandise from your favorite models.');
      Router.push('/auth/login');
      return;
    }
    this.onAddCart();
    setTimeout(() => { Router.push('/cart'); }, 1000);
  }

  async getRelatedProducts() {
    const { product } = this.props;
    // preload images
    product.images && product.images.forEach((img) => {
      setTimeout(() => { new Image().src = img?.url; }, 1000);
      return img;
    });
    try {
      await this.setState({ fetching: true });
      const resp = await productService.userSearch({
        limit: 24,
        excludedId: product._id
      });
      this.setState({ relatedProducts: resp.data.data, fetching: false });
    } catch (e) {
      message.error('Error occured, could not get product details');
      this.setState({ fetching: false });
    }
  }

  updateCartLocalStorage(item) {
    let oldCart = localStorage.getItem('cart') as any;
    oldCart = oldCart && oldCart.length ? JSON.parse(oldCart) : [];
    let newCart = [...oldCart];
    const addedProduct = oldCart.find((c) => c._id === item._id);
    if (addedProduct) {
      const { quantity } = addedProduct;
      newCart = oldCart.map((_item) => {
        if (_item._id === addedProduct._id) {
          return {
            ..._item,
            quantity: (quantity || 0) + 1
          };
        }
        return _item;
      });
    } else {
      newCart.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  render() {
    const {
      ui, product, user, error
    } = this.props;
    if (error) {
      return (
        <Result
          status={error?.statusCode === 404 ? '404' : 'error'}
          title={error?.statusCode === 404 ? null : error?.statusCode}
          subTitle={error?.statusCode === 404 ? 'Alas! It hurts us to realize that we have let you down. We are not able to find the page you are hunting for :(' : error?.message}
          extra={[
            <Button className="secondary" key="console" onClick={() => Router.push('/')}>
              <HomeOutlined />
              BACK HOME
            </Button>,
            <Button key="buy" className="primary" onClick={() => Router.push('/contact')}>
              <ContactsOutlined />
              CONTACT US
            </Button>
          ]}
        />
      );
    }
    const {
      relatedProducts, fetching
    } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | ${product?.name || ''}`}
          </title>
          <meta name="keywords" content={product?.description} />
          <meta name="description" content={product?.description} />
          {/* OG tags */}
          <meta
            property="og:title"
            content={`${ui.siteName} | ${product?.name || 'Product'}`}
            key="title"
          />
          <meta property="og:image" content={product?.images && product?.images[0] && product?.images[0]?.url} />
          <meta property="og:keywords" content={product?.description} />
          <meta
            property="og:description"
            content={product?.description}
          />
          {/* Twitter tags */}
          <meta
            name="twitter:title"
            content={`${ui.siteName} | ${product?.name || 'Product'}`}
          />
          <meta name="twitter:image" content={product?.images && product?.images[0] && product?.images[0]?.url} />
          <meta
            name="twitter:description"
            content={product?.description}
          />
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title={product?.name}
          />
          <div className="product-card">
            <div className="prod-img">
              <AntImage.PreviewGroup>
                <Carousel autoplay={false} adaptiveHeight effect="fade" swipeToSlide arrows dots={false}>
                  {product.images && product.images.length > 0 ? product.images.map((image) => (
                    <AntImage
                      key={image._id}
                      src={image?.url || image?.thumbnails[0]}
                      fallback="/no-image.jpg"
                      preview
                      title={image.name}
                    />
                  ))
                    : <img alt="prod-thumb" src="/empty_product.svg" />}
                </Carousel>
              </AntImage.PreviewGroup>
              {product.type === 'physical' && product.stock && (
                <span className="prod-stock">
                  {product.stock}
                  {' '}
                  in stock
                </span>
              )}
              {product.type === 'physical' && !product.stock && (
                <span className="prod-stock">Out of stock!</span>
              )}
              {product.type === 'digital' && <span className="prod-stock">{product.type}</span>}
            </div>
            <div className="prod-info">
              <p className="prod-price">
                $
                {product.price.toFixed(2)}
                <span className="dc-price">
                  $
                  {(product.price * 1.2).toFixed(2)}
                </span>
              </p>
              <div className="add-cart">
                <Button
                  className="primary"
                  disabled={user.isPerformer || (product.type === 'physical' && !product.stock)}
                  onClick={this.onAddCart.bind(this)}
                >
                  <ShoppingCartOutlined />
                  {' '}
                  Add to Cart
                </Button>
                &nbsp;
                <Button type="link" disabled={user.isPerformer || (product.type === 'physical' && !product.stock)} className="secondary" onClick={this.onBuyNow.bind(this)}>
                  <DollarOutlined />
                  {' '}
                  Buy Now
                </Button>
              </div>
              <div className="prod-desc">{product.description || 'No description'}</div>
            </div>
          </div>
        </div>
        <div className="middle-split">
          <div className="main-container">
            <div className="middle-actions">
              <Link
                href={{
                  pathname: '/model/profile',
                  query: { username: product?.performer?.username || product?.performer?._id }
                }}
                as={`/model/${product?.performer?.username || product?.performer?._id}`}
              >
                <a>
                  <div className="o-w-ner">
                    <Avatar
                      alt="performer avatar"
                      src={product?.performer?.avatar || '/user.png'}
                    />
                    <span className="owner-name">
                      <span>
                        {product?.performer?.name || 'N/A'}
                        {' '}
                        {product?.performer?.verifiedAccount && <TickIcon />}
                      </span>
                      <span style={{ fontSize: '10px' }}>
                        @
                        {product?.performer?.username || 'n/a'}
                      </span>
                    </span>
                  </div>
                </a>
              </Link>

              <div className="act-btns">
                <Button
                  className="react-btn"
                >
                  {shortenLargeNumber(product?.stats?.views || 0)}
                  {' '}
                  <EyeOutlined />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="main-container">
          <div className="related-items">
            <h4 className="ttl-1">You may also like</h4>
            {!fetching && relatedProducts.length > 0 && (
              <PerformerListProduct products={relatedProducts} />
            )}
            {!fetching && !relatedProducts?.length && <p>No product was found</p>}
            {fetching && <div><Spin /></div>}
          </div>
        </div>
      </Layout>
    );
  }
}
const mapStates = (state: any) => ({
  cart: { ...state.cart },
  user: { ...state.user.current },
  ui: { ...state.ui }
});

const mapDispatch = { addCart, clearCart };
export default connect(mapStates, mapDispatch)(ProductViewPage);
