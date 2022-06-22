import { PureComponent } from 'react';
import { IProduct, IUser } from 'src/interfaces';
import { Button, message, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { addCart, clearCart } from '@redux/cart/actions';
import { ShoppingCartOutlined, DollarOutlined, PictureOutlined } from '@ant-design/icons';
import Router from 'next/router';
import './product.less';

interface IProps {
  product: IProduct;
  addCart: Function;
  clearCart: Function;
  cart: any;
  user: IUser;
}

class ProductCard extends PureComponent<IProps> {
  async onAddCart() {
    const {
      addCart: addCartHandler, clearCart: handleClearCart, product, cart, user
    } = this.props;
    if (!user._id) {
      message.error('Please login or register to buy merchandise from your favorite models.');
      Router.push('/auth/login');
      return;
    }
    if (cart.items && cart.items.length === 10) {
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
      handleClearCart();
      localStorage.setItem('cart', '[]');
    }
    message.success('Item has been added to cart');
    addCartHandler([{ _id: product?._id, quantity: 1, performerId }]);
    this.updateCartLocalStorage({ _id: product?._id, quantity: 1, performerId });
  }

  onBuyNow() {
    const { user } = this.props;
    if (!user._id) {
      message.error('Please login or register to buy merchandise from your favorite models.');
      Router.push('/auth/login');
      return;
    }
    this.onAddCart();
    setTimeout(() => { Router.push('/cart'); }, 1000);
  }

  updateCartLocalStorage(item) {
    let oldCart = localStorage.getItem('cart') as any;
    oldCart = oldCart && oldCart.length ? JSON.parse(oldCart) : [];
    let newCart = [...oldCart];
    const addedProduct = oldCart.find((c) => c._id === item._id);
    if (addedProduct) {
      const { quantity } = addedProduct;
      newCart = oldCart.map((_item) => {
        if (_item._id === addedProduct?._id) {
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
    const { product, user } = this.props;
    const thumbUrl = (product?.images && product?.images[0]?.thumbnails && product?.images[0]?.thumbnails[0]) || (product?.images && product?.images[0]?.url) || '/no-image.jpg';
    return (
      <div className="prd-card">
        <div className="label-wrapper">
          {!product?.stock && product?.type === 'physical' && (
          <div className="label-wrapper-digital">Out of stock!</div>
          )}
          {product?.stock > 0 && product?.type === 'physical' && (
          <div className="label-wrapper-digital">
            {product?.stock}
            {' '}
            in stock
          </div>
          )}
          {product?.type === 'digital' && (
            <span className="label-wrapper-digital">Digital</span>
          )}
          {product?.price && !product.isBought && (
            <span className="label-wrapper-price">
              $
              {product?.price.toFixed(2)}
            </span>
          )}
        </div>
        <div
          style={{ cursor: (!user?._id || (user?.isPerformer && product?.performer?._id !== user?._id)) ? 'not-allowed' : 'pointer' }}
          aria-hidden
          className="prd-thumb"
          onClick={() => {
            if (!user?._id) {
              message.error('Please login or register to check out products!');
              Router.push('/auth/login');
              return;
            }
            if (user?.isPerformer && user?._id !== product?.performerId) return;
            Router.push({ pathname: '/store/details', query: { id: product?.slug || product?._id } }, `/store/${product?.slug || product?._id}`);
          }}
        >
          <img alt="" src={thumbUrl} />
        </div>
        <Tooltip title={product?.name}>
          <div className="prd-info">
            {product?.name}
          </div>
        </Tooltip>
        <div className="no-of-images">
          <PictureOutlined />
          {' '}
          {(product?.images && product?.images.length) || 0}
        </div>
        <div className="prd-button">
          <Button
            className="primary"
            disabled={user.isPerformer || (product?.type === 'physical' && !product?.stock)}
            onClick={this.onAddCart.bind(this)}
          >
            <ShoppingCartOutlined />
            Add to Cart
          </Button>
          <Button
            disabled={user.isPerformer || (product?.type === 'physical' && !product?.stock)}
            className="primary"
            onClick={this.onBuyNow.bind(this)}
          >
            <DollarOutlined />
            Buy Now
          </Button>
        </div>
      </div>
    );
  }
}

const mapStates = (state: any) => ({
  cart: state.cart,
  user: state.user.current
});

const mapDispatch = {
  addCart, clearCart
};

export default connect(mapStates, mapDispatch)(ProductCard);
