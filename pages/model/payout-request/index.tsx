import React, { PureComponent } from 'react';
import {
  Button, message, Layout, PageHeader
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Router from 'next/router';
import Head from 'next/head';
import { connect } from 'react-redux';
import PayoutRequestList from 'src/components/payout-request/table';
import { getResponseError } from '@lib/utils';
import { payoutRequestService } from '@services/index';
import { IUIConfig } from '@interfaces/ui-config';
import ShadowBox from '@components/elements/ShadowBox';

interface IProps {
  ui: IUIConfig
}

class PerformerPayoutRequestPage extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  state = {
    items: [],
    loading: false,
    pagination: {
      pageSize: 10,
      current: 1,
      total: 0
    } as any,
    sort: 'desc',
    sortBy: 'updatedAt',
    filter: {}
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      const {
        filter, sort, sortBy, pagination
      } = this.state;
      await this.setState({ loading: true });
      const resp = await payoutRequestService.search({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      await this.setState({
        items: resp.data.data,
        pagination: { ...pagination, total: resp.data.total }
      });
    } catch (error) {
      message.error(
        getResponseError(error) || 'An error occured. Please try again.'
      );
    } finally {
      this.setState({ loading: false });
    }
  }

  async handleTabChange(data) {
    const { pagination } = this.state;
    await this.setState({
      pagination: { ...pagination, current: data.current }
    });
    this.getData();
  }

  render() {
    const { ui } = this.props;
    const {
      pagination, items, loading
    } = this.state;

    return (
      <Layout>
        <Head>
          <title>{`${ui?.siteName} | Payout Requests`}</title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Payout Requested"
          />
          <ShadowBox>
            <div style={{ margin: '10px 0' }}>
              <Button
                type="primary"
                onClick={() => Router.push('/model/payout-request/create')}
              >
                Request a Payout
              </Button>
            </div>
          </ShadowBox>
          <ShadowBox>
            <div className="table-responsive">
              <PayoutRequestList
                payouts={items}
                searching={loading}
                total={pagination.total}
                onChange={this.handleTabChange.bind(this)}
                pageSize={pagination.pageSize}
              />
            </div>
          </ShadowBox>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  ui: state.ui
});
export default connect(mapStateToProps)(PerformerPayoutRequestPage);
