import { PureComponent } from 'react';
import {
  Layout, message, Button, Descriptions, Tag, PageHeader
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { IOrder, IUIConfig } from 'src/interfaces';
import { orderService } from 'src/services';
import { connect } from 'react-redux';
import Router from 'next/router';

const { Item } = Descriptions;

interface IProps {
  id: string;
  ui: IUIConfig;
}

interface IStates {
  order: IOrder;
}

const productType = (type: string) => {
  switch (type) {
    case 'sale_video':
      return <Tag color="green">VOD</Tag>;
    case 'digital':
      return <Tag color="red">Digital Product</Tag>;
    case 'physical':
      return <Tag color="red">Physical Product</Tag>;
    case 'monthly_subscription':
      return <Tag color="blue">Monthly Subscription</Tag>;
    case 'yearly_subscription':
      return <Tag color="blue">Yearly Subscription</Tag>;
    default: return <Tag color="#FFCF00">{type}</Tag>;
  }
};

class OrderDetailPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      order: null
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      const { id } = this.props;
      const order = await orderService.findById(id);
      await this.setState({
        order: order?.data
      });
    } catch (e) {
      message.error('cannot find order!');
      Router.back();
    }
  }

  async downloadFile(order) {
    const resp = await orderService.getDownloadLinkDigital(order.productId);
    window.open(resp.data.downloadLink, '_blank');
  }

  render() {
    const { ui } = this.props;
    const { order } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | Order #${order?.orderNumber || ''}`}
          </title>
        </Head>
        {order && (
        <div className="main-container">
          <PageHeader
            onBack={() => Router.back()}
            backIcon={<ArrowLeftOutlined />}
            title={`Order ID: #${order?.orderNumber}`}
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
              {productType(order?.productType)}
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
              {`${(order?.couponInfo?.value || 0) * 100}%`}
              {' '}
              - $
              {((order?.originalPrice || 0) * order?.couponInfo.value).toFixed(2)}
            </Item>
            )}
            <Item key="totalPrice" label="Total Price">
              {order?.payBy === 'money' && '$'}
              {(order?.totalPrice || 0).toFixed(2)}
              {order?.payBy === 'token' && 'Tokens'}
            </Item>
            <Item key="gateway" label="Payment Gateway">
              <Tag color="blue">{order?.paymentGateway}</Tag>
            </Item>
            <Item key="status" label="Status">
              <Tag color="red">{order?.status}</Tag>
            </Item>
          </Descriptions>
          {['physical'].includes(order?.productType) ? (
            <>
              <div style={{ marginBottom: '10px' }}>
                Delivery Address:
                {' '}
                {order?.deliveryAddress || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                Delivery Postal Code:
                {' '}
                {order?.postalCode || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                Delivery Phone Number:
                {' '}
                {order?.phoneNumber || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
                Shipping Code:
                {' '}
                <Tag color="blue">{order?.shippingCode || 'N/A'}</Tag>
              </div>
              <div style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
                Delivery Status:
                {' '}
                <Tag color="magenta">{order?.deliveryStatus || 'N/A'}</Tag>
              </div>
            </>
          ) : (
            <div style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
              Delivery Status:
              {' '}
              <Tag color="green">Delivered</Tag>
            </div>
          )}
          {order?.productType === 'digital' && (
          <div style={{ marginBottom: '10px' }}>
            Download Link:
            {' '}
            <a href="#" onClick={this.downloadFile.bind(this, order)}>Click to download</a>
          </div>
          )}
          <div style={{ marginBottom: '10px' }}>
            <Button danger onClick={() => Router.back()}>
              Back
            </Button>
          </div>
        </div>
        )}
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});

export default connect(mapStates)(OrderDetailPage);
