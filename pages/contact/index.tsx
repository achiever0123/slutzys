/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-did-update-set-state */
import { PureComponent, createRef } from 'react';

import {
  Form, Button, Layout, Input, message, Col, Row
} from 'antd';
import Head from 'next/head';
import {
  postService, settingService
} from '@services/index';
import { connect } from 'react-redux';
import { IUIConfig, ISettings } from 'src/interfaces';
import '../auth/index.less';

const { TextArea } = Input;

interface IProps {
  ui: IUIConfig;
  settings: ISettings;
}

interface IStates {
  submiting: boolean,
      countTime: number,
      contentContact: string
}
class ContactPage extends PureComponent<IProps, IStates> {
  // eslint-disable-next-line react/sort-comp
  // static async getInitialProps({ ctx }) {
  //   const { store } = ctx;
  //   const state = store.getState();
  //   console.log(state);
  // }

  // eslint-disable-next-line react/sort-comp
  constructor(props: IProps) {
    super(props);
    this.state = {
      submiting: false,
      countTime: 60,
      contentContact: ''
    };
  }

  static authenticate = true;

  static noredirect: boolean = true;

  _intervalCountdown: any;

  formRef: any;

  async componentDidMount() {
    const { settings } = this.props;
    if (!this.formRef) this.formRef = createRef();
    try {
      const contactcontent = await postService.findById(settings.contactContentId);
      this.setState({ contentContact: contactcontent.data.content });
    } catch (error) {
      console.log('error ', error);
    }
    //
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.countTime === 0) {
      this._intervalCountdown && clearInterval(this._intervalCountdown);
      this.setState({ countTime: 60 });
    }
  }

  componentWillUnmount() {
    this._intervalCountdown && clearInterval(this._intervalCountdown);
  }

  async onFinish(values) {
    this.setState({ submiting: true });
    try {
      await settingService.contact(values);
      message.success('Hold tight! We will get back to you soon.');
      this.handleCountdown();
      this.formRef.current.resetFields();
    } catch (e) {
      message.error('Error occured, please try again later');
      this.formRef.current.resetFields();
    } finally {
      this.setState({ submiting: false });
    }
  }

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
    if (!this.formRef) this.formRef = createRef();
    const { ui } = this.props;
    const { contentContact } = this.state;
    const { submiting, countTime } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {ui?.siteName}
            {' '}
            | Contact
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
                    <h3 className="text-center title">
                      Contact
                    </h3>
                    {/* <h5
                      className="text-center"
                      // style={{ fontSize: 13 }}
                    > */}
                    <div dangerouslySetInnerHTML={{ __html: contentContact }} />

                    {/* </h5> */}
                    <Form
                      layout="vertical"
                      name="contact-from"
                      ref={this.formRef}
                      onFinish={this.onFinish.bind(this)}
                    >
                      <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Tell us your name' }]}
                      >
                        <Input placeholder="Your name" />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: 'Tell us your e-mail address.'
                          },
                          { type: 'email', message: 'Invalid email format' }
                        ]}
                      >
                        <Input placeholder="Your email address" />
                      </Form.Item>
                      <Form.Item
                        name="message"
                        rules={[
                          { required: true, message: 'What can we help you?' },
                          {
                            min: 20,
                            message: 'Please input at least 20 characters.'
                          }
                        ]}
                      >
                        <TextArea style={{ minHeight: 100 }} rows={3} placeholder="Your message" />
                      </Form.Item>
                      <div className="text-center">
                        <Button
                          size="large"
                          className="primary"
                          type="primary"
                          htmlType="submit"
                          loading={submiting || countTime < 60}
                          disabled={submiting || countTime < 60}
                          style={{ fontWeight: 600, width: '100%' }}
                        >
                          {countTime < 60 ? 'Resend in' : 'Send'}
                          {' '}
                          {countTime < 60 && `${countTime}s`}
                        </Button>
                      </div>
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
const mapStates = (state: any) => ({
  ui: state.ui,
  settings: state.settings
});
// const mapStatesToProps = (state:any) => ({
//   settings: console.log('this is state: ', state)
// });

export default connect(mapStates)(ContactPage);
