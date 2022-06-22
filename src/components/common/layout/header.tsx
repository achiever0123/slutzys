/* eslint-disable react/no-danger */
import { PureComponent } from 'react';
import {
  Layout, Avatar, Badge, Drawer, Divider
} from 'antd';
import { connect } from 'react-redux';
import Link from 'next/link';
import { IUser, IUIConfig } from 'src/interfaces';
import { logout } from '@redux/auth/actions';
import {
  ShoppingCartOutlined, LikeOutlined, EditOutlined, BankOutlined,
  ContactsOutlined, StarOutlined, SearchOutlined, HeartOutlined, FlagOutlined,
  UserOutlined, ShoppingOutlined, LinkOutlined, LogoutOutlined, ShopOutlined,
  VideoCameraOutlined, PictureOutlined, NotificationOutlined, BlockOutlined
} from '@ant-design/icons';
import { ModelIcon, HomeIcon, MessageIcon } from 'src/icons';
import { withRouter, Router as RouterEvent } from 'next/router';
import { addCart, clearCart } from 'src/redux/cart/actions';
import {
  cartService, messageService, authService
} from 'src/services';
import { Event, SocketContext } from 'src/socket';
import SearchBar from './search-bar';
import './header.less';

interface IProps {
  currentUser: IUser;
  logout: Function;
  router: any;
  ui: IUIConfig;
  cart: any;
  addCart: Function;
  clearCart: Function;
}

class Header extends PureComponent<IProps> {
  state = {
    totalNotReadMessage: 0,
    openSearch: false,
    openProfile: false
  };

  async componentDidMount() {
    const {
      currentUser, cart, addCart: addCartHandler
    } = this.props;
    RouterEvent.events.on('routeChangeStart', () => this.setState({ openProfile: false, openSearch: false }));
    if (currentUser._id) {
      this.countTotalMessage();
      if (!cart || (cart && cart.items.length <= 0)) {
        const existCart = await cartService.getCartItems();
        if (existCart && existCart.length > 0) {
          addCartHandler(existCart);
        }
      }
    }
  }

  async componentDidUpdate(prevProps: any) {
    const { cart, currentUser, addCart: addCartHandler } = this.props;
    if (prevProps?.currentUser._id !== currentUser?._id && currentUser?._id) {
      this.countTotalMessage();
      if (!cart || (cart && cart.items.length <= 0)) {
        const existCart = await cartService.getCartItems();
        if (existCart && existCart.length > 0) {
          addCartHandler(existCart);
        }
      }
    }
  }

  componentWillUnmount() {
    RouterEvent.events.off('routeChangeStart', () => this.setState({ openProfile: false, openSearch: false }));
  }

  async beforeLogout() {
    const { logout: logoutHandler, clearCart: clearCartHandler } = this.props;
    const token = authService.getToken();
    const socket = this.context;
    token && socket && (await socket.emit('auth/logout', {
      token
    }));
    clearCartHandler();
    localStorage.setItem('cart', JSON.stringify([]));
    logoutHandler();
  }

  async countTotalMessage() {
    const data = await (await messageService.countTotalNotRead()).data;
    if (data) {
      this.setState({ totalNotReadMessage: data.total });
    }
  }

  async handleMessage(event) {
    event && this.setState({ totalNotReadMessage: event.total });
  }

  render() {
    const {
      currentUser, router, ui, cart
    } = this.props;
    const {
      totalNotReadMessage, openSearch, openProfile
    } = this.state;

    return (
      <div className="main-header">
        <Event
          event="nofify_read_messages_in_conversation"
          handler={this.handleMessage.bind(this)}
        />
        <div className="main-container">
          <Layout.Header className="header" id="layoutHeader">
            <div className="nav-bar">
              <div className={currentUser._id ? 'left-conner hide-mobile' : 'left-conner'}>
                <Link href="/">
                  <a className="logo-nav">
                    {ui?.logo ? (
                      <img
                        alt="logo"
                        src={ui?.logo}
                      />
                    ) : <span>{ui?.siteName}</span>}
                  </a>
                </Link>
              </div>
              <div className="mid-conner">
                <ul className={currentUser._id ? 'nav-icons' : 'nav-icons custom'}>
                  {currentUser._id && (
                    <>
                      <li
                        className={router.pathname === '/' ? 'custom active' : 'custom'}
                      >
                        <Link href="/">
                          <a>
                            <HomeIcon />
                            {' '}
                            <span className="hide">Home</span>
                          </a>
                        </Link>
                      </li>
                      <li className={router.pathname === '/model' ? 'custom active' : 'custom'}>
                        <Link href={{ pathname: '/model' }} as="/model">
                          <a>
                            <ModelIcon />
                            {' '}
                            <span className="hide">Models</span>
                          </a>
                        </Link>
                      </li>
                      <li className={router.pathname === '/store' ? 'custom active' : 'custom'}>
                        <Link href={{ pathname: '/store' }} as="/store">
                          <a>
                            <ShopOutlined />
                            {' '}
                            <span className="hide">Store</span>
                          </a>
                        </Link>
                      </li>
                      <li
                        className={router.pathname === '/contact' ? 'custom active' : 'custom'}
                      >
                        <Link href="/contact">
                          <a>
                            <ContactsOutlined />
                            {' '}
                            <span className="hide">Contact</span>
                          </a>
                        </Link>
                      </li>
                      <li
                        className={
                          router.pathname === '/messages' ? 'active' : ''
                        }
                      >
                        <Link href="/messages">
                          <a>
                            <MessageIcon />
                            <Badge
                              className="cart-total"
                              count={totalNotReadMessage}
                              overflowCount={9}
                            />
                          </a>
                        </Link>
                      </li>
                    </>
                  )}
                  {currentUser._id && !currentUser.isPerformer && (
                    <li className={router.pathname === '/cart' ? 'active' : ''}>
                      <Link href="/cart">
                        <a>
                          <ShoppingCartOutlined />
                          <Badge
                            className="cart-total"
                            count={cart.total}
                            showZero
                            overflowCount={9}
                          />
                        </a>
                      </Link>
                    </li>
                  )}
                  {currentUser._id && (
                    <li className={openSearch ? 'active' : ''} aria-hidden onClick={() => this.setState({ openSearch: !openSearch })}>
                      <a><SearchOutlined /></a>
                    </li>
                  )}
                  {!currentUser._id && (
                    <>
                      <li key="login" className={router.pathname === '/auth/login' ? 'active' : ''}>
                        <Link href="/auth/login">
                          <a>Log in</a>
                        </Link>
                      </li>
                      <li />
                      <li key="signup" className={router.pathname === '/auth/register' ? 'active' : ''}>
                        <Link href="/auth/register">
                          <a>Sign up</a>
                        </Link>
                      </li>
                    </>
                  )}
                  {currentUser._id && (
                    <li aria-hidden onClick={() => this.setState({ openProfile: true })}>
                      <Avatar src={currentUser?.avatar || '/no-avatar.png'} />
                    </li>
                  )}
                </ul>
              </div>
              <Drawer
                title="Search"
                closable
                onClose={() => this.setState({ openSearch: false })}
                visible={openSearch}
                key="search-drawer"
                className="profile-drawer"
                width={280}
              >
                <SearchBar />
              </Drawer>
              <Drawer
                title={(
                  <div className="profile-user">
                    <img src={currentUser?.avatar || '/no-avatar.png'} alt="avatar" />
                    <a className="profile-name">
                      {currentUser.name || 'N/A'}
                      <span>
                        @
                        {currentUser.username || 'n/a'}
                      </span>
                    </a>
                  </div>
                )}
                closable
                onClose={() => this.setState({ openProfile: false })}
                visible={openProfile}
                key="profile-drawer"
                className="profile-drawer"
                width={280}
              >
                {currentUser.isPerformer && (
                  <div className="profile-menu-item">
                    <Link href="/model/account">
                      <div className={router.pathname === '/model/account' ? 'menu-item active' : 'menu-item'}>
                        <EditOutlined />
                        {' '}
                        Edit Profile
                      </div>
                    </Link>
                    <Link
                      href={{ pathname: '/model/profile', query: { username: currentUser.username || currentUser._id } }}
                      as={`/model/${currentUser.username || currentUser._id}`}
                    >
                      <div className={router.pathname === `/model/${currentUser.username || currentUser._id}` ? 'menu-item active' : 'menu-item'}>
                        <UserOutlined />
                        {' '}
                        My Profile
                      </div>
                    </Link>
                    <Link href={{ pathname: '/model/black-list' }}>
                      <div className={router.pathname === '/model/black-list' ? 'menu-item active' : 'menu-item'}>
                        <BlockOutlined />
                        {' '}
                        Blacklist
                      </div>
                    </Link>
                    <Link href={{ pathname: '/model/my-subscriber' }}>
                      <div className={router.pathname === '/model/my-subscriber' ? 'menu-item active' : 'menu-item'}>
                        <HeartOutlined />
                        {' '}
                        My Subscribers
                      </div>
                    </Link>
                    <Link href={{ pathname: '/model/violations-reported' }}>
                      <div className={router.pathname === '/model/violations-reported' ? 'menu-item active' : 'menu-item'}>
                        <FlagOutlined />
                        {' '}
                        Violations Reported
                      </div>
                    </Link>
                    <Divider />
                    <Link href="/model/my-video">
                      <div className={router.pathname === '/model/my-video' ? 'menu-item active' : 'menu-item'}>
                        <VideoCameraOutlined />
                        {' '}
                        My Videos
                      </div>
                    </Link>
                    <Link href="/model/my-gallery/listing">
                      <div className={router.pathname === '/model/my-gallery/listing' ? 'menu-item active' : 'menu-item'}>
                        <PictureOutlined />
                        {' '}
                        My Galleries
                      </div>
                    </Link>
                    <Link href="/model/my-store">
                      <div className={router.pathname === '/model/my-store' ? 'menu-item active' : 'menu-item'}>
                        <ShoppingOutlined />
                        {' '}
                        My Products
                      </div>
                    </Link>
                    <Divider />
                    <Link href={{ pathname: '/model/my-order' }}>
                      <div className={router.pathname === '/model/my-order' ? 'menu-item active' : 'menu-item'}>
                        <ShoppingCartOutlined />
                        {' '}
                        Order History
                      </div>
                    </Link>
                    <Link href="/model/earning">
                      <div className={router.pathname === '/model/earning' ? 'menu-item active' : 'menu-item'}>
                        <LinkOutlined />
                        {' '}
                        Earning History
                      </div>
                    </Link>
                    <Link href="/model/payout-request">
                      <div className={router.pathname === '/model/payout-request' ? 'menu-item active' : 'menu-item'}>
                        <NotificationOutlined />
                        {' '}
                        Payout Requests
                      </div>
                    </Link>
                    {/* <Link href={{ pathname: '/model/banking' }}>
                      <div className={router.pathname === '/model/banking' ? 'menu-item active' : 'menu-item'}>
                        <BankOutlined />
                        {' '}
                        Banking (to earn)
                      </div>
                    </Link> */}
                    <Divider />
                    <div aria-hidden className="menu-item" onClick={() => this.beforeLogout()}>
                      <LogoutOutlined />
                      {' '}
                      Sign Out
                    </div>
                  </div>
                )}
                {!currentUser.isPerformer && (
                  <div className="profile-menu-item">
                    <Link href="/user/account">
                      <div className={router.pathname === '/user/account' ? 'menu-item active' : 'menu-item'}>
                        <EditOutlined />
                        {' '}
                        Edit Profile
                      </div>
                    </Link>
                    <Divider />
                    <Link href="/user/my-wishlist">
                      <div className={router.pathname === '/user/my-wishlist' ? 'menu-item active' : 'menu-item'}>
                        <HeartOutlined />
                        {' '}
                        My Wishlist
                      </div>
                    </Link>
                    <Link href="/user/my-favorite">
                      <div className={router.pathname === '/user/my-favorite' ? 'menu-item active' : 'menu-item'}>
                        <LikeOutlined />
                        {' '}
                        Favorite Videos
                      </div>
                    </Link>
                    <Link href="/user/my-subscription">
                      <div className={router.pathname === '/user/my-subscription' ? 'menu-item active' : 'menu-item'}>
                        <StarOutlined />
                        {' '}
                        My Subscriptions
                      </div>
                    </Link>
                    <Divider />
                    <Link href="/user/orders">
                      <div className={router.pathname === '/user/orders' ? 'menu-item active' : 'menu-item'}>
                        <ShoppingCartOutlined />
                        {' '}
                        Order History
                      </div>
                    </Link>
                    <Link href="/user/payment-history">
                      <div className={router.pathname === '/user/payment-history' ? 'menu-item active' : 'menu-item'}>
                        <LinkOutlined />
                        {' '}
                        Payment History
                      </div>
                    </Link>
                    <Divider />
                    <div className="menu-item" aria-hidden onClick={() => this.beforeLogout()}>
                      <LogoutOutlined />
                      {' '}
                      Sign Out
                    </div>
                  </div>
                )}
              </Drawer>
            </div>
          </Layout.Header>
        </div>
      </div>
    );
  }
}

Header.contextType = SocketContext;
const mapState = (state: any) => ({
  currentUser: state.user.current,
  ui: state.ui,
  cart: state.cart
});
const mapDispatch = { logout, addCart, clearCart };
export default connect(mapState, mapDispatch)(withRouter(Header));
