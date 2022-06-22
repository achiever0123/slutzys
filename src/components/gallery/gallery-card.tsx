import { message, Tooltip } from 'antd';
import {
  EyeOutlined, CameraOutlined, PictureOutlined, LikeOutlined, CommentOutlined
} from '@ant-design/icons';
import Router from 'next/router';
import { connect } from 'react-redux';
import { shortenLargeNumber } from '@lib/number';
import { IGallery, IUser } from 'src/interfaces';
import '@components/video/video.less';
import { Row, Col, Divider, Card, Avatar } from "antd";

interface GalleryCardIProps {
  gallery: IGallery;
  user: IUser;
}

const GalleryCard = ({ gallery, user }: GalleryCardIProps) => {
  const { Meta } = Card;
  const thumbUrl = gallery?.coverPhoto?.thumbnails[0] || gallery?.coverPhoto?.url || '/placeholder-image.jpg';
  return (
    <>
      <div
        aria-hidden
        onClick={() => {
          if (!user?._id) {
            message.error('Please login or register to check out galleries!');
            Router.push('/auth/login');
            return;
          }
          if (user?.isPerformer && gallery?.performerId !== user?._id) return;
          if (user && !gallery?.isSubscribed) {
            message.error(`Please subscribe to ${gallery?.performer?.name || gallery?.performer?.username || 'the model'} to view content`);
            return;
          }
          Router.push({ pathname: '/gallery', query: { id: gallery?.slug || gallery?._id } }, `/gallery/${gallery?.slug || gallery?._id}`);
        }}
        className="vid-card"
        style={{
          backgroundImage: `url(${thumbUrl})`,
          cursor: (!user?._id || (user?.isPerformer && gallery?.performerId !== user?._id) || !gallery?.isSubscribed) ? 'not-allowed' : 'pointer'
        }}
      >
        {gallery?.isSale && gallery?.price > 0 && (
          <span className="vid-price">
            <div className="label-price">
              $
              {(gallery?.price || 0).toFixed(2)}
            </div>
          </span>
        )}
        <span className="play-ico"><CameraOutlined /></span>
        <div className="vid-stats">
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
        </div>
        <Tooltip title={gallery?.name}>
          <div className="vid-info">
            {gallery?.name}
          </div>
        </Tooltip>
      </div>
    </>
  );
};

const mapProps = (state) => ({
  user: state.user.current
});

export default connect(mapProps, {})(GalleryCard);
