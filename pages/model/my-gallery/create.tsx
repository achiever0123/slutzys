import { PureComponent } from 'react';
import { Layout, message, PageHeader, Row, Col } from 'antd';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import Head from 'next/head';
import FormGallery from '@components/gallery/form-gallery';
import { IUIConfig } from 'src/interfaces';
import { galleryService } from 'src/services';
import { getResponseError } from '@lib/utils';
import Router from 'next/router';
import { connect } from 'react-redux';
import ShadowBox from '@components/elements/ShadowBox';

interface IProps {
  ui: IUIConfig;
}

interface IStates {
  submiting: boolean;
}

class GalleryCreatePage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

  state = {
    submiting: false
  };

  async onFinish(data) {
    try {
      await this.setState({ submiting: true });
      await galleryService.create(data);
      message.success('Created successfully!');
      Router.push('/model/my-gallery/listing');
    } catch (e) {
      this.setState({ submiting: false });
      message.error(getResponseError(await e) || 'An error occurred, please try again!');
    }
  }

  render() {
    const { ui } = this.props;
    const { submiting } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {`${ui.siteName} | New Gallery`}
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="New Gallery"
          />
          <Row>
            <Col xs={24} sm={24} md={18} lg={12}>
              <ShadowBox>
                <FormGallery
                  submiting={submiting}
                  onFinish={this.onFinish.bind(this)}
                />
              </ShadowBox>
            </Col>
          </Row>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});
export default connect(mapStates)(GalleryCreatePage);
