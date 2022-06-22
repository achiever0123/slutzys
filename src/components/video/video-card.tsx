import { useState, useEffect } from 'react';
import {
  EyeFilled, LikeFilled, HourglassFilled, PlayCircleOutlined, CommentOutlined
} from '@ant-design/icons';
import { Tooltip, message, Row, Col, Divider, Card, Avatar, Button } from 'antd';
import { connect } from 'react-redux';
import { videoDuration } from '@lib/index';
import { IVideo, IUser } from 'src/interfaces';
import { shortenLargeNumber } from '@lib/number';
import Router from 'next/router';
import './video.less';
import HoverVideoPlayer from 'react-hover-video-player';
import {
  RelatedListVideo, VideoPlayer
} from '@components/video';
import {
  videoService, reactionService, paymentService, reportService, authService
} from '@services/index';
import TimeAgo from 'timeago-react';
import { MdMoreVert } from 'react-icons/md';


interface IProps {
  video: IVideo;
  user: IUser
}

const VideoCard = ({ video, user }: IProps) => {
  const [hover, setHover] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const { thumbnail, video: file, teaser } = video;
  const url = (thumbnail?.thumbnails && thumbnail?.thumbnails[0]) || thumbnail?.url || (teaser?.thumbnails && teaser?.thumbnails[0]) || (file?.thumbnails && file?.thumbnails[0]) || '/placeholder-image.jpg';

  const loadVideo = async () => {
    try {
      const videoVar = (await (
        await videoService.findOne(video?.slug || video?._id, {
          Authorization: authService.getToken()
        })
      ).data);
      setVideoInfo(videoVar);
    } catch (e) {
      console.log('video load error', e)
    }
  }
  useEffect(() => {
    loadVideo()
  }, [])
  console.log('videoInfo', videoInfo)
  const sellVideo = video?.isSaleVideo && video?.price > 0;
  const isScheduledVideo = video.isSchedule;
  const isVideoOwner = user?.isPerformer && video?.performerId === user?._id;
  const isUserLogin = user?._id;
  const isSubscribedToPerformer = video?.isSubscribed;
  const videoAllowed = isUserLogin && (video?.isBought || (!sellVideo/*  && isSubscribedToPerformer */) || isVideoOwner)
  const onClickViewVideo = () => {
    Router.push({ pathname: '/video', query: { id: video?.slug || video?._id } }, `/video/${video?.slug || video?._id}`);
  }
  const onNavigateToLogin = () => {
    Router.push('/auth/login');
  }
  const onClickBuyVideo = () => {

  }

  return (true ?
    <Card
      style={{ width: "100%" }}
      className="feed-card-wrapper"
      hoverable
      cover={
        <>
          <div className="card-header-wrapper">
            <Avatar
              src={videoInfo?.performer?.avatar || "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
              shape="square"
              size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
            />
            <div className="header-text-wrapper">
              <h6>
                <strong>{`${videoInfo?.performer?.username}`}</strong> uploaded a <strong>video</strong>
              </h6>
              <TimeAgo
                datetime={videoInfo?.updatedAt}
                className="text-xs dark:text-white/75 opacity-80"
              />
            </div>
            <MdMoreVert className="more-icon" />
          </div>
          <div
            aria-hidden
            onMouseEnter={(e: React.MouseEvent) => setHover(true)}
            onMouseLeave={(e: React.MouseEvent) => setHover(false)}
            onClick={() => {
              if (!user?._id) {
                message.error('Please login or register to check out videos!');
                Router.push('/auth/login');
                return;
              }
              if (user?.isPerformer && user?._id !== video?.performerId) return;
              Router.push({ pathname: '/video', query: { id: video?.slug || video?._id } }, `/video/${video?.slug || video?._id}`);
            }}
            className="vid-card"
            style={{
              backgroundImage: `url(${url})`, cursor: (!user?._id || (user?.isPerformer && video?.performerId !== user?._id)) ? 'not-allowed' : 'pointer',
              marginBottom: "0px"
            }}
          /* aria-hidden
          onClick={() => {
            if (!isUserLogin) {
              message.error('Please login or register to check out galleries!');
              //Router.push('/auth/login');
              return;
            }
            if (user?.isPerformer && !isGalleryOwner) return;
            if (sellGallery && !gallery?.isBought) {
              message.error(`Please buy pic set with ${gallery?.price} to view content`);
              return;
            }
            if (user && !isSubscribedToPerformer) {
              message.error(`Please subscribe to ${gallery?.performer?.name || gallery?.performer?.username || 'the model'} to view content`);
              return;
            }
            onClickViewGallery();              
          }}
          className="gallery-card-cover"
          style={{
            backgroundImage: `url(${thumbUrl})`,
            cursor:!galleryAllowed ? 'not-allowed' : 'pointer'
          }} */
          >
            {hover && videoInfo?.teaser?.url ? <div
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            >
              <HoverVideoPlayer
                videoSrc={videoInfo?.teaser?.url}
                style={{
                  height: '100%',
                  // The container should have a set 16:9 aspect ratio
                  // (https://css-tricks.com/aspect-ratio-boxes/)
                  paddingTop: '56.25%',
                }}
                sizingMode="container"
                muted={true}
                loop={true}
              />
            </div> :
              <span className="play-ico"><PlayCircleOutlined /></span>
            }
            <div className="vid-price">
              {video?.isSaleVideo && video?.price > 0 && (
                <span className="label-price">
                  $
                  {(video?.price || 0).toFixed(2)}
                </span>
              )}
              {video?.isSchedule && (
                <span className="label-price custom">
                  Upcoming
                </span>
              )}
            </div>
            <div className="vid-stats">
              <div className="like">
                <span>
                  <EyeFilled />
                  {' '}
                  {shortenLargeNumber(video?.stats?.views || 0)}
                </span>
                <span>
                  <LikeFilled />
                  {' '}
                  {shortenLargeNumber(video?.stats?.likes || 0)}
                </span>
                <span>
                  <CommentOutlined />
                  {' '}
                  {shortenLargeNumber(video?.stats?.comments || 0)}
                </span>
              </div>
              <div className="duration">
                <HourglassFilled />
                {' '}
                {videoDuration(video?.video?.duration || 0)}
              </div>
            </div>
            {/* <Tooltip title={video?.title}>
              <div className="vid-info">
                {video?.title}
              </div>
            </Tooltip> */}
            {/* {gallery?.isSale && gallery?.price > 0 && (
              <span className="vid-price">
                <div className="label-price">
                  $
                  {(gallery?.price || 0).toFixed(2)}
                </div>
              </span>
            )} */}
            {/* {galleryAllowed ?
              <span className="play-ico"><CameraOutlined /></span> :
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span className="play-ico"><LockOutlined /></span>
                {!isUserLogin && !sellGallery ?
                  <Button type="primary" className='buy-pic-set-btn' onClick={onNavigateToLogin}>Login</Button> :
                  <Button type="primary" className='buy-pic-set-btn' onClick={onClickBuyPicSet}>Buy Pic-Set</Button>
                }
              </div>
            } */}
            {/* <div className="vid-stats">
              <div className="like">
                <span>
                  <EyeOutlined />
                  {' '}
                  {shortenLargeNumber(gallery?.stats?.views || 0)}
                </span>
                <span>
                  <LikeOutlined />
                  {' '}
                  {shortenLargeNumber(gallery?.stats?.likes || 0)}
                </span>
                <span>
                  <CommentOutlined />
                  {' '}
                  {shortenLargeNumber(gallery?.stats?.comments || 0)}
                </span>
              </div>
              <div className="duration">
                <PictureOutlined />
                {' '}
                {gallery?.numOfItems || 0}
              </div>
            </div> */}
          </div>
        </>
      }
    >
      <div className='card-footer-wrapper'>
        <p className="title-container">{video?.title}</p>
        {videoAllowed ?
          <p><Button type="link" style={{ margin: "0px", padding: "0px" }} onClick={onClickViewVideo}>See pic set</Button></p> :
          (!isUserLogin && !sellVideo ?
            <p><Button type="link" style={{ margin: "0px", padding: "0px" }} onClick={onNavigateToLogin}>login</Button> to check out galleries</p> :
            <p className="price-container">{`$${videoInfo?.price}`}</p>
          )}
      </div>
    </Card> :
    <div
      aria-hidden
      onMouseEnter={(e: React.MouseEvent) => setHover(true)}
      onMouseLeave={(e: React.MouseEvent) => setHover(false)}
      onClick={() => {
        if (!user?._id) {
          message.error('Please login or register to check out videos!');
          Router.push('/auth/login');
          return;
        }
        if (user?.isPerformer && user?._id !== video?.performerId) return;
        Router.push({ pathname: '/video', query: { id: video?.slug || video?._id } }, `/video/${video?.slug || video?._id}`);
      }}
      className="vid-card"
      style={{ backgroundImage: `url(${url})`, cursor: (!user?._id || (user?.isPerformer && video?.performerId !== user?._id)) ? 'not-allowed' : 'pointer' }}
    >
      {hover && videoInfo?.teaser?.url ? <div
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      >
        <HoverVideoPlayer
          videoSrc={videoInfo?.teaser?.url}
          style={{
            height: '100%',
            // The container should have a set 16:9 aspect ratio
            // (https://css-tricks.com/aspect-ratio-boxes/)
            paddingTop: '56.25%',
          }}
          sizingMode="container"
          muted={true}
          loop={true}
        />
      </div> :
        <span className="play-ico"><PlayCircleOutlined /></span>
      }

      <div className="vid-price">
        {video?.isSaleVideo && video?.price > 0 && (
          <span className="label-price">
            $
            {(video?.price || 0).toFixed(2)}
          </span>
        )}
        {video?.isSchedule && (
          <span className="label-price custom">
            Upcoming
          </span>
        )}
      </div>
      <div className="vid-stats">
        <div className="like">
          <span>
            <EyeFilled />
            {' '}
            {shortenLargeNumber(video?.stats?.views || 0)}
          </span>
          <span>
            <LikeFilled />
            {' '}
            {shortenLargeNumber(video?.stats?.likes || 0)}
          </span>
          <span>
            <CommentOutlined />
            {' '}
            {shortenLargeNumber(video?.stats?.comments || 0)}
          </span>
        </div>
        <div className="duration">
          <HourglassFilled />
          {' '}
          {videoDuration(video?.video?.duration || 0)}
        </div>
      </div>
      <Tooltip title={video?.title}>
        <div className="vid-info">
          {video?.title}
        </div>
      </Tooltip>
    </div>
  );
};

const mapProps = (state) => ({
  user: state.user.current
});

export default connect(mapProps, {})(VideoCard);
