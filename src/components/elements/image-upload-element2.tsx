import { PureComponent } from 'react';
import { Upload, message } from 'antd';
import { getGlobalConfig } from 'src/services';
import { LoadingOutlined, CameraOutlined, EditFilled, FileDoneOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import './image-upload-element.less';
import ImageUpload from './upload';
import { some } from 'lodash';


interface IState {
    fileList: any;
}

interface IProps {
    imageFile?: any;
    isDisabled?: boolean;
    beforeUpload?: any;
}

export class ImageUploadElement extends PureComponent<IProps, IState> {
    state = {
        fileList: []
    };

    onChange = ({ fileList: newFileList }) => {
        this.setState({ fileList: newFileList });
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
        const { fileList } = this.state;
        const { isDisabled, beforeUpload, imageFile } = this.props;

        return (
            <ImgCrop rotate>
                <Upload
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={this.onChange}
                    onPreview={this.onPreview}
                    disabled={isDisabled}
                    beforeUpload={beforeUpload}
                >
                    {fileList.length < 5 && '+ Upload'}
                </Upload>
            </ImgCrop>

            /* imageUrl && (
                <div style={{ position: "relative" }} className="avatar-wrapper">
                    <ImgCrop aspect={1 / 1} rotate shape="rect" quality={1} modalTitle="Edit Avatar" modalWidth={768}>
                        <Upload
                            accept="image/*"
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader upload-btn"
                            showUploadList={false}
                            action={uploadUrl}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange}
                            onPreview={this.onPreview}
                            headers={headers}
                        >
                            {uploadButton}
                        </Upload>

                    </ImgCrop>
                    <img src={imageUrl} alt="avatar" />
                </div>
            ) */
        );
    }
}
