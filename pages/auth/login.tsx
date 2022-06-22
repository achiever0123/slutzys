import {
  Form,
  Checkbox,
  Input,
  Button,
  Row,
  Col,
  Divider,
  Layout
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import {
  login
} from '@redux/auth/actions';
import Link from 'next/link';
import { IUIConfig, ILogin } from 'src/interfaces';
import './index.less';

interface IProps {
  loginAuth: any;
  login: Function;
  ui: IUIConfig
}

class Login extends PureComponent<IProps> {
  state = {
    inputLogin: '',
    inputPassword: ''
  }

  async handleLogin(values: ILogin) {
    const { login: handleLogin } = this.props;
    handleLogin(values);
  }

  render() {
    const { ui, loginAuth } = this.props;
    const { inputLogin, inputPassword } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Login
          </title>
        </Head>
        <div className="main-container">
          <div className="login-box">
            <Row>
              <Col
                xs={24}
                sm={24}
                md={12}
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
                md={12}
                lg={12}
              >
                <div className="login-content right">
                  <div className="login-form">
                    <div className="title">LOG IN</div>
                    <Divider>*</Divider>
                    <Form
                      name="normal_login"
                      className="login-form"
                      initialValues={{ remember: true }}
                      onFinish={this.handleLogin.bind(this)}
                    >
                      <Form.Item
                        name="username"
                        hasFeedback={inputLogin.length >= 3}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: 'Email address or Username is missing' },
                          { min: 3, message: 'Username must containt at least 3 characters' }
                        ]}
                      >
                        <Input placeholder="Email/Username" />
                      </Form.Item>
                      <Form.Item
                        style={{ margin: 0 }}
                        name="password"
                        hasFeedback={inputPassword.length >= 8}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: 'Please enter your password!' },
                          { min: 8, message: 'Password must containt at least 8 characters' }
                        ]}
                      >
                        <Input type="password" placeholder="Password" />
                      </Form.Item>
                      <Form.Item>
                        <Row>
                          <Col span={12}>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                              <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                          </Col>
                          <Col span={12} style={{ textAlign: 'right' }}>
                            <Link
                              href={{
                                pathname: '/auth/forgot-password'
                              }}
                            >
                              <a className="login-form-forgot">Forgot password?</a>
                            </Link>
                          </Col>
                        </Row>
                      </Form.Item>
                      <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" disabled={loginAuth.requesting} loading={loginAuth.requesting} htmlType="submit" className="login-form-button">
                          LOGIN
                        </Button>
                        <p>
                          Don&apos;t have an account yet?
                          <Link
                            href="/auth/register"
                          >
                            <a> Sign up here.</a>
                          </Link>
                        </p>
                        <p>
                          Email verification,
                          <Link href="/auth/resend-verification-email">
                            <a> Resend here.</a>
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
    );
  }
}

const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui },
  loginAuth: { ...state.auth.loginAuth }
});

const mapDispatchToProps = {
  login
};
export default connect(mapStatesToProps, mapDispatchToProps)(Login) as any;
