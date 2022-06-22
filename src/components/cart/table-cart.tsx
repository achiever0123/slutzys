import { PureComponent } from 'react';
import {
  Table, Button, InputNumber, message
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ImageProduct } from '@components/product/image-product';
import { IProduct } from 'src/interfaces';

interface IProps {
  dataSource: IProduct[];
  rowKey: string;
  loading?: boolean;
  pagination?: {};
  onChange?: Function;
  deleteItem?: Function;
  onChangeQuantity?: Function;
  onRemoveItemCart?: Function;
}

export class TableCart extends PureComponent<IProps> {
  timeout = 0;

  render() {
    const {
      dataSource,
      rowKey,
      loading,
      onRemoveItemCart,
      onChangeQuantity
    } = this.props;
    const changeQuantity = async (item, quantity: any) => {
      if (!quantity) return;
      try {
        if (this.timeout) clearTimeout(this.timeout);
        let remainQuantity = quantity;
        this.timeout = window.setTimeout(async () => {
          if (quantity > item.stock) {
            remainQuantity = item.stock;
            message.error('Quantity must not be larger than quantity in stock');
          }
          onChangeQuantity(item, remainQuantity);
        }, 300);
      } catch (error) {
        message.error('An error occurred, please try again!');
      }
    };
    const columns = [
      {
        title: '#',
        render(record) {
          return (<ImageProduct product={record} />);
        }
      },
      {
        title: 'Name',
        dataIndex: 'name',
        render(name) {
          return (
            <div style={{
              textTransform: 'capitalize', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}
            >
              {name}
            </div>
          );
        }
      },
      {
        title: 'Price',
        dataIndex: 'price',
        render(price: number) {
          return (
            <span>
              $
              {price.toFixed(2)}
            </span>
          );
        }
      },
      // {
      //   title: 'Type',
      //   dataIndex: 'type',
      //   render(type: string) {
      //     switch (type) {
      //       case 'digital':
      //         return <Tag color="orange">Digital</Tag>;
      //       case 'physical':
      //         return <Tag color="blue">Physical</Tag>;
      //       default:
      //         break;
      //     }
      //     return <Tag color="default">{type}</Tag>;
      //   }
      // },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        render(data, record) {
          return (
            <InputNumber
              disabled={record.type === 'digital'}
              value={record.quantity || 1}
              onChange={(value) => changeQuantity(record, value)}
              type="number"
              min={1}
              max={record.stock}
            />
          );
        }
      },
      {
        title: 'Action',
        dataIndex: '',
        render(data, record) {
          return (
            <Button className="danger" onClick={() => onRemoveItemCart(record)}>
              <DeleteOutlined />
            </Button>
          );
        }
      }
    ];
    return (
      <div className="table-responsive table-cart">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={rowKey}
          loading={loading}
          pagination={false}
        />
      </div>
    );
  }
}
