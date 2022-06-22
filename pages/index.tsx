import { PureComponent } from 'react';
import {
  Layout, Row, Col, Button
} from 'antd';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { HomePerformers } from '@components/performer';
import VideoCard from '@components/video/video-card';
import {
  ShoppingCartOutlined, VideoCameraOutlined, StarOutlined, RocketOutlined, SearchOutlined
} from '@ant-design/icons';
import ProductCard from '@components/product/product-card';
import { Banner } from '@components/common';
import {
  performerService, videoService, productService, bannerService
} from '@services/index';
import {
  IUser, IVideo, IProduct, IUIConfig, ISettings, IBanner, IPerformer
} from 'src/interfaces';
import LoaderList from '@components/elements/LoaderList'


interface IProps {
  settings: ISettings;
  ui: IUIConfig;
  user: IUser;
  banners: IBanner[];
  videos: IVideo[];
  products: IProduct[]
}

interface IStates {
  performers: IPerformer[];
  fetching: boolean;
}

class HomePage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static noredirect = true;

  static async getInitialProps() {
    try {
      const [videos, products, banners] = await Promise.all([
        videoService.userSearch({
          limit: 16, sortBy: 'updatedAt', sort: -1, isSaleVideo: true
        }),
        productService.userSearch({ limit: 16, sortBy: 'updatedAt', sort: -1 }),
        bannerService.search({ limit: 99, status: 'active' })
      ]);
      return {
        videos: videos?.data?.data || [],
        products: products?.data?.data || [],
        banners: banners?.data?.data || []
      };
    } catch (e) {
      return {
        videos: [],
        products: [],
        banners: []
      };
    }
  }

  state = {
    fetching: false,
    performers: []
  }

  componentDidMount(): void {
    this.searchPerformers();
  }

  searchPerformers = async () => {
    try {
      this.setState({ fetching: true });
      const resp = await performerService.search({ limit: 16, sortBy: 'subscriber' });
      this.setState({ performers: resp.data.data, fetching: false });
    } catch (e) {
      this.setState({ fetching: false });
    }
  }

  render() {
    const {
      banners = [], ui, user, videos, products, settings
    } = this.props;
    const { performers, fetching } = this.state;
    const topBanners = banners.filter((b) => b.position === 'top');
    const middleBanners = banners.filter((b) => b.position === 'middle');
    const bottomBanners = banners.filter((b) => b.position === 'bottom');
    return (
      <Layout>
        <Head>
          <title>
            {`${ui.siteName} | Home`}
          </title>
          <meta name="keywords" content={settings && settings.metaKeywords} />
          <meta
            name="description"
            content={settings && settings.metaDescription}
          />
          {/* OG tags */}
          <meta
            property="og:title"
            content={ui && ui.siteName}
          />
          <meta property="og:image" content={ui && ui.logo} />
          <meta
            property="og:description"
            content={settings && settings.metaDescription}
          />
          {/* Twitter tags */}
          <meta
            name="twitter:title"
            content={ui && ui.siteName}
          />
          <meta name="twitter:image" content={ui && ui.logo} />
          <meta
            name="twitter:description"
            content={settings && settings.metaDescription}
          />
        </Head>
        <div className="home-page">
          <div style={{ position: 'relative' }}>
            {/* <div className="banner-left">
                  {leftBanners && leftBanners.length > 0 && <Banner banners={leftBanners} />}
                </div>
                <div className="banner-right">
                  {rightBanners && rightBanners.length > 0 && <Banner banners={rightBanners} />}
                </div> */}
            <div className="main-container">
              {topBanners?.length > 0 && (
                <div className="banner">
                  <Banner banners={topBanners} />
                </div>
              )}
              <h3 className="page-heading">
                <StarOutlined />
                {' '}
                Hot Models
              </h3>
              <HomePerformers performers={performers} fetching={fetching} />
              {middleBanners?.length > 0 && (
                <Banner effect="fade" arrows={false} dots banners={middleBanners} />
              )}
              <h3 className="page-heading">
                <VideoCameraOutlined />
                {' '}
                Hot Videos
              </h3>
              <Row>
                {videos?.length > 0 ? videos.map((v) => (
                  <Col xs={12} sm={12} md={6} lg={6} key={v?._id}>
                    <VideoCard video={v} />
                  </Col>
                )) : <LoaderList row={2} column={4} />
                }
              </Row>
              {bottomBanners?.length > 0 && (
                <Banner effect="fade" arrows={false} dots banners={bottomBanners} />
              )}
              <h3 className="page-heading">
                <ShoppingCartOutlined />
                {' '}
                Hot Products
              </h3>
              <Row>
                {products?.length > 0 ? products.map((p) => (
                  <Col xs={12} sm={12} md={6} lg={6} key={p?._id}>
                    <ProductCard product={p} />
                  </Col>
                )) : <LoaderList row={2} column={4} />
                }
              </Row>
              <div className="signup-grp-btns">
                {!user?._id && (
                  <Link href="/auth/model-register">
                    <Button className="primary">
                      <RocketOutlined />
                      {' '}
                      BECOME A MODEL
                    </Button>
                  </Link>
                )}
                <Link href="/model">
                  <Button className="secondary">
                    <SearchOutlined />
                    {' '}
                    DISCOVER MODELS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui,
  user: state.user.current,
  settings: state.settings
});

const mapDispatch = {};
export default connect(mapStates, mapDispatch)(HomePage);
