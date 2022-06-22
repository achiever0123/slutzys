/* eslint-disable react/no-did-update-set-state */
import { PureComponent } from 'react';
import {
  Form, Input, Button, Layout, Col, Row, message
} from 'antd';
import { authService } from '@services/index';
import Head from 'next/head';
import { IForgot, IUIConfig } from 'src/interfaces';
import { connect } from 'react-redux';
import Link from 'next/link';
import './index.less';

interface IProps {
  ui: IUIConfig;
}

interface IState {
  submiting: boolean;
  countTime: number;
}

class Forgot extends PureComponent<IProps, IState> {
  _intervalCountdown: any;

  state = {
    submiting: false,
    countTime: 60
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.countTime === 0) {
      this._intervalCountdown && clearInterval(this._intervalCountdown);
      this.setState({ countTime: 60 });
    }
  }

  componentWillUnmount() {
    this._intervalCountdown && clearInterval(this._intervalCountdown);
  }

  handleReset = async (data: IForgot) => {
    await this.setState({ submiting: true });
    try {
      await authService.resendVerificationEmail({
        ...data
      });
      message.success('An email has been sent to you to reset your password');
      this.handleCountdown();
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Error occured, please try again later');
    } finally {
      this.setState({ submiting: false });
    }
  };

  handleCountdown = async () => {
    const { countTime } = this.state;
    if (countTime === 0) {
      clearInterval(this._intervalCountdown);
      this.setState({ countTime: 60 });
      return;
    }
    this.setState({ countTime: countTime - 1 });
    this._intervalCountdown = setInterval(this.coundown.bind(this), 1000);
  }

  coundown() {
    const { countTime } = this.state;
    this.setState({ countTime: countTime - 1 });
  }

  render() {
    const { ui } = this.props;
    const { submiting, countTime } = this.state;
    const { siteName } = ui;
    return (
      <>
        <Head>
          <title>
            {siteName}
            {' '}
            | Resend Email Verification
          </title>
        </Head>
        <Layout>
          <div className="main-container">
            <div className="login-box">
              <Row>
                <Col
                  xs={24}
                  sm={24}
                  md={10}
                  lg={12}
                >
                  <div
                    className="login-content left fixed"
                    style={ui.loginPlaceholderImage ? { backgroundImage: `url(${ui.loginPlaceholderImage})` } : null}
                  />
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={14}
                  lg={12}
                >
                  <div
                    className="login-content right"
                    style={{ paddingTop: 80 }}
                  >
                    <div className="login-form">
                      <div className="title">Resend Email Verification</div>
                      <Form name="forgot-form" onFinish={this.handleReset.bind(this)}>
                        <Form.Item
                          hasFeedback
                          name="email"
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              type: 'email',
                              message: 'Invalid email format'
                            },
                            {
                              required: true,
                              message: 'Please enter your E-mail!'
                            }
                          ]}
                        >
                          <Input placeholder="Enter your email address" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                          <Button
                            className="primary"
                            type="primary"
                            htmlType="submit"
                            style={{
                              width: '100%',
                              marginBottom: 15,
                              fontWeight: 600,
                              padding: '5px 25px',
                              height: '42px'
                            }}
                            disabled={submiting || countTime < 60}
                            loading={submiting || countTime < 60}
                          >
                            {countTime < 60 ? 'Resend in' : 'Send'}
                            {' '}
                            {countTime < 60 && `${countTime}s`}
                          </Button>
                          <p>
                            Have an account already?
                            <Link href="/auth/login">
                              <a> Login here.</a>
                            </Link>
                          </p>
                          <p>
                            Don&apos;t have an account yet?
                            <Link
                              href="/auth/register"
                            >
                              <a> Sign up here.</a>
                            </Link>
                          </p>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStatetoProps = (state: any) => ({
  ui: { ...state.ui }
});

export default connect(mapStatetoProps)(Forgot);
