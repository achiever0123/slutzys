import React from 'react';
/* import 'antd/dist/antd.css';
import './index.css'; */
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';

const ImageUploadElement = ({ beforeUpload, isDisabled, imageFile }) => {
    const [fileList, setFileList] = useState([]);

    const onChange = ({ fileList: newFileList }) => {
        beforeUpload(newFileList);
    };

    const onPreview = async (file) => {
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
        imgWindow?.document.write(image.outerHTML);
    };
    console.log('imageFile', imageFile)
    console.log('imageFile2', fileList)
    return (
        <ImgCrop rotate>
            <Upload
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={imageFile ? [imageFile] : []}
                onChange={onChange}
                onPreview={onPreview}
                disabled={isDisabled}
                beforeUpload={beforeUpload}
            >
                {fileList.length < 5 && '+ Upload'}
            </Upload>
        </ImgCrop>
    );
};

export default ImageUploadElement;