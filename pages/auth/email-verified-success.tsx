import { PureComponent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import {
  Layout
} from 'antd';

interface IProps {
  ui: any;
}

class EmailVerifiedSuccess extends PureComponent<IProps> {
  render() {
    const { ui } = this.props;
    const { siteName } = ui;
    return (
      <Layout>
        <Head>
          <title>
            {siteName}
            {' '}
            | Email Verified
          </title>
        </Head>
        <div className="email-verify-succsess">
          <p>
            Your email has been verified,
            <Link href="/auth/login">
              <a> click here to login</a>
            </Link>
          </p>
        </div>
      </Layout>
    );
  }
}

const mapStatetoProps = (state: any) => ({
  ui: { ...state.ui }
});

export default connect(mapStatetoProps)(EmailVerifiedSuccess);
