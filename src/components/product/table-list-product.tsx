import { PureComponent } from 'react';
import { Table, Button, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { ImageProduct } from '@components/product/image-product';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deleteProduct?: Function;
}

export class TableListProduct extends PureComponent<IProps> {
  render() {
    const {
      dataSource,
      rowKey,
      loading,
      pagination,
      onChange,
      deleteProduct
    } = this.props;
    const columns = [
      {
        title: '',
        dataIndex: 'image',
        render(data, record) {
          return <ImageProduct product={record} />;
        }
      },
      {
        title: 'Name',
        dataIndex: 'name',
        render(name: string, record) {
          return <Link href={{ pathname: '/store/details', query: { id: record?.slug || record?._id } }} as={`/store/${record?.slug || record?._id}`}><a>{name}</a></Link>;
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
      {
        title: 'Stock',
        dataIndex: 'stock',
        render(stock: number, record) {
          return <span>{record.type === 'physical' ? stock : ''}</span>;
        }
      },
      {
        title: 'Type',
        dataIndex: 'type',
        render(type: string) {
          switch (type) {
            case 'physical':
              return <Tag color="blue">Physical</Tag>;
            case 'digital':
              return <Tag color="orange">Digital</Tag>;
            default:
              break;
          }
          return <Tag color="">{type}</Tag>;
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(status: string) {
          switch (status) {
            case 'active':
              return <Tag color="green">Active</Tag>;
            case 'inactive':
              return <Tag color="orange">Inactive</Tag>;
            default:
              break;
          }
          return <Tag color="default">{status}</Tag>;
        }
      },
      {
        title: 'Last update',
        dataIndex: 'updatedAt',
        sorter: true,
        render(date: Date) {
          return <span>{formatDate(date)}</span>;
        }
      },
      {
        title: 'Actions',
        dataIndex: '_id',
        render: (id: string) => (
          <>
            <Button className="info">
              <Link
                href={{
                  pathname: '/model/my-store/update',
                  query: { id }
                }}
                as={`/model/my-store/update?id=${id}`}
              >
                <a>
                  <EditOutlined />
                </a>
              </Link>
            </Button>
            <Button
              className="danger"
              onClick={deleteProduct && deleteProduct.bind(this, id)}
            >
              <DeleteOutlined />
            </Button>
          </>
        )
      }
    ];
    return (
      <div className="table-responsive">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={rowKey}
          loading={loading}
           pagination={pagination}
          onChange={onChange.bind(this)}
        />
      </div>
    );
  }
}
