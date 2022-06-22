/* eslint-disable no-prototype-builtins */
import { PureComponent } from 'react';
import {
  Layout, Tabs, Button, message, Tooltip, Input, Modal, Spin, Radio, Avatar, Tag, PageHeader, Result
} from 'antd';
import {
  LikeOutlined, EyeOutlined, HourglassOutlined, HeartOutlined, HomeOutlined, ContactsOutlined,
  ClockCircleOutlined, ArrowRightOutlined, CalendarOutlined, FlagOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { TickIcon } from 'src/icons';
import { connect } from 'react-redux';
import Head from 'next/head';
import {
  videoService, reactionService, paymentService, reportService
} from '@services/index';
import {
  RelatedListVideo, VideoPlayer
} from '@components/video';
import {
  getComments, moreComment, createComment, deleteComment
} from '@redux/comment/actions';
import { ListComments, CommentForm } from '@components/comment';
import Link from 'next/link';
import Router from 'next/router';
import { SubscriptionPerformerBlock } from '@components/performer';
import ReportForm from '@components/report/report-form';
import { videoDuration, shortenLargeNumber, formatDate } from '@lib/index';
import {
  IVideo, IUser, IUIConfig, ICoupon, IPerformer, ISettings, IError
} from 'src/interfaces';
import { getRelated } from 'src/redux/video/actions';
import './video.less';

const { TabPane } = Tabs;

interface IProps {
  user: IUser;
  relatedVideos: any;
  commentState: any;
  getRelated: Function;
  getComments: Function;
  moreComment: Function;
  createComment: Function;
  deleteComment: Function;
  commentMapping: any;
  comment: any;
  ui: IUIConfig;
  settings: ISettings;
  video: IVideo;
  error: IError;
}

class VideoViewPage extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect = true;

  subscriptionType = 'monthly';

  static async getInitialProps({ ctx }) {
    const { query } = ctx;
    try {
      const video = (await (
        await videoService.findOne(query.id, {
          Authorization: ctx.token
        })
      ).data);

      return {
        video
      };
    } catch (e) {
      return { error: await e };
    }
  }

  state = {
    videoStats: {
      likes: 0, favourites: 0, wishlists: 0, comments: 0, views: 0
    },
    itemPerPage: 24,
    commentPage: 0,
    couponCode: '',
    isApplyCoupon: false,
    coupon: null as ICoupon,
    submiting: false,
    requesting: false,
    isLiked: false,
    isFavourited: false,
    isWishlist: false,
    activeTab: 'description',
    gateway: 'ccbill',
    openReportModal: false
  };

  async componentDidMount() {
    this.onUpdateStats();
  }

  componentDidUpdate(prevProps) {
    const { video } = this.props;
    if (prevProps.video._id !== video._id) {
      this.onUpdateStats();
    }
  }

  handleReport = async (payload: any) => {
    const { video } = this.props;
    if (!payload.title) return;
    try {
      await this.setState({ requesting: true });
      await reportService.create({
        ...payload, target: 'video', targetId: video._id, performerId: video.performerId
      });
      message.success('Video has been reported for violation');
    } catch (e) {
      const err = await e;
      message.error(err.message || 'error occured, please try again later');
    } finally {
      this.setState({ requesting: false, openReportModal: false });
    }
  }

  onChangeTab = (tab: string) => {
    this.setState({ activeTab: tab });
  }

  onReaction = async (action: string) => {
    const { video, user } = this.props;
    if (!user || !user._id) {
      message.error('Please login');
      return;
    }
    const {
      videoStats, isLiked, isWishlist, isFavourited
    } = this.state;
    try {
      const postData = {
        objectId: video._id,
        action,
        objectType: 'video'
      };
      switch (action) {
        case 'like': isLiked ? await reactionService.delete(postData) : await reactionService.create(postData);
          break;
        case 'favourite': isFavourited ? await reactionService.delete(postData) : await reactionService.create(postData);
          break;
        case 'watch_later': isWishlist ? await reactionService.delete(postData) : await reactionService.create(postData);
          break;
        default: break;
      }
      if (action === 'like') {
        this.setState({
          isLiked: !isLiked,
          videoStats: {
            ...videoStats,
            likes: videoStats.likes + (!isLiked ? 1 : -1)
          }
        });
      }
      if (action === 'favourite') {
        this.setState({
          isFavourited: !isFavourited,
          videoStats: {
            ...videoStats,
            favourites: videoStats.favourites + (!isFavourited ? 1 : -1)
          }
        });
        message.success(`${isFavourited ? 'Removed from' : 'Added to'} My Favorite successfully`);
      }
      if (action === 'watch_later') {
        this.setState({
          isWishlist: !isWishlist,
          videoStats: {
            ...videoStats,
            wishlists: videoStats.wishlists + (!isWishlist ? 1 : -1)
          }
        });
        message.success(`${isWishlist ? 'Removed from' : 'Added to'} My Wishlist successfully`);
      }
    } catch (e) {
      const error = await e;
      message.error(error.message || 'Error occured, please try again later');
    }
  }

  moreComment = async () => {
    const { video, moreComment: handleLoadMore } = this.props;
    const { commentPage, itemPerPage } = this.state;
    await this.setState({
      commentPage: commentPage + 1
    });
    handleLoadMore({
      limit: itemPerPage,
      offset: (commentPage + 1) * itemPerPage,
      objectId: video._id
    });
  }

  onUpdateStats = () => {
    const { video, getComments: getCommentsHandler, getRelated: getRelatedHandler } = this.props;
    const { itemPerPage } = this.state;
    this.setState({
      videoStats: video.stats,
      isLiked: video.isLiked,
      isFavourited: video.isFavourited,
      isWishlist: video.isWishlist
    });
    getCommentsHandler({
      objectId: video._id,
      limit: itemPerPage,
      offset: 0
    });
    getRelatedHandler({
      performerId: video.performerId,
      excludedId: video._id,
      status: 'active',
      limit: 24
    });
  }

  deleteComment = (item) => {
    const { deleteComment: handleDelete } = this.props;
    if (!window.confirm('Are you sure to remove this comment?')) return;
    handleDelete(item._id);
  }

  buyVideo = async () => {
    try {
      const { video, user } = this.props;
      if (!user || !user._id) {
        message.error('Please login or register to purchase videos!');
        Router.push('/auth/login');
        return;
      }
      if (video.isSchedule) {
        message.info(`Watch this video when it premiers on ${formatDate(video.scheduledAt, 'll')}. Add it to your Wishlist so you don't miss it!`, 10);
        return;
      }
      const { couponCode, gateway } = this.state;
      const data = { couponCode, videoId: video._id, paymentGateway: gateway };
      await this.setState({ submiting: true });
      const resp = await (await paymentService.purchaseVideo(data)).data;
      if (resp) {
        message.info('Redirecting to payment gateway, do not reload page at this time', 30);
        if (['ccbill', 'verotel'].includes(gateway)) window.location.href = resp.paymentUrl;
      }
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  subscribe = async (paymentGateway = 'ccbill', type = 'monthly') => {
    const { video, user } = this.props;
    if (!user._id) {
      message.error('You can subscribe to the models just as soon as you login/register.');
      Router.push('/auth/login');
      return;
    }
    try {
      await this.setState({ submiting: true });
      const resp = await (
        await paymentService.subscribe({ type, performerId: video.performer._id, paymentGateway })
      ).data;
      message.info('Redirecting to payment gateway, do not reload page at this time', 30);
      if (['ccbill', 'verotel'].includes(paymentGateway)) window.location.href = resp.paymentUrl;
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  applyCoupon = async () => {
    try {
      const { video, user } = this.props;
      if (!user || !user._id) {
        return;
      }
      const { isApplyCoupon, couponCode } = this.state;
      if (isApplyCoupon) {
        this.setState({ isApplyCoupon: false, coupon: null, couponCode: '' });
        return;
      }
      await this.setState({ requesting: true });
      const resp = await paymentService.applyCoupon(couponCode);
      this.setState({ isApplyCoupon: true, coupon: resp.data, requesting: false });
      message.success(`Yay! You have saved $${(video.price - resp.data.value * video.price).toFixed(2)}!`);
    } catch (error) {
      const e = await error;
      message.error(e?.message || 'Error occured, please try again later');
      this.setState({ requesting: false });
    }
  }

  increaseView = async () => {
    const { video } = this.props;
    const { videoStats } = this.state;
    await videoService.increaseView(video._id);
    this.setState({ videoStats: { ...videoStats, views: videoStats.views + 1 } });
  }

  render() {
    const {
      user, ui, video, settings, error,
      relatedVideos = {
        requesting: false,
        error: null,
        success: false,
        items: []
      },
      commentMapping, comment, createComment: handleCreateComment
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
    const { requesting: commenting } = comment;
    const fetchingComment = commentMapping.hasOwnProperty(video?._id) ? commentMapping[video?._id].requesting : false;
    const comments = commentMapping.hasOwnProperty(video?._id) ? commentMapping[video?._id].items : [];
    const totalComments = commentMapping.hasOwnProperty(video?._id) ? commentMapping[video?._id].total : video?.stats.comments;
    const {
      videoStats, isLiked, isFavourited, isWishlist, isApplyCoupon, coupon, couponCode,
      submiting, requesting, activeTab, gateway, openReportModal
    } = this.state;
    const thumbUrl = video?.thumbnail?.url || (video?.video?.thumbnails && video?.video?.thumbnails[0]) || (video?.teaser?.thumbnails && video?.teaser?.thumbnails[0]) || '/no-image.jpg';
    const videoJsOptions = {
      key: video?.fileId,
      controls: true,
      playsinline: true,
      poster: thumbUrl,
      sources: [
        {
          src: video?.video?.url || '',
          type: 'video/mp4'
        }
      ]
    };

    const teaserOptions = {
      key: video?.teaserId,
      autoplay: true,
      controls: true,
      playsinline: true,
      loop: true,
      sources: [
        {
          src: video?.teaser?.url || '',
          type: 'video/mp4'
        }
      ]
    };
console.log('teaserOptions 2', teaserOptions)
console.log('videoJsOptions 2', videoJsOptions)
    return (
      <Layout>
        <Head>
          <title>
            {`${ui.siteName} | ${video?.title || 'Video'}`}
          </title>
          <meta name="keywords" content={video?.description} />
          <meta name="description" content={video?.description} />
          {/* OG tags */}
          <meta
            property="og:title"
            content={`${ui.siteName} | ${video?.title || 'Video'}`}
            key="title"
          />
          <meta property="og:image" content={thumbUrl} />
          <meta property="og:keywords" content={video?.description} />
          <meta
            property="og:description"
            content={video?.description}
          />
          {/* Twitter tags */}
          <meta
            name="twitter:title"
            content={`${ui.siteName} | ${video?.title || 'Video'}`}
          />
          <meta name="twitter:image" content={thumbUrl} />
          <meta
            name="twitter:description"
            content={video?.description}
          />
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title={video?.title}
          />
          <div className="vid-duration">
            <a>
              <EyeOutlined />
              &nbsp;
              {shortenLargeNumber(videoStats?.views || 0)}
              &nbsp;&nbsp;
              <HourglassOutlined />
              &nbsp;
              {videoDuration(video?.video?.duration || video?.teaser?.duration || 0)}
            </a>
            <a>
              <CalendarOutlined />
              &nbsp;
              {formatDate(video?.updatedAt, 'll')}
            </a>
          </div>
          <div className="vid-player">
            {((!video?.isSaleVideo && video?.isSubscribed && !video?.isSchedule) || (video?.isSaleVideo && video?.isBought && !video?.isSchedule)) && (
              <div className="main-player">
                <div className="vid-group custom">
                  {video?.processing ? (
                    <div className="vid-processing">
                      <Spin />
                      <p>Video file is currently on processing</p>
                    </div>
                  ) : <VideoPlayer {...videoJsOptions} onPlay={this.increaseView} />}
                </div>
              </div>
            )}
            {((video?.isSaleVideo && !video?.isBought) || (!video?.isSaleVideo && !video?.isSubscribed) || video?.isSchedule) && (
              <div className="main-player">
                <div className={video?.isSchedule ? 'vid-group custom' : 'vid-group'}>
                  <div className="left-group">
                    {video?.teaser && video?.teaserProcessing && (
                      <div className="vid-processing">
                        <Spin />
                        <p>Teaser is currently on processing</p>
                      </div>
                    )}
                    {video?.teaser && !video?.teaserProcessing && <VideoPlayer {...teaserOptions} />}
                    {!video?.teaser && (<div className="video-thumbs" style={{ backgroundImage: `url(${thumbUrl})` }} />)}
                    {!video?.isSaleVideo && !video?.isSubscribed && !video.isSchedule && (
                      <div className="vid-exl-group">
                        <h4>{!user._id ? 'SIGN UP TO ACCESS FULL VIDEO' : 'SUBSCRIBE TO ACCESS FULL VIDEO'}</h4>
                        <h3>
                          CHECK SUBSCRIPTION PLANS HERE
                          {' '}
                          <ArrowRightOutlined />
                        </h3>
                      </div>
                    )}
                    {video?.isSaleVideo && !video?.isBought && !video?.isSchedule && (
                      <div className="vid-exl-group">
                        <h4>{!user._id ? 'SIGN UP TO ACCESS FULL VIDEO' : 'UNLOCK TO VIEW FULL CONTENT'}</h4>
                        <h3>
                          PAY $
                          {coupon ? (video?.price - video?.price * coupon.value).toFixed(2) : (video?.price || 0).toFixed(2)}
                          {' '}
                          TO UNLOCK
                          {' '}
                          <ArrowRightOutlined />
                        </h3>
                      </div>
                    )}
                    {video.isSchedule && (
                      <div className="vid-exl-group">
                        <h4>{`Watch this video when it premiers on ${formatDate(video?.scheduledAt, 'll')}`}</h4>
                        <h3 aria-hidden onClick={this.onReaction.bind(this, 'watch_later')}>
                          ADD IT TO YOUR WISHLIST SO YOU DON&apos;T MISS IT
                        </h3>
                      </div>
                    )}
                  </div>
                  {!video?.isSaleVideo && !video?.isSubscribed && !video?.isSchedule && (
                    <div className="right-group">
                      <h3 className="title">SUBSCRIBE TO VIEW</h3>
                      <SubscriptionPerformerBlock performer={video?.performer} onSelect={this.subscribe} settings={settings} disabled={user?.isPerformer || (!settings.ccbillEnabled && !settings.verotelEnabled)} />
                    </div>
                  )}
                  {video?.isSaleVideo && !video?.isBought && !video?.isSchedule && (
                    <div className="right-group">
                      <h3 className="title">UNLOCK TO VIEW</h3>
                      <div className="member-plans">
                        <Radio.Group onChange={(e) => this.setState({ gateway: e.target.value })} value={gateway}>
                          {settings?.ccbillEnabled && (
                            <Radio value="ccbill">
                              <img src="/ccbill-ico.png" height="25px" alt="ccbill" />
                            </Radio>
                          )}
                          {settings?.verotelEnabled && (
                            <Radio value="verotel">
                              <img src="/verotel-ico.png" height="25px" alt="verotel" />
                            </Radio>
                          )}
                          {/* {ui?.enablePagseguro && (
                          <Radio value="pagseguro">
                            <img src="/pagseguro-ico.png" height="20px" alt="pagseguro" />
                          </Radio>
                          )} */}
                        </Radio.Group>
                        {(!settings?.ccbillEnabled && !settings?.verotelEnabled) && <p>No payment gateway was configured, please try again later!</p>}
                        <Input.Group style={{ margin: '5px 0', display: 'flex' }}>
                          <Input
                            onChange={(e) => this.setState({ couponCode: e.target.value })}
                            placeholder="Enter coupon code here"
                            disabled={isApplyCoupon}
                            value={couponCode}
                          />
                          <Button
                            style={{ marginLeft: 2, borderRadius: 3 }}
                            disabled={!couponCode || submiting || !user._id}
                            className={(isApplyCoupon || couponCode) ? 'success' : 'default'}
                            onClick={() => this.applyCoupon()}
                          >
                            <strong>{!isApplyCoupon ? 'Apply coupon!' : 'Remove coupon!'}</strong>
                          </Button>
                        </Input.Group>
                        <div className="checkout-price">
                          TOTAL:
                          {' '}
                          <span className={isApplyCoupon ? 'discount-p' : ''}>
                            $
                            {(video?.price).toFixed(2)}
                          </span>
                          {' '}
                          {coupon && (
                            <span>
                              $
                              {(video?.price - coupon.value * video?.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button
                          className="primary"
                          onClick={() => this.buyVideo()}
                          disabled={submiting || requesting || (!settings?.ccbillEnabled && !settings?.verotelEnabled)}
                          loading={submiting}
                        >
                          <strong>CHECKOUT</strong>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="middle-split">
          <div className="main-container">
            <div className="middle-actions">
              <Link
                href={{
                  pathname: '/model/profile',
                  query: { username: video?.performer?.username || video?.performer?._id }
                }}
                as={`/model/${video?.performer?.username || video?.performer?._id}`}
              >
                <a>
                  <div className="o-w-ner">
                    <Avatar
                      alt="performer avatar"
                      src={video?.performer?.avatar || '/user.png'}
                    />
                    <span className="owner-name">
                      <span>
                        {video?.performer?.name || 'N/A'}
                        {' '}
                        {video?.performer?.verifiedAccount && <TickIcon />}
                      </span>
                      <span style={{ fontSize: '10px' }}>
                        @
                        {video?.performer?.username || 'n/a'}
                      </span>
                    </span>
                  </div>
                </a>
              </Link>
              <div className="act-btns">
                <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                  <Button
                    disabled={!user?._id || user?.isPerformer}
                    className={isLiked ? 'react-btn active' : 'react-btn'}
                    onClick={() => this.onReaction('like')}
                  >
                    {shortenLargeNumber(videoStats?.likes || 0)}
                    {' '}
                    <LikeOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title={isFavourited ? 'Remove from Favorites' : 'Add to Favorites'}>
                  <Button
                    disabled={!user?._id || user?.isPerformer}
                    className={isFavourited ? 'react-btn active' : 'react-btn'}
                    onClick={() => this.onReaction('favourite')}
                  >
                    {shortenLargeNumber(videoStats?.favourites || 0)}
                    {' '}
                    <HeartOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title={isWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                  <Button
                    disabled={!user?._id || user?.isPerformer}
                    className={isWishlist ? 'react-btn active' : 'react-btn'}
                    onClick={() => this.onReaction('watch_later')}
                  >
                    {shortenLargeNumber(videoStats?.wishlists || 0)}
                    {' '}
                    <ClockCircleOutlined />
                  </Button>
                </Tooltip>
                <Button
                  disabled={!user?._id || !video?.isSubscribed || user?.isPerformer}
                  className={openReportModal ? 'react-btn active' : 'react-btn'}
                  onClick={() => this.setState({ openReportModal: true })}
                >
                  <FlagOutlined />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="middle-info">
          <div className="main-container">
            {video?.tags.length > 0 && (
              <div className="vid-tags">
                Tags:
                {' '}
                {video?.tags.map((tag) => (
                  <a aria-hidden key={tag} onClick={() => Router.push({ pathname: '/search', query: { q: tag } })}>
                    <Tag>
                      #
                      {tag}
                    </Tag>
                  </a>
                ))}
              </div>
            )}
            <Tabs
              activeKey={activeTab}
              onChange={this.onChangeTab.bind(this)}
            >
              <TabPane tab="Description" key="description">
                <p>{video?.description || 'No description...'}</p>
              </TabPane>
              <TabPane
                tab={(
                  <span>
                    Performers (
                    {video?.participants?.length || 0}
                    )
                  </span>
                )}
                key="participants"
              >
                {video?.participants && video?.participants.length > 0 ? (
                  video?.participants.map((per: IPerformer) => (
                    <Link
                      key={per._id}
                      href={{
                        pathname: '/model/profile',
                        query: { username: per?.username || per?._id }
                      }}
                      as={`/model/${per?.username || per?._id}`}
                    >
                      <a>
                        <div key={per._id} className="participant-card">
                          <img
                            alt="per_atv"
                            src={per?.avatar || '/no-avatar.png'}
                          />
                          <div className="participant-info">
                            <h4>
                              {per?.name || 'N/A'}
                              {' '}
                              {per?.verifiedAccount && <TickIcon />}
                            </h4>
                            <h5>
                              @
                              {per?.username || 'n/a'}
                            </h5>
                            <Tooltip title={per?.bio}>
                              <div className="p-bio">
                                {per.bio || 'No bio'}
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))
                ) : (
                  <p>No profile was found.</p>
                )}
              </TabPane>
              <TabPane
                tab={(
                  <span>
                    Comments (
                    {totalComments}
                    )
                  </span>
                )}
                key="comment"
              >
                <CommentForm
                  creator={user}
                  onSubmit={handleCreateComment.bind(this)}
                  objectId={video?._id}
                  objectType="video"
                  requesting={commenting}
                />
                <ListComments
                  key={`list_comments_${video?._id}_${comments.length}`}
                  requesting={fetchingComment}
                  comments={comments}
                  total={totalComments}
                  onDelete={this.deleteComment.bind(this)}
                  user={user}
                  canReply
                />
                {comments.length < totalComments && <p className="text-center"><a aria-hidden onClick={this.moreComment.bind(this)}>More comments...</a></p>}
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className="main-container">
          <div className="related-items">
            <h4 className="ttl-1">You may also like</h4>
            {relatedVideos.requesting && <div className="text-center"><Spin /></div>}
            {relatedVideos.items.length > 0 && !relatedVideos.requesting && (
              <RelatedListVideo videos={relatedVideos.items} />
            )}
            {!relatedVideos.items.length && !relatedVideos.requesting && (
              <p>No video was found</p>
            )}
          </div>
        </div>
        <Modal
          key="report_post"
          className="subscription-modal"
          title={`Report video ${video?.title}`}
          visible={openReportModal}
          confirmLoading={submiting}
          footer={null}
          destroyOnClose
          onCancel={() => this.setState({ openReportModal: false })}
        >
          <ReportForm submiting={submiting} onFinish={this.handleReport.bind(this)} />
        </Modal>
      </Layout>
    );
  }
}

const mapStates = (state: any) => {
  const { commentMapping, comment } = state.comment;
  return {
    user: { ...state.user.current },
    ui: { ...state.ui },
    settings: { ...state.settings },
    relatedVideos: { ...state.video.relatedVideos },
    commentMapping,
    comment
  };
};

const mapDispatch = {
  getRelated,
  getComments,
  moreComment,
  createComment,
  deleteComment
};
export default connect(mapStates, mapDispatch)(VideoViewPage);
