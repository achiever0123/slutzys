import React, { useEffect } from 'react';
import { Row, Col, Divider, Card, Avatar } from "antd";
import { MdMoreVert } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { FaComment, FaRegComment } from "react-icons/fa";
import { RiShareForwardLine, RiShareForwardFill } from "react-icons/ri";

import './profile-card.less';
const ProfileCard = ({ post }) => {
    const { Meta } = Card;
    return (
        <Card
            style={{ width: "100%", /*width: "100%" */ }}
            /* className="video-card" */
            className="feed-card-wrapper"
            /* hoverable */
            cover={
                <>
                    {/* <Meta
                        avatar={
                            <Avatar src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" shape="square" size={{ xs: 10, sm: 10, }} />
                        }
                        title="Card title"

                        style={{ padding: "10px 10px" }}
                        description="This is the description"
                    /> */}
                    <div className="card-header-wrapper"/* className="flex items-center px-2.5 cursor-pointer" */>
                        <Avatar
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            shape="square"
                            size={{ xs: 24, sm: 32, md: 40, lg: 60, xl: 60, xxl: 60 }}
                        />

                        {/* <Avatar src={post.userImg} className="!h-10 !w-10 cursor-pointer" /> */}
                        <div className="header-text-wrapper"/* className="mr-auto ml-2 leading-none" */>
                            <h6 /* className="font-medium hover:text-blue-500 hover:underline" */>
                                {'post.username'}
                            </h6>
                            <p className="text-sm dark:text-white/75 opacity-80">{"post.email"}</p>
                            {/* <TimeAgo
                                datetime={post.createdAt}
                                className="text-xs dark:text-white/75 opacity-80"
                            /> */}
                        </div>
                        <MdMoreVert className="more-icon" />
                        {/* {modalPost ? (
                            <IconButton onClick={() => setModalOpen(false)}>
                                <CloseRoundedIcon className="dark:text-white/75 h-7 w-7" />
                            </IconButton>
                        ) : (
                            <IconButton>
                                <MoreHorizRoundedIcon className="dark:text-white/75 h-7 w-7" />
                            </IconButton>
                        )} */}
                    </div>
                    <div className="post-description-wrapper">
                        <p>some comment</p>
                    </div>
                    {/* <Divider style={{ padding: "0px 0px" }} /> */}
                    <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                    {/* <img
                        style={{ padding: "0px 0px" }}
                        height={180}
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    /> */}
                </>
            }
        >{/* https://github.com/lukef7fywmrp/linkedin-clone-yt/blob/main/components/Post.js */}
            <div className="profile-card-actions-wrapper">
                <div className="card-action-icons-wrapper"><IoMdHeart className="card-action-icon" /><span>2k</span></div>
                <div className="card-action-icons-wrapper"><FaComment className="card-action-icon" /><span>2k</span></div>
                <div className="card-action-icons-wrapper"><RiShareForwardLine className="card-action-icon" /><span>2k</span></div>
            </div>
            {/* <Row justify="space-between" align="middle">
                <Col span={12}>Rock Songs</Col>
                <Col span={12} className="price-container">$5.00</Col></Row> */}
        </Card>
    );
}

export default ProfileCard;