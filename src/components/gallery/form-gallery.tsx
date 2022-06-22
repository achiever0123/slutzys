/* eslint-disable react/require-default-props */
import React from 'react';
import {
  Form, Input, Button, Select, Upload
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
  return (
    <>
      <Form
        form={form}
        name="galleryForm"
        onFinish={onFinish.bind(this)}
        initialValues={
          gallery || { name: '', status: 'active', description: '' }
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        className="account-form"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input name of gallery!' }]}
          label="Name"
        >
          <Input placeholder="Enter gallery's name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status!' }]}
        >
          <Select>
            <Select.Option key="active" value="active">
              Active
            </Select.Option>
            <Select.Option key="inactive" value="inactive">
              Inactive
            </Select.Option>
          </Select>
        </Form.Item>
        {gallery && (
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
        )}
        {filesList && filesList.length > 0 && (
        <PhotoUploadList
          files={filesList}
          setCover={setCover && setCover.bind(this)}
          remove={removePhoto && removePhoto.bind(this)}
        />
        )}
        <Form.Item>
          <Button
            className="primary"
            htmlType="submit"
            loading={submiting}
            disabled={submiting}
            style={{ marginRight: '20px' }}
          >
            Submit
          </Button>
          <Button
            className="secondary"
            onClick={() => Router.back()}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormGallery;
