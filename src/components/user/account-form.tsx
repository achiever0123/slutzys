import React from 'react';
import {
  Form, Input, Button, Select, Col, Row
} from 'antd';
import { AvatarUpload } from '@components/user/avatar-upload';
import { IUser, ICountry } from 'src/interfaces';
import { getGlobalConfig } from 'src/services';

interface UserAccountFormIProps {
  user: IUser;
  updating: boolean;
  onFinish: Function;
  options?: {
    uploadHeader: any;
    avatarUrl: string;
    uploadAvatar: Function;
  };
  countries: ICountry[]
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export const UserAccountForm = ({
  updating,
  onFinish,
  user,
  options,
  countries
}: UserAccountFormIProps) => (
  <Form
    className="account-form"
    {...layout}
    name="user-account-form"
    onFinish={(data) => onFinish(data)}
    initialValues={user}
  >
    <Row>
      <Col xs={24} sm={12}>
        <Form.Item
          name="firstName"
          label="First name"
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            { required: true, message: 'Please input your first name!' },
            {
              pattern: new RegExp(
                /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
              ),
              message: 'First name cannot contain number and special character'
            }
          ]}
        >
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last name"
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            { required: true, message: 'Please input your last name!' },
            {
              pattern: new RegExp(
                /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
              ),
              message: 'Last name cannot contain number and special character'
            }
          ]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>
        <Form.Item name="username" label="Username" required>
          <Input disabled placeholder="username" />
        </Form.Item>
        <Form.Item
          label="Email address"
          name="email"
          required
        >
          <Input disabled placeholder="Email Address" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Display name"
          name="name"
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            { required: true, message: 'Please input your display name!' },
            {
              pattern: new RegExp(/^(?=.*\S).+$/g),
              message:
                  'Display name cannot contain only whitespace'
            },
            {
              min: 3,
              message: 'Display name must containt at least 3 characters'
            }
          ]}
          hasFeedback
        >
          <Input placeholder="Display name" />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
          <Select>
            <Select.Option value="male" key="male">
              Male
            </Select.Option>
            <Select.Option value="female" key="female">
              Female
            </Select.Option>
            <Select.Option value="transgender" key="transgender">
              Transgender
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please select your country!' }]}>
          <Select showSearch optionFilterProp="label">
            {countries.map((c) => (
              <Select.Option value={c.code} key={c.code} label={c.name}>
                <img alt="country_flag" src={c.flag} width="25px" />
                {' '}
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <AvatarUpload
            image={user.avatar}
            uploadUrl={options.avatarUrl}
            headers={options.uploadHeader}
            onUploaded={options.uploadAvatar}
          />
          <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
            Avatar must be
            {' '}
            {getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}
            MB or below!
          </div>
        </Form.Item>
      </Col>
    </Row>
    <Form.Item className="text-center">
      <Button htmlType="submit" className="primary" disabled={updating} loading={updating}>
        Update Profile
      </Button>
    </Form.Item>
  </Form>
);

UserAccountForm.defaultProps = {
  options: {
    uploadHeader: '',
    avatarUrl: ''
  }
};
