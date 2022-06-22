import { PureComponent } from 'react';
import {
  Layout, message, Pagination, Spin, PageHeader
} from 'antd';
import Router from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
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
  favouriteVideos: any[];
  currentPage: number;
  limit: number;
  total: number;
}

class FavouriteVideoPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      favouriteVideos: [],
      currentPage: 1,
      limit: 12,
      total: 0
    };
  }

  componentDidMount() {
    this.getFavouriteVideos();
  }

  async handlePagechange(page: number) {
    await this.setState({ currentPage: page });
    this.getFavouriteVideos();
  }

  async getFavouriteVideos() {
    try {
      const { limit, currentPage } = this.state;
      const resp = await videoService.getFavouriteVideos({
        limit,
        offset: (currentPage - 1) * limit
      });
      await this.setState({
        favouriteVideos: resp.data.data,
        total: resp.data.total
      });
    } catch (error) {
      message.error('Server error');
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      loading, favouriteVideos, limit, total
    } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Favorite Videos
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Favorite Videos"
          />
          {favouriteVideos && favouriteVideos.length > 0 && (
          <PerformerListVideo videos={favouriteVideos.map((v) => v?.objectInfo)} />
          )}
          {!loading && !favouriteVideos.length && (
          <div style={{ textAlign: 'center' }}>
            No favorite video was found.
          </div>
          )}
          {loading && <div className="text-center"><Spin size="large" /></div>}
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
export default connect(mapState)(FavouriteVideoPage);
