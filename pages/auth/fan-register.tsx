/* eslint-disable prefer-promise-reject-errors */
import {
  Row, Col, Button, Layout, Form, Input, Select
} from 'antd';
import { PureComponent } from 'react';
import Link from 'next/link';
import { utilsService } from 'src/services';
import { registerFan } from '@redux/auth/actions';
import { connect } from 'react-redux';
import Head from 'next/head';
import { IUIConfig, ICountry } from 'src/interfaces';
import './index.less';

const { Option } = Select;

interface IProps {
  ui: IUIConfig;
  registerFan: Function;
  registerFanData: any;
  countries: ICountry[]
}

class FanRegister extends PureComponent<IProps> {
  static async getInitialProps() {
    const [countries] = await Promise.all([
      utilsService.countriesList()
    ]);
    return {
      countries: countries?.data || []
    };
  }

  handleRegister = (data: any) => {
    const { registerFan: handleRegister } = this.props;
    handleRegister(data);
  };

  render() {
    const {
      ui, registerFanData = { requesting: false }, countries
    } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Fan Registration
          </title>
        </Head>
        <div className="main-container">
          <div className="login-box register-box">
            <Row>
              <Col
                xs={24}
                sm={24}
                md={0}
                lg={8}
              >
                <div className="login-content left" style={ui.loginPlaceholderImage ? { backgroundImage: `url(${ui.loginPlaceholderImage})` } : null} />
              </Col>

              <Col
                xs={24}
                sm={24}
                md={24}
                lg={16}
              >
                <div className="login-content right">
                  <div className="text-center">
                    <span className="title">Fan Registration</span>
                  </div>
                  <p className="text-center"><small>Sign up to interact with your idols!</small></p>
                  <div className="register-form">
                    <Form
                      name="member_register"
                      initialValues={{ gender: 'male', country: 'US' }}
                      onFinish={this.handleRegister.bind(this)}
                    >
                      <Row>
                        <Col xs={12} sm={12} md={12}>
                          <Form.Item
                            name="firstName"
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              { required: true, message: 'Please input your first name!' },
                              {
                                pattern: new RegExp(
                                  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                                ),
                                message:
                                  'First name cannot contain number and special character'
                              }
                            ]}
                            hasFeedback
                          >
                            <Input placeholder="First name" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={12} md={12}>
                          <Form.Item
                            name="lastName"
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              { required: true, message: 'Please input your last name!' },
                              {
                                pattern: new RegExp(
                                  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                                ),
                                message:
                                  'Last name cannot contain number and special character'
                              }
                            ]}
                            hasFeedback
                          >
                            <Input placeholder="Last name" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={12} md={12}>
                          <Form.Item
                            name="name"
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              { required: true, message: 'Please input your display name!' },
                              {
                                pattern: new RegExp(/^(?=.*\S).+$/g),
                                message:
                                  'Display name cannot contain only whitespace'
                              },
                              {
                                min: 3,
                                message: 'Display name must containt at least 3 characters'
                              }
                            ]}
                            hasFeedback
                          >
                            <Input placeholder="Display name" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={12} md={12}>
                          <Form.Item
                            name="username"
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              { required: true, message: 'Please input your username!' },
                              {
                                pattern: new RegExp(/^[a-z0-9]+$/g),
                                message:
                                  'Username must contain lowercase aphanumerics only'
                              },
                              { min: 3, message: 'Username must containt at least 3 characters' }
                            ]}
                            hasFeedback
                          >
                            <Input placeholder="Username" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24}>
                          <Form.Item
                            name="email"
                            validateTrigger={['onChange', 'onBlur']}
                            hasFeedback
                            rules={[
                              {
                                type: 'email',
                                message: 'Invalid email address!'
                              },
                              {
                                required: true,
                                message: 'Please input your email address!'
                              }
                            ]}
                          >
                            <Input placeholder="Email address" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={12} md={12}>
                          <Form.Item
                            name="gender"
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[{ required: true, message: 'Please select your gender!' }]}
                            hasFeedback
                          >
                            <Select>
                              <Option value="male">Male</Option>
                              <Option value="female">Female</Option>
                              <Option value="transgender">Transgender</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={12} md={12}>
                          <Form.Item name="country" rules={[{ required: true, message: 'Please select your country!' }]} hasFeedback>
                            <Select showSearch optionFilterProp="label">
                              {countries.map((c) => (
                                <Option value={c.code} key={c.code} label={c.name}>
                                  <img alt="country_flag" src={c.flag} width="25px" />
                                  {' '}
                                  {c.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12}>
                          <Form.Item
                            name="password"
                            validateTrigger={['onChange', 'onBlur']}
                            hasFeedback
                            rules={[
                              {
                                pattern: new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g),
                                message: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                              },
                              { required: true, message: 'Please input your password!' }
                            ]}
                          >
                            <Input type="password" placeholder="Password" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12}>
                          <Form.Item
                            name="confirm"
                            validateTrigger={['onChange', 'onBlur']}
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                message: 'Please confirm your password!'
                              },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject('Passwords do not match!');
                                }
                              })
                            ]}
                          >
                            <Input type="password" placeholder="Confirm password" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={registerFanData.requesting}
                          loading={registerFanData.requesting}
                          style={{
                            marginBottom: 15,
                            fontWeight: 600,
                            padding: '5px 25px',
                            height: '42px'
                          }}
                        >
                          CREATE ACCOUNT
                        </Button>
                        <p>
                          Have an account already?
                          <Link href="/auth/login">
                            <a> Login here</a>
                          </Link>
                        </p>
                        <p>
                          Are you a model?
                          <Link href="/auth/model-register">
                            <a> Sign up here</a>
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
  registerFanData: { ...state.auth.registerFanData }
});

const mapDispatchToProps = { registerFan };

export default connect(mapStatesToProps, mapDispatchToProps)(FanRegister);
