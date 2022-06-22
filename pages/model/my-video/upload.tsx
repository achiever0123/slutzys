import { PureComponent } from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import { message, Layout, PageHeader } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { videoService } from '@services/video.service';
import { FormUploadVideo } from '@components/video/form-upload';
import Router from 'next/router';
import { IUIConfig, IUser } from 'src/interfaces';
import { getResponseError } from '@lib/utils';

interface IProps {
  ui: IUIConfig;
  user: IUser;
}
interface IFiles {
  fieldname: string;
  file: File;
}

interface IResponse {
  data: { _id: string };
}

class UploadVideo extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  state = {
    uploading: false,
    uploadPercentage: 0
  };

  _files: {
    thumbnail: File;
    video: File;
  } = {
    thumbnail: null,
    video: null
  };

  onUploading(resp: any) {
    this.setState({ uploadPercentage: resp.percentage });
  }

  beforeUpload(file: File, field: string) {
    this._files[field] = file;
  }

  async submit(data: any) {
    if (!this._files.video) {
      return message.error('Please select video!');
    }

    if (
      (data.isSaleVideo && !data.price)
      || (data.isSaleVideo && data.price < 1)
    ) {
      return message.error('Invalid price');
    }
    // eslint-disable-next-line no-param-reassign
    data.tags = [...[], ...data.tags];
    // eslint-disable-next-line no-param-reassign
    data.participantIds = [...[], ...data.participantIds];
    const files = Object.keys(this._files).reduce((f, key) => {
      if (this._files[key]) {
        f.push({
          fieldname: key,
          file: this._files[key] || null
        });
      }
      return f;
    }, [] as IFiles[]) as [IFiles];

    await this.setState({
      uploading: true
    });
    try {
      (await videoService.uploadVideo(
        files,
        data,
        this.onUploading.bind(this)
      )) as IResponse;
      message.success('Video has been uploaded');
      // TODO - process for response data?
      Router.push('/model/my-video');
      return this.setState({
        uploading: false
      });
    } catch (error) {
      message.error(
        getResponseError(error) || 'An error occurred, please try again!'
      );
      return this.setState({
        uploading: false
      });
    }
  }

  render() {
    const { uploading, uploadPercentage } = this.state;
    const { ui, user } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Upload video
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Upload Video"
          />
          <FormUploadVideo
            user={user}
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
  ui: state.ui,
  user: state.user.current
});
export default connect(mapStates)(UploadVideo);
