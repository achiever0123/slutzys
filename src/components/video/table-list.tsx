import { PureComponent } from 'react';
import {
  Table, Button, Tag, Tooltip
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { ThumbnailVideo } from './thumbnail-video';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  onDelete: Function;
}

export class TableListVideo extends PureComponent<IProps> {
  render() {
    const {
      dataSource,
      rowKey,
      loading,
      pagination,
      onChange,
      onDelete
    } = this.props;
    const columns = [
      {
        title: '#',
        render(record: any) {
          return (
            <Link href={{ pathname: '/video', query: { id: record.slug || record._id } }} as={`/video/${record.slug || record._id}`}><a><ThumbnailVideo video={record} /></a></Link>
          );
        }
      },
      {
        title: 'Title',
        dataIndex: 'title',
        render(title: string, record: any) {
          return (
            <Tooltip title={title}>
              <div style={{
                maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}
              >
                <Link href={{ pathname: '/video', query: { id: record.slug || record._id } }} as={`/video/${record.slug || record._id}`}>
                  <a>{title}</a>
                </Link>
              </div>
            </Tooltip>
          );
        }
      },
      {
        title: 'PPV',
        dataIndex: 'isSaleVideo',
        render(isSale: boolean) {
          switch (isSale) {
            case true:
              return <Tag color="green">Y</Tag>;
            case false:
              return <Tag color="red">N</Tag>;
            default: return <Tag color="orange">{isSale}</Tag>;
          }
        }
      },
      {
        title: 'Schedule',
        dataIndex: 'isSchedule',
        render(isSchedule: boolean) {
          switch (isSchedule) {
            case true:
              return <Tag color="green">Y</Tag>;
            case false:
              return <Tag color="red">N</Tag>;
            default: return <Tag color="orange">{isSchedule}</Tag>;
          }
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(status: string) {
          switch (status) {
            case 'active':
              return <Tag color="success">Active</Tag>;
            case 'inactive':
              return <Tag color="orange">Inactive</Tag>;
            default:
              return <Tag color="red">{status}</Tag>;
          }
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
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button className="info">
              <Link
                href={{
                  pathname: '/model/my-video/update',
                  query: { id }
                }}
                as={`/model/my-video/update?id=${id}`}
              >
                <a>
                  <EditOutlined />
                </a>
              </Link>
            </Button>
            <Button onClick={onDelete.bind(this, id)} className="danger">
              <DeleteOutlined />
            </Button>
          </div>
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
