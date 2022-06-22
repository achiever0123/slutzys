import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Card, Avatar, Input, Button, Switch } from "antd";
import { MdMoreVert } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaComment, FaRegComment } from "react-icons/fa";
import { RiShareForwardLine, RiShareForwardFill } from "react-icons/ri";
import DropzoneComponent from '@components/common/DropzoneComponent.js';
import AddPostComponent from "./AddPostComponent";
import PostVideoUpload from '../my-video/post-video-upload';
import AddGalleryCard from '@components/elements/add-gallery-card';
import './add-post.less';
const ProfileCard = () => {
    const { Meta } = Card;
    const { TextArea } = Input;
    const [currentTab, setCurrentTab] = useState('post');
    const [currentTab2, setCurrentTab2] = useState('image');
    const onChangeTab = (tab) => {
        setCurrentTab(tab);
    }
    const onChangeTab2 = (tab) => {
        setCurrentTab2(tab);
    }
    return (
        <Card
            style={{ width: "100%" }}
            className="add-post-card-wrapper"
        /* hoverable */
        >
            <Row className='add-post-header-tabs-wrapper' justify="center" gutter={32}>
                <Col span={6}>
                    <div className={`add-post-header-tabs ${currentTab === 'post' && "active"}`} onClick={() => onChangeTab('post')}>
                        Post
                    </div>
                </Col>
                <Col span={6}>
                    <div className={`add-post-header-tabs ${currentTab === 'clips' && "active"}`} onClick={() => onChangeTab('clips')}>
                        Clips
                    </div>
                </Col>
                <Col span={6}>
                    <div className={`add-post-header-tabs ${currentTab === 'pic-set' && "active"}`} onClick={() => onChangeTab('pic-set')}>
                        Pic Set
                    </div>
                </Col>
                <Col span={6}>
                    <div className={`add-post-header-tabs ${currentTab === 'live-show' && "active"}`} onClick={() => onChangeTab('live-show')}>
                        Live show
                    </div>
                </Col>
            </Row>
            {currentTab === 'post' &&
                /* <div >
                    <TextArea className="post-card-textarea" rows={4} placeholder="Post photo or videos" maxLength={6} />
                    <Row >
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <div className='button-tab-wrapper'>
                                <div className={`tab-button ${currentTab2 === 'image' && "active"}`}>
                                    <Button type="primary" onClick={() => onChangeTab2('image')}>
                                        Image
                                    </Button>
                                </div>
                                <div className={`tab-button ${currentTab2 === 'video' && "active"}`}>
                                    <Button type="primary" onClick={() => onChangeTab2('video')}>
                                        Video
                                    </Button>
                                </div>
                                <div className={`tab-button ${currentTab2 === 'tag' && "active"}`}>
                                    <Button type="primary" onClick={() => onChangeTab2('tag')}>
                                        Tag
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <DropzoneComponent className="post-card-image-drop" />

                    <Row className='post-btn-wrapper'>
                        <Col span={24} style={{ textAlign: 'left' }}>
                            <Switch defaultChecked onChange={(checked) => console.log(checked)} /><span className='swith-label'>Premium</span>
                        </Col>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" danger>
                                Post
                            </Button>
                        </Col>
                    </Row>
                </div> */
                < AddPostComponent />
            }
            {currentTab === 'clips' &&
                <PostVideoUpload />
            }
            {currentTab === 'pic-set' &&
                <AddGalleryCard />
            }
        </Card>
    );
}

export default ProfileCard;