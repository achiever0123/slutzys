import { PureComponent } from 'react';
import { Upload, message } from 'antd';
import { getGlobalConfig } from 'src/services';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isLt5M = file.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5);
  if (!isLt5M) {
    message.error(`Image must be smaller than ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB!`);
  }
  return isLt5M;
}

interface IState {
  loading: boolean;
  imageUrl: string;
}

interface IProps {
  imageUrl?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
  onFileReaded?: Function;
  options?: any;
  accept?: string;
}

export class ImageUpload extends PureComponent<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      imageUrl: props.imageUrl
    };
  }

  handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      const { onFileReaded, onUploaded } = this.props;
      onFileReaded && onFileReaded(info.file.originFileObj);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          loading: false
        });
        onUploaded
          && onUploaded({
            response: info.file.response,
            base64: imageUrl
          });
      });
    }
  };

  render() {
    const {
      options = {}, headers, uploadUrl, accept
    } = this.props;
    const { loading, imageUrl } = this.state;

    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <CameraOutlined />}
      </div>
    );
    return (
      <Upload
        accept={accept || 'image/*'}
        name={options.fieldName || 'file'}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        headers={headers}
      >
        {imageUrl && <img src={imageUrl} alt="file" style={{ width: '100%' }} />}
        {uploadButton}
      </Upload>
    );
  }
}
