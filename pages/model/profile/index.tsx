import { PureComponent } from "react";
import { Layout, Tabs, Button, message, Modal, Tooltip, Result, Upload } from "antd";
import { connect } from "react-redux";
import {
  getVideos,
  moreVideo,
  getVods,
  moreVod,
  resetVideoState,
} from "@redux/video/actions";
import {
  getGalleries,
  moreGalleries,
  resetGalleryState,
  getPosts,
  morePosts,
  resetPostState
} from "@redux/gallery/actions";
import {
  listProducts,
  moreProduct,
  resetProductState,
} from "@redux/product/actions";
import { performerService, paymentService, utilsService, getGlobalConfig, authService } from "src/services";
import Head from "next/head";
import {
  LikeOutlined,
  ArrowLeftOutlined,
  ShoppingOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  ContactsOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
import { TickIcon, MessageIcon, SaleVidIcon } from "src/icons";
import { ScrollListVideo, VideoPlayer } from "@components/video";
import { ScrollListProduct } from "@components/product/scroll-list-item";
import {
  ConfirmSubscriptionPerformerForm,
  PerformerInfo,
} from "@components/performer";
import { ScrollListGallery } from "@components/gallery";
import { shortenLargeNumber } from "@lib/index";
import {
  IPerformer,
  IUser,
  IUIConfig,
  ISettings,
  ICountry,
  IError,
} from "src/interfaces";
import Router from "next/router";
import { formatDateNoTime, getDiffDate } from "@lib/date";
import { Row, Col, Divider, Card, Avatar } from "antd";
import { RiSnapchatLine, RiTwitterLine } from "react-icons/ri";
import { BsCameraVideoFill, BsCalendar, BsFlag } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { IoMaleFemale, IoLocationOutline } from "react-icons/io5";
import { FaDollarSign } from "react-icons/fa";
import FeedList from "./FeedList";
import EditProfile from "@components/performer/editProfile";
import { AvatarUpload } from '@components/user/avatar-upload-rect';
import { CoverUpload } from '@components/user/cover-upload';

import {
  updateCurrentUserAvatar, updateCurrentUserCover
} from 'src/redux/user/actions';

import "@components/performer/performer.less";
import "./profile.less";
import "./profile.css";


interface IProps {
  ui: IUIConfig;
  countries: ICountry[];
  error: IError;
  settings: ISettings;
  user: IUser;
  performer: IPerformer;
  query: any;
  listProducts: Function;
  getVideos: Function;
  moreVideo: Function;
  getVods: Function;
  moreProduct: Function;
  moreVod: Function;
  videoState: any;
  saleVideoState: any;
  productState: any;
  getGalleries: Function;
  moreGalleries: Function;
  getPosts: Function;
  morePosts: Function;
  galleryState: any;
  postState: any;
  resetVideoState: Function;
  resetProductState: Function;
  resetGalleryState: Function;
  resetPostState: Function;
  phoneCodes: any;
  languages: any;
  bodyInfo: any;
}

class PerformerProfile extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect = true;

  subscriptionType = "monthly";

  state = {
    offset: 0,
    currentTab: "feed",
    tab: "feed",
    itemPerPage: 24,
    videoPage: 0,
    vodPage: 0,
    productPage: 0,
    galleryPage: 0,
    postPage: 0,
    showWelcomVideo: false,
    openSubscriptionModal: false,
    submiting: false,
  };

  static async getInitialProps({ ctx }) {
    try {
      const { query } = ctx;
      const [performer, countries, phoneCodes, languages, bodyInfo] = await Promise.all([
        performerService.findOne(query.username, {
          Authorization: ctx.token || "",
        }),
        utilsService.countriesList(),
        utilsService.phoneCodesList(),
        utilsService.languagesList(),
        utilsService.bodyInfo()
      ]);
      return {
        performer: performer.data,
        countries: countries.data,
        phoneCodes: phoneCodes?.data || [],
        languages: languages?.data || [],
        bodyInfo: bodyInfo?.data
      };
    } catch (e) {
      return { error: await e };
    }
  }
  onScroll = () => this.setState({ offset: window.pageYOffset });
  async componentDidMount() {
    const { performer } = this.props;

    if (performer) {
      const notShownWelcomeVideos = localStorage.getItem(
        "notShownWelcomeVideos"
      );
      const showWelcomVideo =
        !notShownWelcomeVideos ||
        (notShownWelcomeVideos &&
          !notShownWelcomeVideos.includes(performer._id));
      this.setState({ showWelcomVideo });
      this.loadItems();
    }
    this.setState({ offset: window.pageYOffset });
    //const onScroll = () => this.setState({ offset: window.pageYOffset });
    window.removeEventListener('scroll', this.onScroll);
    window.addEventListener("scroll", this.onScroll, { passive: true })
  }

  componentWillUnmount() {
    const {
      resetGalleryState: resetGal,
      resetPostState: resetPost,
      resetProductState: resetProd,
      resetVideoState: resetVid,
    } = this.props;
    resetGal();
    resetPost();
    resetProd();
    resetVid();
    window.removeEventListener('scroll', this.onScroll);
  }

  loadMoreItem = async () => {
    const {
      moreVideo: moreVideoHandler,
      moreProduct: moreProductHandler,
      moreGalleries: moreGalleryHandler,
      morePosts: morePostHandler,
      moreVod: moreVodHandler,
      videoState: videosVal,
      productState: productsVal,
      saleVideoState: saleVideosVal,
      galleryState: galleryVal,
      postState: postVal,
      performer,
    } = this.props;

    const { videoPage, itemPerPage, vodPage, productPage, galleryPage, postPage, tab } =
      this.state;
    const query = {
      limit: itemPerPage,
      performerId: performer._id,
    };
    if (tab === "video") {
      if (videosVal.items.length >= videosVal.total) return;
      this.setState({ videoPage: videoPage + 1 });
      moreVideoHandler({
        ...query,
        offset: (videoPage + 1) * itemPerPage,
        isSaleVideo: false,
      });
    }
    if (tab === "saleVideo") {
      if (saleVideosVal.items.length >= saleVideosVal.total) return;
      this.setState({ vodPage: vodPage + 1 });
      moreVodHandler({
        ...query,
        offset: (vodPage + 1) * itemPerPage,
        isSaleVideo: true,
      });
    }
    if (tab === "gallery") {
      if (galleryVal.items.length >= galleryVal.total) return;
      this.setState({ galleryPage: galleryPage + 1 });
      moreGalleryHandler({
        ...query,
        offset: (galleryPage + 1) * itemPerPage,
      });
    }
    if (tab === "feed") {
      if (postVal.items.length >= postVal.total) return;
      this.setState({ postPage: postPage + 1 });
      morePostHandler({
        ...query,
        offset: (postPage + 1) * itemPerPage,
      });
    }
    if (tab === "store") {
      if (productsVal.items.length >= productsVal.total) return;
      this.setState({ productPage: productPage + 1 });
      moreProductHandler({
        ...query,
        offset: (productPage + 1) * itemPerPage,
      });
    }
  };

  loadItems = () => {
    const { itemPerPage, tab } = this.state;
    const {
      performer,
      getGalleries: getGalleriesHandler,
      getPosts: getPostsHandler,
      listProducts: listProductsHandler,
      getVideos: getVideosHandler,
      getVods: getVodsHandler,
    } = this.props;
    const query = {
      limit: itemPerPage,
      offset: 0,
      performerId: performer._id,
    };
    switch (tab) {
      case "video":
        this.setState({ videoPage: 0 });
        getVideosHandler({
          ...query,
          isSaleVideo: false,
        });
        break;
      case "saleVideo":
        this.setState({ vodPage: 0 });
        getVodsHandler({
          ...query,
          isSaleVideo: true,
        });
        break;
      case "gallery":
        this.setState({ galleryPage: 0 });
        getGalleriesHandler(query);
        break;
      case "feed":
        this.setState({ postPage: 0 });
        getPostsHandler(query);
        break;
      case "store":
        this.setState({ productPage: 0 });
        listProductsHandler(query);
        break;
      default:
        break;
    }
  };

  handleViewWelcomeVideo = () => {
    const { performer } = this.props;
    const notShownWelcomeVideos = localStorage.getItem("notShownWelcomeVideos");
    if (!notShownWelcomeVideos?.includes(performer._id)) {
      const Ids = JSON.parse(notShownWelcomeVideos || "[]");
      const values = Array.isArray(Ids)
        ? Ids.concat([performer._id])
        : [performer._id];
      localStorage.setItem("notShownWelcomeVideos", JSON.stringify(values));
    }
    this.setState({ showWelcomVideo: false });
  };

  handleClickMessage = () => {
    const { user, performer } = this.props;
    if (!user._id) {
      message.error(
        "You can message a model just as soon as you login/register.’"
      );
      Router.push("/auth/login");
      return;
    }
    if (!performer.isSubscribed) {
      message.error(
        `Please subscribe to ${performer?.name || performer?.username || "the model"
        } to start chatting`
      );
      return;
    }
    Router.push({
      pathname: "/messages",
      query: {
        toSource: "performer",
        toId: performer?._id,
      },
    });
  };

  handleClickSubscribe = () => {
    const { user } = this.props;
    if (!user._id) {
      message.error(
        "You can subscribe to the models just as soon as you login/register."
      );
      Router.push("/auth/login");
      return;
    }
    this.setState({ openSubscriptionModal: true });
  };

  async subscribe(paymentGateway = "ccbill") {
    const { performer } = this.props;
    try {
      await this.setState({ submiting: true });
      const resp = await (
        await paymentService.subscribe({
          type: this.subscriptionType,
          performerId: performer._id,
          paymentGateway,
        })
      ).data;
      message.info(
        "Redirecting to payment gateway, do not reload page at this time",
        30
      );
      if (["ccbill", "verotel"].includes(paymentGateway))
        window.location.href = resp.paymentUrl;
    } catch (e) {
      const err = await e;
      message.error(err?.message || "error occured, please try again later");
      this.setState({ submiting: false });
    }
  }

  changeTab = (tab) => {
    this.setState({ tab }, () => this.loadItems());
  };

  onAvatarUploaded = (data: any) => {
    message.success('Changes saved.');
    updateCurrentUserAvatar(data.response.data.url);
  }

  onCoverUploaded = (data: any) => {
    message.success('Changes saved.');
    updateCurrentUserCover(data.response.data.url);
  }


  render() {
    const {
      error,
      performer,
      ui,
      countries,
      settings,
      user,
      videoState: videoProps,
      productState: productProps,
      saleVideoState: saleVideoProps,
      galleryState: galleryProps,
      postState: postProps,
      phoneCodes,
      languages,
      bodyInfo
    } = this.props;
    if (error) {
      return (
        <Result
          status={error?.statusCode === 404 ? "404" : "error"}
          title={error?.statusCode === 404 ? null : error?.statusCode}
          subTitle={
            error?.statusCode === 404
              ? "Alas! It hurts us to realize that we have let you down. We are not able to find the page you are hunting for :("
              : error?.message
          }
          extra={[
            <Button
              className="secondary"
              key="console"
              onClick={() => Router.push("/")}
            >
              <HomeOutlined />
              BACK HOME
            </Button>,
            <Button
              key="buy"
              className="primary"
              onClick={() => Router.push("/contact")}
            >
              <ContactsOutlined />
              CONTACT US
            </Button>,
          ]}
        />
      );
    }
    const {
      items: videos = [],
      total: totalVideos,
      requesting: loadingVid,
    } = videoProps;
    const {
      items: saleVideos = [],
      total: totalVods,
      requesting: loadingVod,
    } = saleVideoProps;
    const {
      items: products,
      total: totalProducts,
      requesting: loadingProduct,
    } = productProps;
    const {
      items: galleries,
      total: totalGalleries,
      requesting: loadingGallery,
    } = galleryProps;
    const {
      items: posts,
      total: totalPosts,
      requesting: loadingPost,
    } = postProps;
    const {
      showWelcomVideo,
      openSubscriptionModal,
      submiting,
      currentTab,
      tab,
      offset,
    } = this.state;
    const country =
      countries.length &&
      countries.find(
        (c) => c.name === performer?.country || c.code === performer?.country
      );
    const isCurrentUserProfile = user._id === performer._id;
    const uploadHeaders = {
      authorization: authService.getToken()
    };
    console.log('posts', posts)
    console.log('performer', performer)
    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | ${performer?.name || performer?.username || ""
              }`}
          </title>
          <meta
            name="keywords"
            content={`${performer?.username}, ${performer?.name}`}
          />
          <meta name="description" content={performer?.bio} />
          {/* OG tags */}
          <meta
            property="og:title"
            content={`${ui?.siteName} | ${performer?.name || performer?.username || ""
              }`}
            key="title"
          />
          <meta
            property="og:image"
            content={performer?.avatar || "/no-avatar.png"}
          />
          <meta
            property="og:keywords"
            content={`${performer?.username}, ${performer?.name}`}
          />
          <meta property="og:description" content={performer?.bio} />
          {/* Twitter tags */}
          <meta
            name="twitter:title"
            content={`${ui?.siteName} | ${performer?.name || performer?.username || ""
              }`}
          />
          <meta
            name="twitter:image"
            content={performer?.avatar || "/no-avatar.png"}
          />
          <meta name="twitter:description" content={performer?.bio} />
        </Head>
        <div className="main-container-new">
          <div className="banner-wrapper-new">
            <div
              className="top-profile-new"
              style={{
                position: "relative",
                backgroundImage: performer?.cover
                  ? `url('${performer?.cover}')`
                  : "url('/banner-image.jpg')",
              }}
            >
              {isCurrentUserProfile &&
                <div className="cover-upload">
                  <CoverUpload
                    headers={uploadHeaders}
                    uploadUrl={performerService.getCoverUploadUrl()}
                    onUploaded={this.onCoverUploaded.bind(this)}
                    image={performer?.cover || "/banner-image.jpg"}
                    options={{ fieldName: 'cover' }}
                  />
                </div>
              }
              <div className="bg-2nd">
                <div className="top-banner">
                  <a
                    aria-hidden
                    className="arrow-back"
                    onClick={() => Router.back()}
                  >
                    <ArrowLeftOutlined />
                  </a>
                  <div className="stats-row">
                    <div className="tab-stat">
                      {/* <div className="tab-item">
                      <span>
                        {shortenLargeNumber(performer?.stats?.views || 0)}
                        {' '}
                        <EyeOutlined />
                      </span>
                    </div> */}
                      <div className="tab-item">
                        <span>
                          {shortenLargeNumber(
                            performer?.stats?.totalVideos || 0
                          )}{" "}
                          <VideoCameraOutlined />
                        </span>
                      </div>
                      <div className="tab-item">
                        <span>
                          {shortenLargeNumber(
                            performer?.stats?.totalPhotos || 0
                          )}{" "}
                          <PictureOutlined />
                        </span>
                      </div>
                      <div className="tab-item">
                        <span>
                          {shortenLargeNumber(
                            performer?.stats?.totalProducts || 0
                          )}{" "}
                          <ShoppingOutlined />
                        </span>
                      </div>
                      <div className="tab-item">
                        <span>
                          {shortenLargeNumber(performer?.stats?.likes || 0)}{" "}
                          <LikeOutlined />
                        </span>
                      </div>
                      <div className="tab-item">
                        <span>
                          {shortenLargeNumber(
                            performer?.stats?.subscribers || 0
                          )}{" "}
                          <UsergroupAddOutlined />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-list">
              <ul className="mb-0">
                <li
                  className={`inline-block ${tab === "feed" && "active"}`}
                  onClick={() => this.changeTab("feed")}
                >
                  <h5 className="font-bold mb-0 block">
                    {shortenLargeNumber(performer?.stats?.totalGalleries || 0)}
                  </h5>
                  <small className="text-muted profile-list-btn">feed</small>
                </li>
                <li
                  className={`inline-block ${tab === "video" && "active"}`}
                  onClick={() => this.changeTab("video")}
                >
                  <h5 className="font-bold mb-0 block">
                    {shortenLargeNumber(/* performer?.stats?.totalGalleries */totalVideos || 0)}
                  </h5>
                  <small className="text-muted profile-list-btn">video</small>
                </li>
                <li
                  className={`inline-block ${tab === "saleVideo" && "active"}`}
                  onClick={() => this.changeTab("saleVideo")}
                >
                  <h5 className="font-bold mb-0 block">
                    {shortenLargeNumber(/* performer?.stats?.totalVideos */totalVods || 0)}{" "}
                  </h5>
                  <small className="text-muted">saleVideo</small>
                </li>
                <li
                  className={`inline-block ${tab === "gallery" && "active"}`}
                  onClick={() => this.changeTab("gallery")}
                >
                  <h5 className="font-bold mb-0 block">
                    {shortenLargeNumber(/* performer?.stats?.totalPhotos */totalGalleries || 0)}
                  </h5>
                  <small className="text-muted">gallery</small>
                </li>
                {/* <li
                  className={`inline-block ${tab === "store" && "active"}`}
                  onClick={() => this.changeTab("store")}
                >
                  <h5 className="font-bold mb-0 block">My</h5>
                  <small className="text-muted">About</small>
                </li> */}
                {isCurrentUserProfile && (
                  <li
                    className={`inline-block ${tab === "edit-profile" && "active"
                      }`}
                    onClick={() => this.changeTab("edit-profile")}
                  >
                    <h5 className="font-bold mb-0 block">Edit</h5>
                    <small className="text-muted">Profile</small>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="model-content-wrapper-new">
            <Row justify="center">
              <Col
                xs={{ span: 23 }}
                sm={{ span: 22 }}
                md={{ span: 7 }}
                lg={{ span: 6 }}
                xl={{ span: 5 }}
                xxl={{ span: 4 }}
              >
                <div className="main-profile-new">
                  <div className="fl-col-new">
                    {isCurrentUserProfile ?
                      <AvatarUpload
                        headers={uploadHeaders}
                        uploadUrl={performerService.getAvatarUploadUrl()}
                        onUploaded={this.onAvatarUploaded.bind(this)}
                        image={performer?.avatar || "/no-avatar.png"}
                      /> :
                      <div style={{ position: "relative" }} className="avatar-wrapper">
                        <img
                          alt="Avatar"
                          src={performer?.avatar || "/no-avatar.png"}
                        />
                      </div>
                    }
                    <div className="user-profile-detail-sm-wrapper m-user-name-sm">
                      <Tooltip title={performer?.name}>
                        <h4>
                          {performer?.name || "N/A"}
                          &nbsp;
                          {performer?.verifiedAccount && <TickIcon />}
                        </h4>
                      </Tooltip>
                      <h5>@{performer?.username || "n/a"}</h5>
                      <div className="border-bottom"></div>
                    </div>
                    <div className="user-profile-detail-sm-wrapper">
                      {isCurrentUserProfile ? (
                        <Button
                          className="primary btn-follow"
                          onClick={() => this.handleClickMessage()}
                        >
                          Create campaign
                        </Button>
                      ) : (!performer?.isSubscribed ?
                        <Button
                          className="primary btn-follow"
                          disabled={(submiting && this.subscriptionType === 'monthly') || user?.isPerformer}
                          onClick={() => {
                            this.subscriptionType = 'monthly';
                            this.handleClickSubscribe();
                          }}
                        >
                          ${performer.monthlyPrice.toFixed(2)}/mo Subscribe
                        </Button> :
                        <Button
                          className="primary btn-follow"
                          onClick={() => this.handleClickMessage()}
                        >
                          Chat
                        </Button>
                      )}
                    </div>
                    <div className="user-profile-detail-md-wrapper">
                      <p style={{ textAlign: "center" }}>last seen 20 minutes ago</p>
                      {isCurrentUserProfile ? (
                        <Button
                          className="primary btn-follow"
                          onClick={() => this.handleClickMessage()}
                        >
                          Create campaign
                        </Button>
                      ) : (!performer?.isSubscribed ?
                        <Button
                          className="primary btn-follow"
                          disabled={(submiting && this.subscriptionType === 'monthly') || user?.isPerformer}
                          onClick={() => {
                            this.subscriptionType = 'monthly';
                            this.handleClickSubscribe();
                          }}
                        >
                          ${performer.monthlyPrice.toFixed(2)}/mo Subscribe
                        </Button> :
                        <Button
                          className="primary btn-follow"
                          onClick={() => this.handleClickMessage()}
                        >
                          Chat
                        </Button>
                      )}
                      {!isCurrentUserProfile && (
                        <ul className="social-icon-wrapper">
                          {performer.isSubscribed ? (
                            <li className="inline-block" onClick={() => this.handleClickMessage()}>
                              <IoIosSend className="social-icon-small" />
                              <small className="text-muted">Chat</small>
                            </li>
                          ) : (
                            <li className="inline-block"
                              onClick={() => {
                                this.subscriptionType = 'yearly';
                                this.handleClickSubscribe();
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <FaDollarSign className="social-icon-small" />{" "}
                                <span className="social-icon-small"><strong>{performer?.yearlyPrice.toFixed(2)}</strong>{`/yr`}</span>
                              </div>
                              <small className="text-muted">Subscribe</small>
                            </li>
                          )}
                          <li className="inline-block">
                            <BsCameraVideoFill className="social-icon-small" />
                            <small className="text-muted">Video Call</small>
                          </li>
                          <li className="inline-block">
                            <WhatsAppOutlined className="social-icon-small" />
                            <small className="text-muted">Custom</small>
                          </li>
                          <li className="inline-block">
                            <FaDollarSign className="social-icon-small" />
                            <small className="text-muted">Tip</small>
                          </li>
                        </ul>
                      )}
                      <div className="banner-wrapper-new user-profile-box">
                        <div className="m-user-name">
                          <Tooltip title={performer?.name}>
                            <h4>
                              {performer?.name || "N/A"}
                              &nbsp;
                              {performer?.verifiedAccount && <TickIcon />}
                            </h4>
                          </Tooltip>
                          <h5>@{performer?.username || "n/a"}</h5>
                          <div className="border-bottom"></div>
                        </div>
                        <div className="social-icon-wrapper">
                          <RiSnapchatLine className="social-icon" />
                          <RiTwitterLine className="social-icon" />
                          <InstagramOutlined className="social-icon" />
                        </div>
                        <div className="user-bio">
                          <h5>{performer?.bio || "n/a"}</h5>
                        </div>
                        <ul className="user-profile-list-wrapper">
                          <li className="inline-block">
                            <BsCalendar className="user-profile-list-icon" />
                            <small className="text-muted">
                              {" "}
                              <i className="fas fa-image mr-1"></i>
                              {formatDateNoTime(performer.createdAt)}
                            </small>
                          </li>
                          <li className="inline-block">
                            <IoMaleFemale className="user-profile-list-icon" />
                            <small className="text-muted">
                              {" "}
                              <i className="fas fa-image mr-1"></i>
                              {performer?.gender}
                            </small>
                          </li>
                          {performer?.dateOfBirth && (
                            <li className="inline-block">
                              <WhatsAppOutlined className="user-profile-list-icon" />
                              <small className="text-muted">
                                {`${getDiffDate(performer?.dateOfBirth)}+`}
                              </small>
                            </li>
                          )}
                          {country && (
                            <li className="inline-block">
                              <BsFlag className="user-profile-list-icon" />
                              <small className="text-muted">
                                {country?.name}
                              </small>
                            </li>
                          )}
                          <li className="inline-block">
                            <IoLocationOutline className="user-profile-list-icon" />
                            <small className="text-muted">
                              {" "}
                              <i className="fas fa-image mr-1"></i>Videos
                            </small>
                          </li>
                        </ul>
                        <p className="view-more-btn">View More</p>
                      </div>
                    </div>
                  </div>
                  <div className="user-bio-sm">
                    <p>{"If you want specific control over the positioning and placement of the Icon, then that should be done by placing the Icon component within the"/* {performer?.bio || "n/a"} */}</p>
                  </div>
                  {!isCurrentUserProfile && (
                    <ul className={`social-icon-wrapper-sm ${offset > 300 && "social-icon-wrapper-sm-fixed"}`}>
                      {performer.isSubscribed ? (
                        <li className="inline-block" onClick={() => this.handleClickMessage()}>
                          <IoIosSend className="social-icon-small" />
                          <small className="text-muted">Chat</small>
                        </li>
                      ) : (
                        <li className="inline-block"
                          onClick={() => {
                            this.subscriptionType = 'monthly';
                            this.handleClickSubscribe();
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <FaDollarSign className="social-icon-small" />
                            <span className="social-icon-small"><strong>{performer.monthlyPrice.toFixed(2)}</strong>{`/mo`}</span>
                          </div>{" "}

                          <small className="text-muted">Subscribe</small>
                        </li>
                      )}
                      <li className="inline-block">
                        <BsCameraVideoFill className="social-icon-small" />
                        <small className="text-muted">Video Call</small>
                      </li>
                      <li className="inline-block">
                        <WhatsAppOutlined className="social-icon-small" />
                        <small className="text-muted">Custom</small>
                      </li>
                      <li className="inline-block">
                        <FaDollarSign className="social-icon-small" />
                        <small className="text-muted">Tip</small>
                      </li>
                    </ul>
                  )}
                  <div className="divider-line-sm"></div>
                  <div className="profile-list-sm">
                    <ul className="mb-0">
                      <li
                        className={`inline-block ${tab === "feed" && "active"}`}
                        onClick={() => this.changeTab("feed")}
                      >
                        <h5 className="font-bold mb-0 block">
                          {shortenLargeNumber(performer?.stats?.totalGalleries || 0)}
                        </h5>
                        <small className="text-muted profile-list-btn">feed</small>
                      </li>
                      <li
                        className={`inline-block ${tab === "video" && "active"}`}
                        onClick={() => this.changeTab("video")}
                      >
                        <h5 className="font-bold mb-0 block">
                          {shortenLargeNumber(performer?.stats?.totalGalleries || 0)}
                        </h5>
                        <small className="text-muted profile-list-btn">video</small>
                      </li>
                      <li
                        className={`inline-block ${tab === "saleVideo" && "active"}`}
                        onClick={() => this.changeTab("saleVideo")}
                      >
                        <h5 className="font-bold mb-0 block">
                          {shortenLargeNumber(performer?.stats?.totalVideos || 0)}{" "}
                        </h5>
                        <small className="text-muted">saleVideo</small>
                      </li>
                      <li
                        className={`inline-block ${tab === "gallery" && "active"}`}
                        onClick={() => this.changeTab("gallery")}
                      >
                        <h5 className="font-bold mb-0 block">
                          {shortenLargeNumber(performer?.stats?.totalPhotos || 0)}
                        </h5>
                        <small className="text-muted">gallery</small>
                      </li>
                      <li
                        className={`inline-block ${tab === "store" && "active"}`}
                        onClick={() => this.changeTab("store")}
                      >
                        <h5 className="font-bold mb-0 block">My</h5>
                        <small className="text-muted">About</small>
                      </li>
                      {isCurrentUserProfile && (
                        <li
                          className={`inline-block ${tab === "edit-profile" && "active"
                            }`}
                          onClick={() => this.changeTab("dit-profile")}
                        >
                          <h5 className="font-bold mb-0 block">Edit</h5>
                          <small className="text-muted">Profile</small>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 22 }}
                md={{ span: 16 }}
                lg={{ span: 16 }}
                xl={{ span: 13 }}
                xxl={{ span: 12 }}
              >
                <div className="inner-content-wrapper-new">
                  {tab === "video" ? (
                    <>
                      <ScrollListVideo
                        items={videos}
                        loading={loadingVid}
                        canLoadmore={videos && videos.length < totalVideos}
                        loadMore={this.loadMoreItem.bind(this)}
                      />
                    </>
                  ) : tab === "saleVideo" ? (
                    <>
                      <ScrollListVideo
                        items={saleVideos}
                        loading={loadingVod}
                        canLoadmore={
                          saleVideos && saleVideos.length < totalVods
                        }
                        loadMore={this.loadMoreItem.bind(this)}
                      />
                    </>
                  ) : tab === "gallery" ? (
                    <>
                      <ScrollListGallery
                        items={galleries}
                        loading={loadingGallery}
                        canLoadmore={
                          galleries && galleries.length < totalGalleries
                        }
                        loadMore={this.loadMoreItem.bind(this)}
                      />
                    </>
                  ) : tab === "store" ? (
                    <>
                      <ScrollListProduct
                        items={products}
                        loading={loadingProduct}
                        canLoadmore={
                          products && products.length < totalProducts
                        }
                        loadMore={this.loadMoreItem.bind(this)}
                      />
                    </>
                  ) : tab === "edit-profile" ? (
                    <>
                      <div style={{ backgroundColor: "white", padding: "20px" }}>
                        <EditProfile
                          phoneCodes={phoneCodes}
                          languages={languages}
                          bodyInfo={bodyInfo}
                          countries={countries}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <FeedList
                        isCurrentUserProfile={isCurrentUserProfile}
                        items={posts}
                        loading={loadingPost}
                        canLoadmore={
                          posts && posts.length < totalPosts
                        }
                        loadMore={this.loadMoreItem.bind(this)}
                      />
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
        {performer &&
          performer?.welcomeVideoPath &&
          performer?.activateWelcomeVideo && (
            <Modal
              key="welcome-video"
              destroyOnClose
              width={767}
              visible={showWelcomVideo}
              title={null}
              onCancel={() => this.setState({ showWelcomVideo: false })}
              footer={[
                <Button
                  key="close"
                  className="secondary"
                  onClick={() => this.setState({ showWelcomVideo: false })}
                >
                  Close
                </Button>,
                <Button
                  style={{ marginLeft: 0 }}
                  key="close-show"
                  className="primary"
                  onClick={this.handleViewWelcomeVideo.bind(this)}
                >
                  Don&apos;t show me again
                </Button>,
              ]}
            >
              <VideoPlayer
                {...{
                  key: performer?._id,
                  autoplay: true,
                  controls: true,
                  playsinline: true,
                  fluid: true,
                  sources: [
                    {
                      src: performer?.welcomeVideoPath,
                      type: "video/mp4",
                    },
                  ],
                }}
              />
            </Modal>
          )}
        <Modal
          key="subscribe_performer"
          centered
          width={600}
          title={null}
          visible={openSubscriptionModal}
          confirmLoading={submiting}
          footer={null}
          onCancel={() => this.setState({ openSubscriptionModal: false })}
        >
          <ConfirmSubscriptionPerformerForm
            settings={settings}
            type={this.subscriptionType || "monthly"}
            performer={performer}
            submiting={submiting}
            onFinish={this.subscribe.bind(this)}
          />
        </Modal>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  settings: { ...state.settings },
  videoState: { ...state.video.videos },
  saleVideoState: { ...state.video.saleVideos },
  productState: { ...state.product.products },
  galleryState: { ...state.gallery.galleries },
  postState: { ...state.gallery.posts },
  user: { ...state.user.current },
});

const mapDispatch = {
  getVideos,
  moreVideo,
  getVods,
  listProducts,
  moreProduct,
  getGalleries,
  moreGalleries,
  getPosts,
  morePosts,
  moreVod,
  resetProductState,
  resetVideoState,
  resetGalleryState,
  resetPostState,
};
export default connect(mapStates, mapDispatch)(PerformerProfile);
