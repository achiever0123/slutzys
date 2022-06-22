import { PureComponent } from 'react';
import {
  Layout, message, Pagination, Spin, PageHeader
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { IUIConfig } from 'src/interfaces';
import { connect } from 'react-redux';
import { videoService } from 'src/services';
import { PerformerListVideo } from '@components/video/performer-list';
import Head from 'next/head';

interface IProps {
  ui: IUIConfig;
}
interface IStates {
  loading: boolean;
  watchLateVideos: any[];
  currentPage: number;
  limit: number;
  total: number;
}

class WatchLateVideoPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      watchLateVideos: [],
      currentPage: 1,
      limit: 12,
      total: 0
    };
  }

  componentDidMount() {
    this.getWatchLateVideos();
  }

  async getWatchLateVideos() {
    try {
      const { limit, currentPage } = this.state;
      const resp = await videoService.getWatchLateVideos({
        limit,
        offset: (currentPage - 1) * limit
      });
      await this.setState({
        watchLateVideos: resp.data.data,
        total: resp.data.total,
        loading: false
      });
    } catch (error) {
      message.error('Server error');
      this.setState({ loading: false });
    }
  }

  async handlePagechange(page: number) {
    await this.setState({ currentPage: page });
    this.getWatchLateVideos();
  }

  render() {
    const {
      loading, watchLateVideos, limit, total
    } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | My Wishlist
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="My Wishlist"
          />
          {!loading && !watchLateVideos.length && (
          <div style={{ textAlign: 'center' }}>
            No wishlist video was found.
          </div>
          )}
          {loading && <div className="text-center"><Spin size="large" /></div>}
          {watchLateVideos && watchLateVideos.length > 0 && (
          <PerformerListVideo videos={watchLateVideos.map((v) => v?.objectInfo)} />
          )}
          {total > limit && (
          <div className="paging">
            <Pagination
              showQuickJumper={false}
              defaultCurrent={1}
              total={total}
              pageSize={limit}
              onChange={this.handlePagechange.bind(this)}
            />
          </div>
          )}
        </div>
      </Layout>
    );
  }
}
const mapState = (state: any) => ({ ui: state.ui });
export default connect(mapState)(WatchLateVideoPage);
