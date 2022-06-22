import { PureComponent } from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import { videoService } from '@services/video.service';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FormUploadVideo } from '@components/video/form-upload';
import { IVideo, IUIConfig, IUser } from 'src/interfaces';
import Router from 'next/router';
import {
  Layout, message, Spin, PageHeader
} from 'antd';
import { getResponseError } from '@lib/utils';
import moment from 'moment';

interface IProps {
  id: string;
  ui: IUIConfig;
  user: IUser;
}

interface IFiles {
  fieldname: string;
  file: File;
}

class VideoUpdate extends PureComponent<IProps> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    fetching: true,
    uploading: false,
    uploadPercentage: 0,
    video: {} as IVideo
  };

  _files: {
    thumbnail: File;
    teaser: File;
    video: File;
  } = {
    thumbnail: null,
    teaser: null,
    video: null
  };

  async componentDidMount() {
    try {
      const { id } = this.props;
      const resp = await videoService.findById(id);
      this.setState({ video: resp.data });
    } catch (e) {
      message.error('Video not found!');
      Router.back();
    } finally {
      this.setState({ fetching: false });
    }
  }

  onUploading(resp: any) {
    this.setState({ uploadPercentage: resp.percentage });
  }

  beforeUpload(file: File, field: string) {
    this._files[field] = file;
  }

  async submit(data: any) {
    const { video } = this.state;
    const submitData = { ...data };
    if ((data.isSale && !data.price) || (data.isSale && data.price < 1)) {
      message.error('Invalid amount of tokens');
      return;
    }
    if ((data.isSchedule && !data.scheduledAt) || (data.isSchedule && moment(data.scheduledAt).isBefore(moment()))) {
      message.error('Invalid schedule date');
      return;
    }
    submitData.tags = [...data.tags];
    submitData.participantIds = [...data.participantIds];
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
      await videoService.update(
        video._id,
        files,
        data,
        this.onUploading.bind(this)
      );
      message.success('Video has been uploaded');
      Router.push('/model/my-video');
    } catch (error) {
      message.error(getResponseError(error) || 'An error occurred, please try again!');
    } finally {
      this.setState({ uploading: false });
    }
  }

  render() {
    const {
      video, uploading, fetching, uploadPercentage
    } = this.state;
    const { ui, user } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Edit Video
          </title>
        </Head>
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title="Edit Video"
          />
          {!fetching && video ? (
            <FormUploadVideo
              user={user}
              video={video}
              submit={this.submit.bind(this)}
              uploading={uploading}
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
  ui: state.ui,
  user: state.user.current
});
export default connect(mapStates)(VideoUpdate);
