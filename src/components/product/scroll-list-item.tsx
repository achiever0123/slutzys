import { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from 'antd';
import { IProduct } from '../../interfaces';
import { PerformerListProduct } from './performer-list-product';

interface IProps {
  items: IProduct[];
  canLoadmore: boolean;
  loadMore(): Function;
  loading: boolean;
}

export class ScrollListProduct extends PureComponent<IProps> {
  render() {
    const {
      items = [], loadMore, canLoadmore = false, loading = false
    } = this.props;
    return (
      <>
        <InfiniteScroll
          dataLength={items.length}
          hasMore={canLoadmore}
          loader={null}
          next={loadMore}
          endMessage={(
            <p style={{ textAlign: 'center' }}>
              {/* <b>Yay! No more video.</b> */}
            </p>
          )}
          scrollThreshold={0.9}
        >
          <PerformerListProduct products={items} />
          {!loading && !items.length && <div className="text-center">No item was found</div>}
          {loading && <div className="text-center"><Spin /></div>}
        </InfiniteScroll>
      </>
    );
  }
}
