import { PureComponent } from 'react';
import {
  Layout, message, Input, Select, Button,
  Tag, Descriptions, Alert, PageHeader
} from 'antd';
import Head from 'next/head';
import { IOrder, IUIConfig } from 'src/interfaces';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { orderService } from 'src/services';
import { connect } from 'react-redux';
import Router from 'next/router';
import { getResponseError } from '@lib/utils';

const { Item } = Descriptions;
interface IProps {
  id: string;
  ui: IUIConfig;
}

interface IStates {
  submitting: boolean;
  order: IOrder;
  shippingCode: string;
  deliveryStatus: string;
}

const productType = (type: string) => {
  switch (type) {
    case 'digital':
      return <Tag color="red">Digital Product</Tag>;
    case 'physical':
      return <Tag color="red">Physical Product</Tag>;
    case 'monthly_subscription':
      return <Tag color="blue">Monthly Subscription</Tag>;
    case 'yearly_subscription':
      return <Tag color="blue">Yearly Subscription</Tag>;
    case 'sale_video':
      return <Tag color="orange">Video</Tag>;
    default: return <Tag color="#FFCF00">{type}</Tag>;
  }
};

class OrderDetailPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      submitting: false,
      order: null,
      shippingCode: '',
      deliveryStatus: ''
    };
  }

  componentDidMount() {
    this.getData();
  }

  async onUpdate() {
    const { deliveryStatus, shippingCode } = this.state;
    const { id } = this.props;
    if (!shippingCode) {
      message.error('Missing shipping code');
      return;
    }
    try {
      this.setState({ submitting: true });
      await orderService.update(id, { deliveryStatus, shippingCode });
      message.success('Changes saved.');
      Router.back();
    } catch (e) {
      message.error(getResponseError(e));
    } finally {
      await this.setState({ submitting: false });
    }
  }

  async getData() {
    try {
      const { id } = this.props;
      const order = await orderService.findById(id);
      await this.setState({
        order: order.data,
        shippingCode: order.data.shippingCode,
        deliveryStatus: order.data.deliveryStatus
      });
    } catch (e) {
      message.error('cannot find order!');
      Router.back();
    }
  }

  render() {
    const { ui } = this.props;
    const { order, submitting } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | #${order?.orderNumber}`}
          </title>
        </Head>
        <div className="main-container">
          {order && (
            <div className="main-container">
              <PageHeader
                onBack={() => Router.back()}
                backIcon={<ArrowLeftOutlined />}
                title={`Order ID: ${order?.orderNumber}`}
              />
              <Descriptions>
                <Item key="seller" label="Model">
                  {order?.seller?.name || order?.seller?.username || 'N/A'}
                </Item>
                <Item key="name" label="Product">
                  {order?.name || 'N/A'}
                </Item>
                <Item key="description" label="Description">
                  {order?.description || 'N/A'}
                </Item>
                <Item key="productType" label="Product type">
                  {productType(order.productType)}
                </Item>
                <Item key="unitPrice" label="Unit price">
                  {`$${order?.unitPrice}` || '0'}
                </Item>
                <Item key="quantiy" label="Quantity">
                  {order?.quantity || '0'}
                </Item>
                <Item key="originalPrice" label="Original Price">
                  {`$${order?.originalPrice}` || '0'}
                </Item>
                {order.couponInfo && (
                  <Item key="discount" label="Discount">
                    {order?.couponInfo?.value * (order?.originalPrice || 0) || ''}
                  </Item>
                )}
                <Item key="totalPrice" label="Total Price">
                  {order?.payBy === 'money' && '$'}
                  {(order?.totalPrice || 0).toFixed(2)}
                  {order?.payBy === 'token' && 'Tokens'}
                </Item>
                {order?.status && (
                <Item key="status" label="Payment Status">
                  <Tag color="blue">{order?.status}</Tag>
                </Item>
                )}
              </Descriptions>
              {['physical'].includes(order?.productType)
                ? (
                  <>
                    <div style={{ marginBottom: '10px' }}>
                      Delivery Address:
                      {' '}
                      {order.deliveryAddress || 'N/A'}
                    </div>
                    <Alert type="warning" message="Update shipping code & delivery status below!" />
                    <div style={{ marginBottom: '10px' }}>
                      Shipping Code:
                      <Input
                        placeholder="Enter shipping code here"
                        defaultValue={order.shippingCode}
                        onChange={(e) => this.setState({ shippingCode: e.target.value })}
                      />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      Delivery Status:
                      {' '}
                      <Select
                        onChange={(e) => {
                          if (order.productType !== 'physical') return;
                          this.setState({ deliveryStatus: e });
                        }}
                        defaultValue={order.deliveryStatus}
                        disabled={submitting}
                        style={{ minWidth: '120px' }}
                      >
                        <Select.Option key="created" value="created">
                          Created
                        </Select.Option>
                        <Select.Option key="processing" value="processing">
                          Processing
                        </Select.Option>
                        <Select.Option key="shipping" value="shipping">
                          Shipping
                        </Select.Option>
                        <Select.Option key="delivered" value="delivered">
                          Delivered
                        </Select.Option>
                        <Select.Option key="refunded" value="refunded">
                          Refunded
                        </Select.Option>
                      </Select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <Button danger onClick={this.onUpdate.bind(this)} disabled={submitting}>
                        Update
                      </Button>
                    </div>
                  </>
                ) : (
                  <div style={{ marginBottom: '10px' }}>
                    Delivery Status:
                    {' '}
                    <Tag color="green">Delivered</Tag>
                  </div>
                )}
            </div>
          )}
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});

export default connect(mapStates)(OrderDetailPage);
