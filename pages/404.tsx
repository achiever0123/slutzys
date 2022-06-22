import { PureComponent } from 'react';
import { Result, Button } from 'antd';
import {
  HomeOutlined, ContactsOutlined
} from '@ant-design/icons';
import Router from 'next/router';

export default class Error404 extends PureComponent {
  static authenticate = true;

  render() {
    return (
      <Result
        status="404"
        title={null}
        subTitle="Alas! It hurts us to realize that we have let you down. We are not able to find the page you are hunting for :("
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
}
