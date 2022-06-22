import React from 'react';
import Head from 'next/head';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PayoutRequestForm from '@components/payout-request/form';
import { message, Layout, PageHeader } from 'antd';
import { connect } from 'react-redux';
import { payoutRequestService } from 'src/services';
import Router from 'next/router';
import { IUIConfig, IUser } from 'src/interfaces/index';

interface Props {
  ui: IUIConfig;
  user: IUser;
}

class PayoutRequestCreatePage extends React.PureComponent<Props> {
  static authenticate = true;

  static onlyPerformer = true;

  state = {
    submiting: false,
    statsPayout: {
      totalPrice: 0,
      paidPrice: 0,
      unpaidPrice: 0
    }
  };

  componentDidMount() {
    this.calculateStatsPayout();
  }

  calculateStatsPayout = async () => {
    try {
      const resp = await payoutRequestService.stats();
      this.setState({ statsPayout: resp.data });
    } catch {
      message.error('Something went wrong, please try again later');
    }
  };

  async submit(data: {
    request: number;
    requestNote: string;
  }) {
    try {
      await this.setState({ submiting: true });
      const body = { ...data };
      await payoutRequestService.create(body);
      message.success('Requested a payout');
      Router.push('/model/payout-request');
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(error?.message || 'Error occured, please try again later');
    } finally {
      this.setState({ submiting: false });
    }
  }

  render() {
    const { submiting, statsPayout } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>{`${ui?.siteName} | New Request Payout`}</title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="New Request Payout"
          />
          <PayoutRequestForm
            statsPayout={statsPayout}
            submit={this.submit.bind(this)}
            submiting={submiting}
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  ui: state.ui,
  user: state.user.current
});

export default connect(mapStateToProps)(PayoutRequestCreatePage);
