import { PureComponent } from 'react';
import {
  Row, Col, Button, Select, DatePicker
} from 'antd';

const { RangePicker } = DatePicker;

const deliveryStatuses = [
  {
    key: '',
    text: 'Delivery Status'
  },
  {
    key: 'created',
    text: 'Created'
  },
  {
    key: 'processing',
    text: 'Processing'
  },
  {
    key: 'shipping',
    text: 'Shipping'
  },
  {
    key: 'delivered',
    text: 'Delivered'
  },
  {
    key: 'refunded',
    text: 'Refunded'
  }
];

const statuses = [
  {
    key: '',
    text: 'Payment Status'
  },
  {
    key: 'refunded',
    text: 'Refunded'
  },
  {
    key: 'created',
    text: 'Created'
  },
  {
    key: 'paid',
    text: 'Paid'
  }
];

interface IProps {
  onSubmit?: Function;
}

export class OrderSearchFilter extends PureComponent<IProps> {
  state = {
    deliveryStatus: '',
    status: '',
    fromDate: '',
    toDate: ''
  };

  render() {
    const { onSubmit } = this.props;
    return (
      <Row gutter={24}>

        <Col xl={4} md={6} xs={12}>
          <Select
            onChange={(val) => this.setState({ status: val })}
            style={{ width: '100%' }}
            placeholder="Select payment status"
            defaultValue=""
          >
            {statuses.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xl={4} md={6} xs={12}>
          <Select
            onChange={(val) => this.setState({ deliveryStatus: val })}
            style={{ width: '100%' }}
            placeholder="Select delivery status"
            defaultValue=""
          >
            {deliveryStatuses.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xl={6} md={6} xs={18}>
          <RangePicker
            onChange={(dates: [any, any], dateStrings: [string, string]) => this.setState({
              fromDate: dateStrings[0],
              toDate: dateStrings[1]
            })}
          />
        </Col>
        <Col xl={4} md={6} xs={6}>
          <Button type="primary" onClick={() => onSubmit(this.state)}>
            Search
          </Button>
        </Col>
      </Row>
    );
  }
}
