/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import {
    Form, Input, Button, Select, Upload, Switch, InputNumber, Row, Col
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { IGallery } from 'src/interfaces';
import Router from 'next/router';
import PhotoUploadList from '@components/file/upload-list';
import './gallery.less';

interface IProps {
    gallery?: IGallery;
    onFinish: Function;
    submiting: boolean;
    filesList?: any[];
    handleBeforeUpload?: Function;
    removePhoto?: Function;
    setCover?: Function;
}

const { Dragger } = Upload;

const FormGallery = ({
    onFinish,
    submiting,
    filesList,
    handleBeforeUpload,
    removePhoto,
    setCover,
    gallery = null
}: IProps) => {
    const [form] = Form.useForm();
    const [data, setData] = useState({
        isSale: gallery ? gallery.isSale : false,
        price: gallery ? gallery.price : 0,
    })
    const onSwitch = (field: string, checked: any) => {
        setData({
            ...data,
            [field]: checked,
        })
    }
    return (
        <>
            <Form
                form={form}
                name="galleryForm"
                onFinish={(formData) => onFinish({ ...formData, ...data })/* .bind(this) */}
                initialValues={
                    gallery || { name: '', status: 'active', description: '', isSale: false }
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="account-form"
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please input name of gallery!' }]}
                >
                    <Input placeholder="Enter gallery's name" />
                </Form.Item>
                <Form.Item
                    name="description"
                >
                    <Input.TextArea rows={3} placeholder="Enter gallery description" />
                </Form.Item>
                <Dragger
                    customRequest={() => false}
                    accept="image/*"
                    multiple
                    showUploadList={false}
                    listType="picture"
                    disabled={submiting}
                    beforeUpload={handleBeforeUpload && handleBeforeUpload.bind(this)}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Drag & drop files to this area or browser to upload
                    </p>
                    <p className="ant-upload-hint">
                        Support image files only.
                    </p>
                </Dragger>
                {filesList && filesList.length > 0 && (
                    <PhotoUploadList
                        files={filesList}
                        setCover={setCover && setCover.bind(this)}
                        remove={removePhoto && removePhoto.bind(this)}
                    />
                )}
                <div style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 20px"
                }}
                >
                    <div style={{ padding: "10px 0px" }}>
                        <Switch
                            checked={data.isSale}
                            onChange={(checked) => onSwitch("isSale", checked)}
                        />
                        <span className="swith-label" style={{ marginLeft: '5px' }}>Premium</span>
                    </div>
                    <div>
                        {data.isSale && (
                            <>
                                <span className="swith-label" style={{ marginRight: '10px' }}>Price</span>
                                <InputNumber min={1} size="small" onChange={(value) => onSwitch('price', value)} />
                            </>

                        )}
                    </div>
                </div>
                <Row className="post-btn-wrapper">
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Form.Item>
                            <Button
                                className="primary"
                                htmlType="submit"
                                loading={submiting}
                                disabled={submiting}
                            >
                                Upload
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default FormGallery;
