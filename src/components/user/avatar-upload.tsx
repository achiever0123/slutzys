import { PureComponent } from 'react';
import { Upload, message } from 'antd';
import { getGlobalConfig } from 'src/services';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5);
  if (!isLt2M) {
    message.error(`Image must be smaller than ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB!`);
  }
  return isLt2M;
}

interface IState {
  loading: boolean;
  imageUrl: string;
}

interface IProps {
  image?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
}

export class AvatarUpload extends PureComponent<IProps, IState> {
  state = {
    loading: false,
    imageUrl: ''
  };

  componentDidMount() {
    const { image } = this.props;
    this.setState({ imageUrl: image || '' });
  }

  handleChange = (info) => {
    const { onUploaded } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
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

  onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  render() {
    const { loading } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <CameraOutlined />}
      </div>
    );
    const { imageUrl } = this.state;
    const { headers, uploadUrl } = this.props;
    return (
      <ImgCrop rotate shape="round" quality={1} modalTitle="Edit Avatar" modalWidth={768}>
        <Upload
          accept="image/*"
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={uploadUrl}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
          onPreview={this.onPreview}
          headers={headers}
        >
          {imageUrl && (
            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
          )}
          {uploadButton}
        </Upload>
      </ImgCrop>
    );
  }
}
