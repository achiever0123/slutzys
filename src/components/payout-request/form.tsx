import { useState, useEffect } from 'react';
import {
  Form, Button, Input, Space, Statistic, Tag, Alert, Select, InputNumber, DatePicker, message, Divider
} from 'antd';
import {
  PayoutRequestInterface
} from 'src/interfaces';
import Router from 'next/router';
import { payoutRequestService } from '@services/payout-request.service';
import moment from 'moment';

interface Props {
  submit: Function;
  submiting: boolean;
  payout?: Partial<PayoutRequestInterface>;
  statsPayout: {
    totalPrice: number;
    paidPrice: number;
    unpaidPrice: number;
  };
}

const PayoutRequestForm = ({
  payout, submit, submiting, statsPayout
}: Props) => {
  const {
    requestNote, fromDate, toDate, requestedPrice, status, paymentAccountType
  } = payout;
  const [form] = Form.useForm();
  const [price, setPrice] = useState(requestedPrice || 0);
  const [dateRange, setDateRange] = useState({ fromDate: fromDate ? moment(fromDate) : '', toDate: toDate ? moment(toDate) : '' } as any);
  const getUnpaidPriceByDate = async (range) => {
    const resp = await payoutRequestService.calculate(range);
    setPrice(resp?.data?.unpaidPrice || 0);
  };
  useEffect(() => {
    getUnpaidPriceByDate(dateRange);
  }, [dateRange]);

  return (
    <Form
      form={form}
      layout="vertical"
      className="payout-request-form"
      name="payoutRequestForm"
      onFinish={(data) => {
        if (!dateRange.fromDate || !dateRange.toDate) {
          message.error('Please select date range');
          return;
        }
        if (!price) {
          message.error('You have been paid out!');
          return;
        }
        submit({ ...data, ...dateRange });
      }}
      initialValues={{
        requestNote,
        paymentAccountType
      }}
    >
      <div>
        <Space size="large">
          <Statistic
            title="Total Price"
            value={statsPayout?.totalPrice || 0}
            precision={2}
            prefix="$"
          />
          <Statistic
            title="Unpaid Price"
            value={statsPayout?.unpaidPrice || 0}
            precision={2}
            prefix="$"
          />
          <Statistic
            title="Paid Price"
            value={statsPayout?.paidPrice || 0}
            precision={2}
            prefix="$"
          />
        </Space>
      </div>
      <Divider />
      <Form.Item label="Select date range">
        <DatePicker.RangePicker
          defaultValue={[dateRange.fromDate, dateRange.toDate]}
          onChange={(dates: [any, any], dateStrings: [string, string]) => setDateRange({
            fromDate: dateStrings[0],
            toDate: dateStrings[1]
          })}
        />
      </Form.Item>
      <Form.Item label="Request Price">
        <InputNumber disabled value={price} min={0} />
      </Form.Item>
      <Form.Item label="Note to Admin" name="requestNote">
        <Input.TextArea disabled={payout && payout.status === 'done'} placeholder="Text something to admin here" rows={3} />
      </Form.Item>
      {payout?.adminNote && (
      <Form.Item label="Admin noted">
        <Alert type="info" message={payout?.adminNote} />
      </Form.Item>
      )}
      {payout._id && (
      <Form.Item label="Status">
        <Tag color="orange" style={{ textTransform: 'capitalize' }}>{status}</Tag>
      </Form.Item>
      )}
      <Form.Item label="Select payout method" name="paymentAccountType">
        <Select>
          <Select.Option value="banking" key="banking">
            <img src="/banking-ico.png" height="20px" alt="banking" />
            {' '}
            Banking
          </Select.Option>
          <Select.Option value="paypal" key="paypal">
            <img src="/paypal-ico.png" height="20px" alt="paypal" />
            {' '}
            Paypal
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          className="primary"
          loading={submiting}
          htmlType="submit"
          disabled={['done', 'approved'].includes(status) || submiting}
          style={{ margin: '0 5px' }}
        >
          Submit
        </Button>
        <Button
          className="secondary"
          loading={submiting}
          htmlType="button"
          disabled={submiting}
          style={{ margin: '0 5px' }}
          onClick={() => Router.back()}
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

PayoutRequestForm.defaultProps = {
  payout: {
    requestNote: '',
    paymentAccountType: 'banking'
  }
};

export default PayoutRequestForm;
