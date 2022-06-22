import {
  Layout, message, PageHeader
} from 'antd';
import Head from 'next/head';
import Router from 'next/router';
import { PureComponent } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { IUIConfig } from 'src/interfaces';
import { reportService } from 'src/services';
import ReportTableList from '@components/report/report-table-list';
import ShadowBox from '@components/elements/ShadowBox';

interface IProps {
  ui: IUIConfig;
}

class PerformerReportList extends PureComponent<IProps> {
  static onlyPerformer = true;

  static authenticate = true;

  state = {
    loading: false,
    limit: 12,
    offset: 0,
    items: [],
    total: 0
  }

  componentDidMount() {
    this.getBlockList();
  }

  async getBlockList() {
    const { limit, offset } = this.state;
    try {
      await this.setState({ loading: true });
      const resp = await reportService.search({
        limit,
        offset: offset * limit
      });
      this.setState({
        items: resp.data.data,
        total: resp.data.total,
        loading: false
      });
    } catch (e) {
      message.error('An error occured, please try again later');
      this.setState({ loading: false });
    }
  }

  async handleTabChange(data) {
    await this.setState({ offset: data.current - 1 });
    this.getBlockList();
  }

  render() {
    const {
      items, total, loading, limit
    } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>{`${ui?.siteName} | Violations Reported`}</title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Violations Reported"
          />
          <ShadowBox>
            <ReportTableList
              items={items}
              searching={loading}
              total={total}
              onChange={this.handleTabChange.bind(this)}
              pageSize={limit}
            />
          </ShadowBox>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state) => ({
  ui: { ...state.ui }
});
export default connect(mapStates)(PerformerReportList);
