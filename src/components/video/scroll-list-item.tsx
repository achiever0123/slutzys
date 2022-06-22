import { PureComponent } from 'react';
import { Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PerformerListVideo } from '@components/video';
import { IVideo } from '../../interfaces/video';

interface IProps {
  items: IVideo[];
  canLoadmore: boolean;
  loadMore(): Function;
  loading: boolean;
}

export class ScrollListVideo extends PureComponent<IProps> {
  render() {
    const {
      items, loadMore, loading, canLoadmore
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
        <PerformerListVideo videos={items} />
        {!items.length && !loading && <div className="text-center video-loading-new">No video was found</div>}
        {loading && <div className="text-center video-loading-new"><Spin /></div>}
      </InfiniteScroll>
    );
  }
}
