/* eslint-disable react/no-danger */
import { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Link from 'next/link';
import Head from 'next/head';
import { IUIConfig } from 'src/interfaces';
import { connect } from 'react-redux';
import './index.less';

interface IProps {
  ui: IUIConfig;
}

class Dashboard extends PureComponent<IProps> {
  static authenticate = false;

  static noredirect = true;

  state = {
    loginAs: 'user'
  };

  render() {
    const { ui } = this.props;
    const { loginAs } = this.state;
    return (
      <div className="container">
        <Head>
          <title>
            {`${ui.siteName} | Register`}
          </title>
        </Head>
        <div className="main-container">
          <div className="login-box">
            <Row>
              <Col
                xs={24}
                sm={24}
                md={8}
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
                md={16}
                lg={12}
              >
                <div className="login-content right">
                  <div className="switch-btn">
                    <button
                      type="button"
                      className={loginAs === 'user' ? 'active' : ''}
                      onClick={() => this.setState({ loginAs: 'user' })}
                      style={{ marginRight: '20px' }}
                    >
                      Fan sign up
                    </button>
                    <button
                      type="button"
                      className={loginAs === 'performer' ? 'active' : ''}
                      onClick={() => this.setState({ loginAs: 'performer' })}
                    >
                      Model sign up
                    </button>
                  </div>

                  <div className="welcome-box">
                    <h3>
                      {loginAs === 'user' ? 'Fan' : 'Model'}
                      {' '}
                      Benefits
                    </h3>
                    {loginAs === 'performer' ? (
                      <div>
                        {ui && ui.modelBenefit
                          ? <div dangerouslySetInnerHTML={{ __html: ui.modelBenefit }} />
                          : (
                            <ul>
                              <li>Lightning fast uploading</li>
                              <li>Multi-video uploading</li>
                              <li>Chat with fans</li>
                              <li>Cross-over-content between models</li>
                              <li>Individual model store</li>
                              <li>
                                Affiliate program for blogs to promote your
                                content
                              </li>
                              <li>80% Standard commission rate</li>
                              <li>(Deduct 5% when gained from affiliates)</li>
                            </ul>
                          )}
                        <Link href="/auth/model-register">
                          <a className="btn-primary ant-btn ant-btn-primary ant-btn-lg">
                            Model sign up
                          </a>
                        </Link>
                      </div>
                    ) : (
                      <div>
                        {ui && ui.userBenefit ? <div dangerouslySetInnerHTML={{ __html: ui.userBenefit }} /> : (
                          <ul>
                            <li>View exclusive content</li>
                            <li>Monthly and Yearly subscriptions</li>
                            <li>Fast and reliable buffering and viewing</li>
                            <li>Multiple solution options to choose from</li>
                            <li>Chat with model</li>
                            <li>Access model&apos;s personal store</li>
                            <li>Search and filter capabilities</li>
                            <li>Favorite your video for future viewing</li>
                          </ul>
                        )}
                        <Link href="/auth/fan-register">
                          <a className="btn-primary ant-btn ant-btn-primary ant-btn-lg">
                            Fan sign up
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui }
});

const mapDispatch = { };

export default connect(mapStatesToProps, mapDispatch)(Dashboard);
