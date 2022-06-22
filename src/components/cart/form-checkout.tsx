import { PureComponent } from 'react';
import {
  Form, Input, Button, Row, Col, Space, Radio
} from 'antd';
import {
  PhoneOutlined, EnvironmentOutlined, TagOutlined, CodeOutlined
} from '@ant-design/icons';
import { IProduct, ICoupon, ISettings } from 'src/interfaces/index';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  settings: ISettings;
  onFinish: Function;
  submiting: boolean;
  products: IProduct[];
  coupon: ICoupon;
  isApplyCoupon: boolean;
  onApplyCoupon: Function;
}

const calTotal = (items, couponValue?: number) => {
  let total = 0;
  items?.length
    && items.forEach((item) => {
      total += (item.quantity || 1) * item.price;
    });
  if (couponValue) {
    total -= total * couponValue;
  }
  return total.toFixed(2) || 0;
};

export class CheckOutForm extends PureComponent<IProps> {
  state = {
    gateway: 'ccbill',
    couponCode: ''
  }

  componentDidUpdate(prevProps: Readonly<IProps>) {
    const { isApplyCoupon, coupon } = this.props;
    if (prevProps.isApplyCoupon && prevProps.coupon && !isApplyCoupon && !coupon) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ couponCode: '' });
    }
  }

  render() {
    const {
      onFinish, submiting, products, coupon, isApplyCoupon, onApplyCoupon, settings
    } = this.props;
    const { ccbillEnabled, verotelEnabled } = settings;
    const { couponCode, gateway } = this.state;
    let valid = true;
    products.forEach((p) => { if (p.type === 'physical') valid = false; });
    return (
      <Form
        {...layout}
        name="nest-messages"
        onFinish={(values) => {
          const data = { ...values, paymentGateway: gateway };
          onFinish(data);
        }}
        initialValues={{
          deliveryAddress: '',
          phoneNumber: '',
          postalCode: ''
        }}
        labelAlign="left"
        className="account-form"
      >
        <Row
          className="cart-form"
        >
          {!valid && (
            <>
              <Col span={12}>
                <Form.Item
                  label={(
                    <>
                      <EnvironmentOutlined />
                      &nbsp;
                      Delivery address
                    </>
                  )}
                  name="deliveryAddress"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please provide your delivery address' }
                  ]}
                >
                  <Input placeholder="Enter delivery address here" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={(
                    <>
                      <PhoneOutlined />
                      &nbsp;
                      Phone number
                    </>
                  )}
                  name="phoneNumber"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please provide your phone number' },
                    {
                      pattern: new RegExp(/^([+]\d{2,4})?\d{9,12}$/g), message: 'Please provide valid digit numbers'
                    }
                  ]}
                >
                  <Input
                    placeholder="Enter valid phone number (+910123456789)"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={(
                    <>
                      <TagOutlined />
                      &nbsp;
                      Postal code
                    </>
                  )}
                  name="postalCode"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please provide your postal code' },
                    {
                      pattern: new RegExp(/^\d{2,10}$/g), message: 'Please provide valid digit numbers'
                    }
                  ]}
                >
                  <Input
                    placeholder="Enter postal code here"
                  />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={valid ? 24 : 12}>
            <Form.Item
              name="couponCode"
              label={(
                <>
                  <CodeOutlined />
                  &nbsp;
                  Coupon
                </>
              )}
            >
              <Input.Group>
                <Input
                  onChange={(e) => this.setState({ couponCode: e.target.value })}
                  placeholder="Enter coupon code here"
                  disabled={isApplyCoupon}
                  value={couponCode}
                />
                <Button
                  style={{ marginLeft: 2 }}
                  disabled={!couponCode || submiting}
                  className={isApplyCoupon ? 'success' : 'secondary'}
                  onClick={() => onApplyCoupon(couponCode)}
                >
                  <strong>{!isApplyCoupon ? 'Apply coupon!' : 'Remove coupon!'}</strong>
                </Button>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Space className="initial-price">
              <strong style={{ fontSize: '20px' }}>Total price:</strong>
              <span className={isApplyCoupon ? 'discount-price' : ''}>
                $
                {calTotal(products)}
              </span>
              {isApplyCoupon && coupon && (
                <span>
                  $
                  {calTotal(products, coupon.value)}
                </span>
              )}
            </Space>
          </Col>
          <Col span={24}>
            <div style={{ margin: '5px 0 10px' }}>
              <Radio.Group onChange={(e) => this.setState({ gateway: e.target.value })} value={gateway}>
                {ccbillEnabled && (
                  <Radio value="ccbill">
                    <img src="/ccbill-ico.png" height="30px" alt="ccbill" />
                  </Radio>
                )}
                {verotelEnabled && (
                  <Radio value="verotel">
                    <img src="/verotel-ico.png" height="30px" alt="verotel" />
                  </Radio>
                )}
                {/* {enablePagseguro && (
                <Radio value="pagseguro">
                  <img src="/pagseguro-ico.png" height="20px" alt="pagseguro" />
                </Radio>
                )} */}
              </Radio.Group>
              {(!ccbillEnabled && !verotelEnabled) && <p>No payment gateway was configured, please try again later!</p>}
            </div>
            <Space>
              <Button
                className="primary"
                htmlType="submit"
                disabled={submiting || (!ccbillEnabled && !verotelEnabled)}
                loading={submiting}
              >
                <strong>CHECKOUT</strong>
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    );
  }
}
