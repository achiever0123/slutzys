import { PureComponent } from 'react';
import Head from 'next/head';
import {
  message, Layout, Spin, PageHeader
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productService } from '@services/product.service';
import { IProduct, IUIConfig } from 'src/interfaces';
import { FormProduct } from '@components/product/form-product';
import Router from 'next/router';
import { connect } from 'react-redux';
import { getResponseError } from '@lib/utils';

interface IProps {
  id: string;
  ui: IUIConfig;
}

interface IFiles {
  fieldname: string;
  file: File;
}

class ProductUpdate extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    submitting: false,
    fetching: true,
    product: {} as IProduct,
    uploadPercentage: 0
  };

  _files: {
    digitalFile: File;
  } = {
    digitalFile: null
  };

  async componentDidMount() {
    try {
      const { id } = this.props;
      const resp = await productService.findById(id);
      this.setState({ product: resp.data });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err) || 'Product not found!');
    } finally {
      this.setState({ fetching: false });
    }
  }

  onUploading(resp: any) {
    this.setState({ uploadPercentage: resp.percentage });
  }

  beforeUpload(file: File) {
    this._files.digitalFile = file;
  }

  async submit(data: any) {
    try {
      const { id } = this.props;
      const files = Object.keys(this._files).reduce((tmpFiles, key) => {
        if (this._files[key]) {
          tmpFiles.push({
            fieldname: key,
            file: this._files[key] || null
          });
        }
        return tmpFiles;
      }, [] as IFiles[]) as [IFiles];

      this.setState({ submitting: true });

      const submitData = {
        ...data
      };
      await productService.update(
        id,
        files,
        submitData,
        this.onUploading.bind(this)
      );
      message.success('Updated successfully');
      Router.push('/model/my-store');
    } catch (e) {
      message.error(getResponseError(await e) || 'Something went wrong, please try again!');
      this.setState({ submitting: false });
    }
  }

  render() {
    const {
      product, submitting, fetching, uploadPercentage
    } = this.state;
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Edit Product
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Edit Product"
          />
          {!fetching && product ? (
            <FormProduct
              product={product}
              submit={this.submit.bind(this)}
              uploading={submitting}
              beforeUpload={this.beforeUpload.bind(this)}
              uploadPercentage={uploadPercentage}
            />
          ) : <div className="text-center"><Spin /></div>}
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});
export default connect(mapStates)(ProductUpdate);
