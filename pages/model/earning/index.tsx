import { PureComponent } from 'react';
import {
  Layout, message, Row, Col, Statistic, PageHeader
} from 'antd';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import Head from 'next/head';
import Router from 'next/router';
import { connect } from 'react-redux';
import {
  IPerformer, IUIConfig, IEarning, IPerformerStats
} from 'src/interfaces';
import { earningService } from 'src/services';
import { getResponseError } from '@lib/utils';
import { TableListEarning } from '@components/performer/table-earning';
import { SearchFilter } from 'src/components/common/search-filter';
import ShadowBox from '@components/elements/ShadowBox';

interface IProps {
  performer: IPerformer;
  ui: IUIConfig;
}
interface IStates {
  loading: boolean;
  earning: IEarning[];
  pagination: {
    total: number;
    current: number;
    pageSize: number;
  };
  stats: IPerformerStats;
  sortBy: string;
  sort: string;
  sourceType: string;
  dateRange: any;
}

class EarningPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true,
      earning: [],
      pagination: { total: 0, current: 1, pageSize: 10 },
      stats: {} as any,
      sortBy: 'createdAt',
      sort: 'desc',
      sourceType: '',
      dateRange: null
    };
  }

  componentDidMount() {
    this.getData();
    this.getPerformerStats();
  }

  async handleTabsChange(data) {
    const { pagination } = this.state;
    await this.setState({
      pagination: { ...pagination, current: data.current }
    });
    this.getData();
  }

  async handleFilter(data) {
    const { dateRange } = this.state;
    await this.setState({
      sourceType: data.type,
      dateRange: {
        ...dateRange,
        fromDate: data.fromDate,
        toDate: data.toDate
      }
    });
    this.getData();
    this.getPerformerStats();
  }

  async getData() {
    try {
      const {
        pagination, sort, sortBy, sourceType, dateRange
      } = this.state;
      const { current, pageSize } = pagination;
      const earning = await earningService.performerSearch({
        limit: pageSize,
        offset: (current - 1) * pageSize,
        sort,
        sortBy,
        sourceType,
        fromDate: dateRange?.fromDate || '',
        toDate: dateRange?.toDate || ''
      });
      await this.setState({
        earning: earning.data.data,
        pagination: { ...pagination, total: earning.data.total }
      });
    } catch (error) {
      message.error(getResponseError(error));
    } finally {
      this.setState({ loading: false });
    }
  }

  async getPerformerStats() {
    const { sourceType, dateRange } = this.state;
    const resp = await earningService.performerStarts({
      sourceType,
      fromDate: dateRange?.fromDate || '',
      toDate: dateRange?.toDate || ''
    });
    this.setState({ stats: resp.data });
  }

  render() {
    const {
      loading, earning, pagination, stats
    } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {' '}
            {ui && ui.siteName}
            {' '}
            | Earning Report
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Earning Report"
          />
          <ShadowBox>
            <SearchFilter
              type={[
                { key: '', text: 'All type' },
                { key: 'video', text: 'VOD' },
                { key: 'product', text: 'Store' },
                { key: 'performer', text: 'Subscription' }
              ]}
              onSubmit={this.handleFilter.bind(this)}
              dateRange
            />
          </ShadowBox>
          <ShadowBox>
            <Row gutter={16} style={{ marginBottom: '10px' }}>
              <Col span={8}>
                <Statistic
                  title="Total Gross Price"
                  prefix="$"
                  value={stats.totalGrossPrice || 0}
                  precision={2}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Admin earned"
                  prefix="$"
                  value={stats.totalCommission || 0}
                  precision={2}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="You earned"
                  prefix="$"
                  value={stats.totalNetPrice || 0}
                  precision={2}
                />
              </Col>
            </Row>
          </ShadowBox>
          <ShadowBox>
            <div className="table-responsive">
              <TableListEarning
                loading={loading}
                dataSource={earning}
                rowKey="_id"
                pagination={{ ...pagination, showSizeChanger: false }}
                onChange={this.handleTabsChange.bind(this)}
              />
            </div>
          </ShadowBox>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state) => ({
  ui: { ...state.ui },
  performer: { ...state.user.current }
});
export default connect(mapStates)(EarningPage);
