import { message, Tooltip } from 'antd';
import {
    EyeOutlined, CameraOutlined, PictureOutlined, LikeOutlined, CommentOutlined, LockOutlined
} from '@ant-design/icons';
import Router from 'next/router';
import { connect } from 'react-redux';
import { shortenLargeNumber } from '@lib/number';
import { IGallery, IUser } from 'src/interfaces';
import '@components/video/video.less';
import { Row, Col, Divider, Card, Avatar, Button } from "antd";

import React, { useEffect } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { FaDollarSign } from "react-icons/fa";
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaComment, FaRegComment } from "react-icons/fa";
import { RiShareForwardLine, RiShareForwardFill } from "react-icons/ri";
import TimeAgo from 'timeago-react';
import './profile-card.less';

interface GalleryCardIProps {
    gallery: IGallery;
    user: IUser;
}

const GalleryCard = ({ gallery, user }: GalleryCardIProps) => {
    const { Meta } = Card;
    const thumbUrl = gallery?.coverPhoto?.thumbnails[0] || gallery?.coverPhoto?.url || '/placeholder-image.jpg';
    const sellGallery = gallery?.isSale && gallery?.price > 0;
    const isGalleryOwner = user?.isPerformer && gallery?.performerId === user?._id;
    const isUserLogin = user?._id;
    const isSubscribedToPerformer = gallery?.isSubscribed;
    const galleryAllowed = isUserLogin && (gallery?.isBought || (!sellGallery/*  && isSubscribedToPerformer */) || isGalleryOwner)
    const onClickViewGallery = () => {
        Router.push({ pathname: '/gallery', query: { id: gallery?.slug || gallery?._id } }, `/gallery/${gallery?.slug || gallery?._id}`);
    }
    const onNavigateToLogin = () => {
        Router.push('/auth/login');
    }
    const onClickBuyPicSet = () => {

    }
    console.log('gallery', gallery)
    return (
        <Card
            style={{ width: "100%" }}
            className="feed-card-wrapper"
            /* hoverable */
            cover={
                <>
                    <div className="card-header-wrapper">
                        <Avatar
                            src={gallery?.performer?.avatar || "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
                            shape="square"
                            size={{ xs: 24, sm: 32, md: 40, lg: 60, xl: 60, xxl: 60 }}
                        />
                        <div className="header-text-wrapper">
                            <h6>
                                <strong>{`${gallery?.performer?.username}`}</strong> uploaded a <strong>image</strong>
                            </h6>
                            <TimeAgo
                                datetime={gallery?.updatedAt}
                                className="text-xs dark:text-white/75 opacity-80"
                            />
                        </div>
                        <MdMoreVert className="more-icon" />
                    </div>
                    <div className="post-description-wrapper">
                        <p>{gallery?.description}</p>
                    </div>
                    <img alt="example" src={thumbUrl} className={`${!galleryAllowed && "filtered-image"}`} />
                </>
            }
        >
            <div className="profile-card-actions-wrapper">
                <div className="card-action-icons-wrapper"><IoMdHeart className="card-action-icon" /><span>{gallery?.stats?.likes}</span></div>
                <div className="card-action-icons-wrapper"><FaComment className="card-action-icon" /><span>{gallery?.stats?.comments}</span></div>
                <div className="card-action-icons-wrapper"><RiShareForwardLine className="card-action-icon" /><span>2k</span></div>
                <div className="card-action-icons-wrapper"><FaDollarSign className="card-action-icon" /><span>Tips</span></div>
            </div>
        </Card>
    );
};

const mapProps = (state) => ({
    user: state.user.current
});

export default connect(mapProps, {})(GalleryCard);
