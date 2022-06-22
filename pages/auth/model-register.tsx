/* eslint-disable prefer-promise-reject-errors */
import {
  Row, Col, Button, Layout, Form, Input, Select, message
} from 'antd';
import { PureComponent } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { connect } from 'react-redux';
import { registerPerformer } from '@redux/auth/actions';
import { IUIConfig, ICountry } from 'src/interfaces';
import { utilsService } from 'src/services';
import { ImageUpload } from '@components/file';
import './index.less';

const { Option } = Select;

interface IProps {
  registerPerformerData: any;
  registerPerformer: Function;
  ui: IUIConfig;
  countries: ICountry[];
}

class RegisterPerformer extends PureComponent<IProps> {
  idVerificationFile = null;

  documentVerificationFile = null;

  static async getInitialProps() {
    const countries = await utilsService.countriesList();
    return {
      countries: countries && countries.data ? countries.data : []
    };
  }

  onFileReaded = (type, file: File) => {
    if (file && type === 'idFile') {
      this.idVerificationFile = file;
    }
    if (file && type === 'documentFile') {
      this.documentVerificationFile = file;
    }
  }

  register = (values: any) => {
    const data = values;
    const { registerPerformer: registerPerformerHandler } = this.props;
    if (!this.idVerificationFile || !this.documentVerificationFile) {
      return message.error('ID photo & ID document are required', 5);
    }
    data.idVerificationFile = this.idVerificationFile;
    data.documentVerificationFile = this.documentVerificationFile;
    return registerPerformerHandler(data);
  };

  render() {
    const { registerPerformerData = { requesting: false }, ui, countries } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Model Registration
          </title>
        </Head>
        <div className="main-container">
          <div className="login-box register-box">
            <div className="text-center">
              <span className="title">Model Registration</span>
            </div>
            <p className="text-center"><small>Sign up to make money and interact with your fans!</small></p>
            <Form
              name="member_register"
              initialValues={{
                gender: 'male',
                country: 'US'
                // dateOfBirth: moment().subtract(18, 'year').endOf('day')
              }}
              onFinish={this.register}
            >
              <Row>
                <Col
                  xs={24}
                  sm={24}
                  md={14}
                  lg={14}
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: 'Please input your name!' },
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
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: 'Please input your name!' },
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
                    <Col span={12}>
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
                    <Col span={12}>
                      <Form.Item
                        name="username"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: 'Please input your username!' },
                          {
                            pattern: new RegExp(/^[a-z0-9]+$/g),
                            message:
                              'Username must contain only lowercase alphanumerics only!'
                          },
                          { min: 3, message: 'username must containt at least 3 characters' }
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Username eg: user123, chirst99 ..." />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="email"
                        validateTrigger={['onChange', 'onBlur']}
                        hasFeedback
                        rules={[
                          {
                            type: 'email',
                            message: 'The input is not valid email!'
                          },
                          {
                            required: true,
                            message: 'Please input your email!'
                          }
                        ]}
                      >
                        <Input placeholder="Email address" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="country" rules={[{ required: true }]} hasFeedback>
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
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[{ required: true, message: 'Please select your gender' }]}
                        hasFeedback
                      >
                        <Select>
                          <Option value="male" key="male">Male</Option>
                          <Option value="female" key="female">Female</Option>
                          <Option value="transgender" key="trans">Transgender</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="password"
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
                    <Col span={12}>
                      <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        validateTrigger={['onChange', 'onBlur']}
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
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={10}
                  lg={10}
                >
                  <div className="register-form">
                    <Form.Item
                      name="documentVerificationId"
                      className="model-photo-verification"
                      help="Your government issued ID card, National ID card, Passport or Driving license"
                    >
                      <div className="id-block">
                        <ImageUpload onFileReaded={this.onFileReaded.bind(this, 'documentFile')} />
                        <img alt="identity-img" className="img-id" src="/front-id.png" />
                      </div>
                    </Form.Item>
                    <Form.Item
                      name="idVerificationId"
                      className="model-photo-verification"
                      help="Photo of yourself holding your indentity document next to your face"
                    >
                      <div className="id-block">
                        <ImageUpload onFileReaded={this.onFileReaded.bind(this, 'idFile')} />
                        <img alt="identity-img" className="img-id" src="/holding-id.jpg" />
                      </div>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={registerPerformerData.requesting}
                  loading={registerPerformerData.requesting}
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
                    <a> Login here.</a>
                  </Link>
                </p>
                <p>
                  Are you a fan?
                  <Link href="/auth/fan-register">
                    <a> Sign up here.</a>
                  </Link>
                </p>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui },
  registerPerformerData: { ...state.auth.registerPerformerData }
});

const mapDispatchToProps = { registerPerformer };

export default connect(mapStatesToProps, mapDispatchToProps)(RegisterPerformer);
