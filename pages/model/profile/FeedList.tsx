import { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin, Row, Col } from 'antd';
import { IGallery } from '@interfaces/gallery';
import ProfileCard from './ProfileCard';
import AddPost from './AddPost';
import LoaderList from '@components/elements/LoaderList';
import PostCard from '@components/gallery/PostCard';

interface IProps {
    items: number[];
    canLoadmore: boolean;
    loadMore(): Function;
    loading: boolean;
    isCurrentUserProfile: boolean;
}

export class ScrollListGallery extends PureComponent<IProps> {
    render() {
        const {
            items = [], loadMore, canLoadmore = false, loading = false, isCurrentUserProfile
        } = this.props;
        return (
            <InfiniteScroll
                dataLength={items.length}
                hasMore={canLoadmore}
                loader={null}
                next={loadMore}
                endMessage={null}
                scrollThreshold={0.9}
            >
                <Row>
                    {isCurrentUserProfile &&
                        <Col xs={24} sm={24} md={16} lg={16}
                            key={"add"}
                        >
                            <AddPost />
                        </Col>
                    }
                    {items.length > 0
                        && items.map((post: any) => (
                            <Col xs={24} sm={24} md={16} lg={16}
                                key={post._id}
                            >
                                <PostCard gallery={post} />
                                {/* <ProfileCard post={post} /> */}
                            </Col>
                        ))}
                </Row>
                {!loading && !items.length && <div className="text-center">No post was found</div>}
                <Row>
                    <Col xs={24} sm={24} md={16} lg={16} >
                        {loading && (!items.length ? <div style={{ width: "100%" }}>
                            <LoaderList row={2} column={1} /></div> : <div className="text-center"><Spin /></div>)}
                    </Col>
                </Row>
            </InfiniteScroll>
        );
    }
}
export default ScrollListGallery;
