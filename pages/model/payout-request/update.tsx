import React from 'react';
import Head from 'next/head';
import PayoutRequestForm from '@components/payout-request/form';
import { message, PageHeader } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { payoutRequestService } from 'src/services';
import { IUIConfig, PayoutRequestInterface, IError } from 'src/interfaces';
import nextCookie from 'next-cookies';
import Router from 'next/router';
import Error from 'next/error';
import { connect } from 'react-redux';

interface Props {
  error: IError;
  payout: PayoutRequestInterface;
  ui: IUIConfig
}

class PayoutRequestUpdatePage extends React.PureComponent<Props> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    try {
      const {
        query: { data, id }
      } = ctx;
      if (process.browser && data) {
        return {
          payout: JSON.parse(data)
        };
      }
      const { token } = nextCookie(ctx);
      const resp = await payoutRequestService.detail(id, {
        Authorization: token
      });
      return {
        payout: resp.data
      };
    } catch (e) {
      return { error: await e };
    }
  }

  state = {
    submiting: false,
    statsPayout: {
      totalPrice: 0,
      paidPrice: 0,
      unpaidPrice: 0
    }
  };

  componentDidMount() {
    const { payout } = this.props;
    if (!payout) {
      message.error('Payout request was not found');
    }
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

  async submit(data: any) {
    const { payout } = this.props;
    if (['done', 'approved', 'rejected'].includes(payout.status)) {
      message.error('Please recheck request payout status');
      return;
    }
    try {
      await this.setState({ submiting: true });
      await payoutRequestService.update(payout._id, data);
      message.success('Changes saved!');
      Router.push('/model/payout-request');
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(error?.message || 'Error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  render() {
    const { payout, ui, error } = this.props;
    if (error) {
      return <Error statusCode={error?.statusCode || 404} title={error?.message || 'Payout request was not found'} />;
    }
    const { submiting, statsPayout } = this.state;
    return (
      <>
        <Head>
          <title>{`${ui?.siteName} | Edit Payout Request`}</title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Edit Payout Request"
          />
          {payout && (
          <PayoutRequestForm
            statsPayout={statsPayout}
            payout={payout}
            submit={this.submit.bind(this)}
            submiting={submiting}
          />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ui: state.ui
});

export default connect(mapStateToProps)(PayoutRequestUpdatePage);
