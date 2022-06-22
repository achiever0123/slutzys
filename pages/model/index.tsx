import { PureComponent } from 'react';
import {
  Row, Col, Layout, Pagination, Spin, message
} from 'antd';
import { connect } from 'react-redux';
import PerformerCard from '@components/performer/card';
import { StarOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { PerformerAdvancedFilter } from '@components/performer/common/performer-advanced-filter';
import { IUIConfig, ICountry, IBody } from 'src/interfaces';
import { performerService, utilsService } from '@services/index';
import '@components/performer/performer.less';

interface IProps {
  ui: IUIConfig;
  countries: ICountry[];
  bodyInfo: IBody
}

class Performers extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect = true;

  static async getInitialProps() {
    const [countries, bodyInfo] = await Promise.all([
      utilsService.countriesList(),
      utilsService.bodyInfo()
    ]);
    return {
      countries: countries?.data || [],
      bodyInfo: bodyInfo?.data
    };
  }

  state = {
    offset: 0,
    limit: 12,
    filter: {
      sortBy: 'popular'
    } as any,
    performers: [],
    total: 0,
    fetching: true
  };

  componentDidMount() {
    this.getPerformers();
  }

  async getPerformers() {
    const {
      limit, offset, filter
    } = this.state;
    try {
      await this.setState({ fetching: true });
      const resp = await performerService.search({
        limit,
        offset: limit * offset,
        ...filter
      });
      this.setState({ performers: resp.data.data, total: resp.data.total, fetching: false });
    } catch {
      message.error('Error occured, please try again later');
      this.setState({ fetching: false });
    }
  }

  async pageChanged(page: number) {
    await this.setState({ offset: page - 1 });
    this.getPerformers();
  }

  async handleFilter(values: any) {
    const { filter } = this.state;
    await this.setState({ offset: 0, filter: { ...filter, ...values } });
    this.getPerformers();
  }

  render() {
    const {
      ui, countries, bodyInfo
    } = this.props;
    const {
      limit, offset, performers, total, fetching
    } = this.state;

    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Models
          </title>
        </Head>
        <div className="main-container">
          <h3 className="page-heading">
            <span className="box">
              <StarOutlined />
              {' '}
              Models
            </span>
          </h3>
          <div className="md-below-heading">
            <PerformerAdvancedFilter
              onSubmit={this.handleFilter.bind(this)}
              countries={countries || []}
              bodyInfo={bodyInfo}
            />
          </div>
          <Row>
            {performers.map((p: any) => (
              <Col xs={12} sm={12} md={6} lg={6} key={p._id}>
                <PerformerCard performer={p} />
              </Col>
            ))}
          </Row>
          {!total && !fetching && <p className="text-center">No model was found</p>}
          {fetching && <div className="text-center" style={{ margin: 30 }}><Spin /></div>}
          {total && total > limit ? (
            <div className="paging">
              <Pagination
                current={offset + 1}
                total={total}
                pageSize={limit}
                onChange={this.pageChanged.bind(this)}
              />
            </div>
          ) : null}
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: { ...state.ui }
});

const mapDispatch = { };
export default connect(mapStates, mapDispatch)(Performers);
