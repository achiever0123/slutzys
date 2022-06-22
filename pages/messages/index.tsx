import { PureComponent } from 'react';
import { Layout, PageHeader } from 'antd';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import { IUIConfig } from 'src/interfaces/';
import Messenger from '@components/messages/Messenger';

interface IProps {
  getList: Function;
  performerState: any;
  ui: IUIConfig;
  query: Record<string, string>
}

class Messages extends PureComponent<IProps> {
  static authenticate = true;

  static getInitialProps({ ctx }) {
    return {
      query: ctx.query
    };
  }

  render() {
    const { ui, query = {} } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Chats
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Chats"
          />
          <Messenger toSource={query.toSource} toId={query.toId} />
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});

const mapDispatch = { };
export default connect(mapStates, mapDispatch)(Messages);
