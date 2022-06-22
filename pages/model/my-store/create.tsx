import { PureComponent } from 'react';
import Head from 'next/head';
import { message, Layout, PageHeader } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productService } from '@services/product.service';
import Router from 'next/router';
import { FormProduct } from '@components/product/form-product';
import { IUIConfig } from 'src/interfaces';
import { connect } from 'react-redux';
import { getResponseError } from '@lib/utils';

interface IFiles {
  fieldname: string;
  file: File;
}

interface IResponse {
  data: { _id: string };
}
interface IProps {
  ui: IUIConfig;
}
class CreateProduct extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  state = {
    uploading: false,
    uploadPercentage: 0
  };

  _files: {
    digitalFile: File;
  } = {
    digitalFile: null
  };

  onUploading(resp: any) {
    this.setState({ uploadPercentage: resp.percentage });
  }

  beforeUpload(file: File) {
    this._files.digitalFile = file;
  }

  async submit(data: any) {
    if (data.type === 'digital' && !this._files.digitalFile) {
      message.error('Please select digital file!');
      return;
    }
    if (data.type === 'physical') {
      this._files.digitalFile = null;
    }

    const files = Object.keys(this._files).reduce((tmpFiles, key) => {
      if (this._files[key]) {
        tmpFiles.push({
          fieldname: key,
          file: this._files[key] || null
        });
      }
      return tmpFiles;
    }, [] as IFiles[]) as [IFiles];

    await this.setState({
      uploading: true
    });
    try {
      (await productService.createProduct(
        files,
        data,
        this.onUploading.bind(this)
      )) as IResponse;
      message.success('Product has been created');
      Router.push('/model/my-store');
    } catch (error) {
      message.error(getResponseError(await error) || 'Something went wrong, please try again!');
      this.setState({ uploading: false });
    }
  }

  render() {
    const { uploading, uploadPercentage } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | New product
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="New Product"
          />
          <FormProduct
            submit={this.submit.bind(this)}
            beforeUpload={this.beforeUpload.bind(this)}
            uploading={uploading}
            uploadPercentage={uploadPercentage}
          />
        </div>
      </Layout>
    );
  }
}
const mapStates = (state: any) => ({
  ui: state.ui
});
export default connect(mapStates)(CreateProduct);
