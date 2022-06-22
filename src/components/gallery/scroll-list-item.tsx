import { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin, Row, Col } from 'antd';
import { IGallery } from '@interfaces/gallery';
import GalleryCard from './GalleryCard'/* './gallery-card' */;
import LoaderList from '@components/elements/LoaderList'

interface IProps {
  items: IGallery[];
  canLoadmore: boolean;
  loadMore(): Function;
  loading: boolean;
}

export class ScrollListGallery extends PureComponent<IProps> {
  render() {
    const {
      items = [], loadMore, canLoadmore = false, loading = false
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
          {items.length > 0
            && items.map((gallery: IGallery) => (
              <Col xs={24} sm={24} md={12} lg={12}
                key={gallery._id}
              >
                <GalleryCard gallery={gallery} />
              </Col>
            ))}
        </Row>
        {!loading && !items.length && <div className="text-center">No gallery was found</div>}
        {loading && (!items.length ? <div style={{ width: "100%" }}><LoaderList row={1} column={2} /></div> : <div className="text-center"><Spin /></div>)}
      </InfiniteScroll>
    );
  }
}
