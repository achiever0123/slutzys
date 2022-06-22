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
    return (
        <Card
            style={{ width: "100%", /*width: "100%" */ }}
            className="feed-card-wrapper"
            hoverable
            cover={
                <>
                    <div className="card-header-wrapper">
                        <Avatar
                            src={gallery?.performer?.avatar || "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
                            shape="square"
                            size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
                        />
                        <div className="header-text-wrapper">
                            <h6>
                                <strong>{`${gallery?.performer?.username}`}</strong> uploaded a <strong>pic set</strong>
                            </h6>
                            <TimeAgo
                                datetime={gallery?.updatedAt}
                                className="text-xs dark:text-white/75 opacity-80"
                            />
                        </div>
                        <MdMoreVert className="more-icon" />
                    </div>
                    <div
                        aria-hidden
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
                            //Router.push({ pathname: '/gallery', query: { id: gallery?.slug || gallery?._id } }, `/gallery/${gallery?.slug || gallery?._id}`);
                        }}
                        className="gallery-card-cover"
                        style={{
                            backgroundImage: `url(${thumbUrl})`,
                            cursor: /*( !user?._id || (user?.isPerformer && gallery?.performerId !== user?._id) || !gallery?.isSubscribed) */!galleryAllowed ? 'not-allowed' : 'pointer'
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
                        {galleryAllowed ?
                            <span className="play-ico"><CameraOutlined /></span> :
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <span className="play-ico"><LockOutlined /></span>
                                {!isUserLogin && !sellGallery ?
                                    <Button type="primary" className='buy-pic-set-btn' onClick={onNavigateToLogin}>Login</Button> :
                                    <Button type="primary" className='buy-pic-set-btn' onClick={onClickBuyPicSet}>Buy Pic-Set</Button>
                                }
                            </div>

                        }
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
                    </div>
                </>
            }
        >
            <div className='card-footer-wrapper'>
                <p className="title-container">{gallery?.name}</p>
                {galleryAllowed ?
                    <p><Button type="link" style={{ margin: "0px", padding: "0px" }} onClick={onClickViewGallery}>See pic set</Button></p> :
                    (!isUserLogin && !sellGallery ?
                        <p><Button type="link" style={{ margin: "0px", padding: "0px" }} onClick={onNavigateToLogin}>login</Button> to check out galleries</p> :
                        <p className="price-container">{`$${gallery?.price}`}</p>
                    )}
            </div>
        </Card>
    );
};

const mapProps = (state) => ({
    user: state.user.current
});

export default connect(mapProps, {})(GalleryCard);
