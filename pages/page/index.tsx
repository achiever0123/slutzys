import { PureComponent } from 'react';
import Head from 'next/head';
import { Layout, Result, Button } from 'antd';
import { ReadOutlined, HomeOutlined, ContactsOutlined } from '@ant-design/icons';
import { postService } from '@services/post.service';
import { connect } from 'react-redux';
import Router from 'next/router';
import { IPostResponse, IError, IUIConfig } from '@interfaces/index';

interface IProps {
  ui: IUIConfig;
  error: IError
  post: IPostResponse;
}
class PostDetail extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect = true;

  static async getInitialProps({ ctx }: any) {
    const { query } = ctx;
    try {
      const post = await (await postService.findById(query.id)).data;
      return { post };
    } catch (e) {
      return { error: await e };
    }
  }

  render() {
    const { ui, post, error } = this.props;
    if (error) {
      return (
        <Result
          status={error?.statusCode === 404 ? '404' : 'error'}
          title={error?.statusCode === 404 ? null : error?.statusCode}
          subTitle={error?.statusCode === 404 ? 'Alas! It hurts us to realize that we have let you down. We are not able to find the page you are hunting for :(' : error?.message}
          extra={[
            <Button className="secondary" key="console" onClick={() => Router.push('/')}>
              <HomeOutlined />
              BACK HOME
            </Button>,
            <Button key="buy" className="primary" onClick={() => Router.push('/contact')}>
              <ContactsOutlined />
              CONTACT US
            </Button>
          ]}
        />
      );
    }
    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | ${post?.title || ''}`}
          </title>
        </Head>
        <div className="main-container">
          <h3 className="page-heading">
            <ReadOutlined />
            {' '}
            {post?.title || ''}
          </h3>
          <div
            className="page-content"
              // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />
        </div>
      </Layout>
    );
  }
}
const mapProps = (state: any) => ({
  ui: state.ui
});

export default connect(mapProps)(PostDetail);
