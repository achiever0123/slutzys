import { useState } from 'react';
import {
  Button, Radio
} from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';
import { IPerformer, ISettings } from 'src/interfaces';
import './performer.less';

interface IProps {
  performer: IPerformer;
  onSelect: Function;
  disabled: boolean;
  settings: ISettings;
  type?: string;
}

export const SubscriptionPerformerBlock = ({
  performer, onSelect, disabled, settings, type
}: IProps) => {
  const [gateway, setGateway] = useState('ccbill');
  return (
    <div className="subscription-block">
      <h4>
        SUBSCRIBE & GET THESE BENEFITS
      </h4>
      <ul>
        <li>
          <CheckSquareOutlined />
          {' '}
          Full access to this model&apos;s content
        </li>
        <li>
          <CheckSquareOutlined />
          {' '}
          Direct message with this model
        </li>
        <li>
          <CheckSquareOutlined />
          {' '}
          Cancel your subscription at any time
        </li>
      </ul>
      <Radio.Group onChange={(e) => setGateway(e.target.value)} value={gateway}>
        {settings?.ccbillEnabled && (
          <Radio value="ccbill">
            <img src="/ccbill-ico.png" height="20px" alt="ccbill" />
          </Radio>
        )}
        {settings?.verotelEnabled && (
          <Radio value="verotel">
            <img src="/verotel-ico.png" height="20px" alt="verotel" />
          </Radio>
        )}
        {/* {ui?.enablePagseguro && (
                          <Radio value="pagseguro">
                            <img src="/pagseguro-ico.png" height="20px" alt="pagseguro" />
                          </Radio>
                          )} */}
      </Radio.Group>
      {(!settings?.ccbillEnabled && !settings?.verotelEnabled) && <p>No payment gateway was configured, please try again later!</p>}
      {!type ? (
        <>
          <Button
            className="primary"
            block
            disabled={disabled}
            onClick={() => onSelect(gateway, 'monthly')}
          >
            Monthly Subscription $
            {(performer?.monthlyPrice || 0).toFixed(2)}
          </Button>
          <div style={{ margin: 2 }} />
          <Button
            className="secondary"
            block
            disabled={disabled}
            onClick={() => onSelect(gateway, 'yearly')}
          >
            Yearly Subscription $
            {(performer?.yearlyPrice || 0).toFixed(2)}
          </Button>
        </>
      ) : (
        <Button
          style={{ textTransform: 'uppercase' }}
          className="primary"
          disabled={disabled}
          onClick={() => onSelect(gateway)}
        >
          Confirm
          {' '}
          {type}
          {' '}
          subscription for
          {' '}
          $
          {type === 'monthly' ? (performer?.monthlyPrice || 0).toFixed(2) : (performer?.yearlyPrice || 0).toFixed(2)}
        </Button>
      )}
    </div>
  );
};

SubscriptionPerformerBlock.defaultProps = {
  type: ''
};
