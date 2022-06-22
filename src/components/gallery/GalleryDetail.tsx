/* eslint-disable no-prototype-builtins */
import { PureComponent } from 'react';
import {
    Layout, message, Row, Col, Spin, Button, Tabs, Avatar, PageHeader, Result
} from 'antd';
import {
    EyeOutlined, CalendarOutlined, LikeOutlined, CommentOutlined, ArrowLeftOutlined,
    HomeOutlined, ContactsOutlined
} from '@ant-design/icons';
import { TickIcon } from 'src/icons';
import { connect } from 'react-redux';
import Head from 'next/head';
import {
    galleryService, photoService, reactionService, paymentService
} from '@services/index';
import { getRelatedGalleries } from '@redux/gallery/actions';
import {
    IGallery, IUser, IUIConfig, IError, ISettings
} from 'src/interfaces';
import {
    getComments, moreComment, createComment, deleteComment
} from '@redux/comment/actions';
import { ListComments, CommentForm } from '@components/comment';
import GalleryCard from '@components/gallery/gallery-card';
import PhotoPreviewList from '@components/photo/photo-preview-list';
import { SubscriptionPerformerBlock } from '@components/performer';
import Link from 'next/link';
import Router from 'next/router';
import { shortenLargeNumber } from '@lib/number';
import { formatDate } from '@lib/date';
import './index.less';

interface IProps {
    error: IError;
    gallery: IGallery;
    query: any;
    user: IUser;
    ui: IUIConfig;
    getRelatedGalleries: Function;
    relatedGalleries: any;
    getComments: Function;
    moreComment: Function;
    createComment: Function;
    deleteComment: Function;
    commentMapping: any;
    comment: any;
    settings: ISettings;
}

const initialState = {
    offset: 0,
    total: 0,
    fetching: false,
    photos: [],
    isLiked: false,
    openSubscriptionModal: false,
    submiting: false,
    totalLikes: 0,
    commentPage: 0,
    itemPerPage: 12,
    activeTab: 'description'
};

class GalleryViewPage extends PureComponent<IProps> {
    static authenticate = true;

    static async getInitialProps({ ctx }) {
        const { query } = ctx;
        try {
            const gallery = (await (
                await galleryService.userViewDetails(query.id, {
                    Authorization: ctx.token
                })
            ).data);
            return {
                gallery
            };
        } catch (e) {
            return { error: await e };
        }
    }

    state = {
        ...initialState,
        submiting: false
    };

    async componentDidMount() {
        const { gallery } = this.props;
        if (gallery) {
            this.setState({ isLiked: gallery.isLiked, totalLikes: gallery?.stats?.likes });
        }
        this.getInitialValues();
    }

    async componentDidUpdate(prevProps) {
        const { gallery } = this.props;
        if (prevProps?.gallery?._id !== gallery?._id) {
            // eslint-disable-next-line react/no-did-update-set-state
            await this.setState({ ...initialState });
            this.getInitialValues();
        }
    }

    async getInitialValues() {
        const { gallery, getRelatedGalleries: getRelatedHandler, getComments: getCommentsHandler } = this.props;
        const { itemPerPage } = this.state;
        this.getPhotos();
        getRelatedHandler({
            performerId: gallery.performerId,
            excludedId: gallery._id,
            status: 'active',
            limit: 24
        });
        getCommentsHandler({
            objectId: gallery._id,
            limit: itemPerPage,
            offset: 0
        });
    }

    async getPhotos() {
        const { gallery } = this.props;
        const { offset, photos } = this.state;
        try {
            await this.setState({ fetching: true });
            const resp = await (await photoService.userSearch({
                galleryId: gallery._id,
                limit: 40,
                offset: offset * 40
            })).data;
            this.setState({ photos: photos.concat(resp.data), total: resp.total });
            // preload image
            resp.data.forEach((img) => {
                setTimeout(() => { new Image().src = img?.photo?.url; }, 1000);
                return img;
            });
        } catch (e) {
            const err = await e;
            message.error(err?.message || 'Error on getting photos, please try again later');
        } finally {
            this.setState({ fetching: false });
        }
    }

    async getMorePhotos() {
        const { offset } = this.state;
        await this.setState({ offset: offset + 1 });
        this.getPhotos();
    }

    handleLike = async () => {
        const { gallery } = this.props;
        const { totalLikes, isLiked } = this.state;
        const payload = {
            objectId: gallery._id,
            action: 'like',
            objectType: 'gallery'
        };
        try {
            await this.setState({ submiting: true });
            if (!isLiked) {
                await reactionService.create(payload);
                this.setState({ submiting: false, isLiked: true, totalLikes: totalLikes + 1 });
            }
            if (isLiked) {
                await reactionService.delete(payload);
                this.setState({ submiting: false, isLiked: false, totalLikes: totalLikes - 1 });
            }
        } catch (e) {
            const err = await e;
            message.error(err?.message || 'Error occured, please try again later');
            this.setState({ submiting: false });
        }
    }

    handleSubscribe = async (paymentGateway = 'ccbill', type = 'monthly') => {
        const { gallery, user } = this.props;
        if (!user._id) {
            message.error('You can subscribe to the models just as soon as you login/register.');
            Router.push('/auth/login');
            return;
        }
        try {
            await this.setState({ submiting: true });
            const resp = await (
                await paymentService.subscribe({ type, performerId: gallery.performer._id, paymentGateway })
            ).data;
            message.info('Redirecting to payment gateway, do not reload page at this time', 30);
            if (['ccbill', 'verotel'].includes(paymentGateway)) window.location.href = resp.paymentUrl;
        } catch (e) {
            const err = await e;
            message.error(err?.message || 'error occured, please try again later');
            this.setState({ submiting: false });
        }
    }

    async moreComment() {
        const { gallery, moreComment: handleLoadMore } = this.props;
        const { commentPage, itemPerPage } = this.state;
        await this.setState({
            commentPage: commentPage + 1
        });
        handleLoadMore({
            limit: itemPerPage,
            offset: (commentPage + 1) * itemPerPage,
            objectId: gallery._id
        });
    }

    async deleteComment(item) {
        const { deleteComment: handleDelete } = this.props;
        if (!window.confirm('Are you sure to remove this comment?')) return;
        handleDelete(item._id);
    }

    render() {
        const {
            ui, error, gallery, user, settings,
            relatedGalleries = {
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
        const fetchingComment = commentMapping.hasOwnProperty(gallery?._id) ? commentMapping[gallery?._id].requesting : false;
        const comments = commentMapping.hasOwnProperty(gallery?._id) ? commentMapping[gallery?._id].items : [];
        const totalComments = commentMapping.hasOwnProperty(gallery?._id) ? commentMapping[gallery?._id].total : gallery?.stats.comments;
        const {
            fetching, photos, total, isLiked, totalLikes, submiting, activeTab
        } = this.state;

        const isBlur = !user._id || !gallery?.isSubscribed;

        return (
            <Layout>
                <Head>
                    <title>
                        {`${ui.siteName} | ${gallery?.name || ''}`}
                    </title>
                    <meta name="keywords" content={gallery?.description} />
                    <meta name="description" content={gallery?.description} />
                    {/* OG tags */}
                    <meta
                        property="og:title"
                        content={`${ui.siteName} | ${gallery?.name || 'Gallery'}`}
                        key="title"
                    />
                    <meta property="og:image" content={gallery?.coverPhoto?.thumbnails[0] || gallery?.coverPhoto?.url} />
                    <meta property="og:keywords" content={gallery?.description} />
                    <meta
                        property="og:description"
                        content={gallery?.description}
                    />
                    {/* Twitter tags */}
                    <meta
                        name="twitter:title"
                        content={`${ui.siteName} | ${gallery?.name || 'Gallery'}`}
                    />
                    <meta name="twitter:image" content={gallery?.coverPhoto?.thumbnails[0] || gallery?.coverPhoto?.url} />
                    <meta
                        name="twitter:description"
                        content={gallery?.description}
                    />
                </Head>
                <div className="main-container">
                    <PageHeader
                        onBack={() => Router.back()}
                        backIcon={<ArrowLeftOutlined />}
                        title={gallery?.name}
                    />
                    <p className="gal-stats">
                        <span>
                            <EyeOutlined />
                            {' '}
                            {shortenLargeNumber(gallery?.stats?.views || 0)}
                        </span>
                        <span>
                            <CalendarOutlined />
                            {' '}
                            {formatDate(gallery?.updatedAt, 'll')}
                        </span>
                    </p>
                    <div className="photo-carousel">
                        <div className={!isBlur ? 'list-photos' : 'list-photos blur'}>
                            {photos && photos.length > 0 && <PhotoPreviewList photos={photos} isBlur={isBlur} />}
                            {isBlur && (
                                <SubscriptionPerformerBlock disabled={user?.isPerformer || submiting} settings={settings} performer={gallery?.performer} onSelect={this.handleSubscribe} />
                            )}
                            {!fetching && !photos.length && <p className="text-center">No photo was found.</p>}
                            {fetching && <div className="text-center"><Spin /></div>}
                            {!fetching && total > photos.length && <div className="text-center" style={{ margin: 10 }}><Button type="link" onClick={this.getMorePhotos.bind(this)}>More photos ...</Button></div>}
                        </div>
                    </div>
                </div>
                <div className="middle-split">
                    <div className="main-container">
                        <div className="middle-actions">
                            <Link
                                href={{
                                    pathname: '/model/profile',
                                    query: { username: gallery?.performer?.username || gallery?.performer?._id }
                                }}
                                as={`/model/${gallery?.performer?.username || gallery?.performer?._id}`}
                            >
                                <a>
                                    <div className="o-w-ner">
                                        <Avatar
                                            alt="performer avatar"
                                            src={gallery?.performer?.avatar || '/user.png'}
                                        />
                                        <span className="owner-name">
                                            <span>
                                                {gallery?.performer?.name || 'N/A'}
                                                {' '}
                                                {gallery?.performer?.verifiedAccount && <TickIcon />}
                                            </span>
                                            <span style={{ fontSize: '10px' }}>
                                                @
                                                {gallery?.performer?.username || 'n/a'}
                                            </span>
                                        </span>
                                    </div>
                                </a>
                            </Link>
                            <div className="act-btns">
                                <Button
                                    disabled={submiting}
                                    className={isLiked ? 'react-btn active' : 'react-btn'}
                                    onClick={this.handleLike.bind(this)}
                                >
                                    {shortenLargeNumber(totalLikes || 0)}
                                    {' '}
                                    <LikeOutlined />
                                </Button>
                                <Button onClick={() => this.setState({ activeTab: 'comment' })} className={activeTab === 'comment' ? 'react-btn active' : 'react-btn'}>
                                    {shortenLargeNumber(totalComments || 0)}
                                    {' '}
                                    <CommentOutlined />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="middle-info">
                    <div className="main-container">
                        <Tabs activeKey={activeTab} onChange={(tab) => this.setState({ activeTab: tab })}>
                            <Tabs.TabPane tab="Description" key="description">
                                <p>{gallery?.description || 'No description...'}</p>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Comments" key="comment">
                                <CommentForm
                                    creator={user}
                                    onSubmit={handleCreateComment.bind(this)}
                                    objectId={gallery?._id}
                                    objectType="gallery"
                                    requesting={commenting}
                                />
                                <ListComments
                                    key={`list_comments_${gallery?._id}_${comments.length}`}
                                    requesting={fetchingComment}
                                    comments={comments}
                                    total={totalComments}
                                    onDelete={this.deleteComment.bind(this)}
                                    user={user}
                                    canReply
                                />
                                {comments.length < totalComments && <p className="text-center"><a aria-hidden onClick={this.moreComment.bind(this)}>More comments...</a></p>}
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
                <div className="main-container">
                    <div className="related-items">
                        <h4 className="ttl-1">You may also like</h4>
                        {relatedGalleries.requesting && <div className="text-center"><Spin /></div>}
                        <Row>
                            {!relatedGalleries.requesting && relatedGalleries.items.length > 0
                                && relatedGalleries.items.map((item: IGallery) => (
                                    <Col xs={12} sm={12} md={6} lg={6} key={item._id}>
                                        <GalleryCard gallery={item} />
                                    </Col>
                                ))}
                        </Row>
                        {!relatedGalleries.requesting && !relatedGalleries.items.length && <div>No gallery was found</div>}
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStates = (state: any) => {
    const { commentMapping, comment } = state.comment;
    return {
        settings: state.settings,
        user: state.user.current,
        ui: state.ui,
        relatedGalleries: state.gallery.relatedGalleries,
        commentMapping,
        comment
    };
};

const mapDispatch = {
    getRelatedGalleries,
    getComments,
    moreComment,
    createComment,
    deleteComment
};
export default connect(mapStates, mapDispatch)(GalleryViewPage);
