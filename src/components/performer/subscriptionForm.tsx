import { PureComponent } from 'react';
import {
  Form, InputNumber, Button, Row, Col
} from 'antd';
import { IPerformer } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    range: 'Must be between ${min} and ${max}'
  }
};

interface IProps {
  onFinish: Function;
  user: IPerformer;
  updating?: boolean;
}

export class PerformerSubscriptionForm extends PureComponent<IProps> {
  render() {
    const { onFinish, user, updating } = this.props;
    return (
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish.bind(this)}
        validateMessages={validateMessages}
        initialValues={user}
        labelAlign="left"
        className="account-form"
      >
        <Row>
          <Col xl={12} md={12} xs={12}>
            <Form.Item
              name="monthlyPrice"
              label="Monthly Subscription Price in $"
              rules={[{ required: true, message: 'Please enter monthly subscription price' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xl={12} md={12} xs={12}>
            <Form.Item
              name="yearlyPrice"
              label="Yearly Subscription Price in $"
              rules={[{ required: true, message: 'Please enter yearly subscription price' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="text-center">
          <Button
            className="primary"
            type="primary"
            htmlType="submit"
            loading={updating}
            disabled={updating}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
