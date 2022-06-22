import { formatDate } from '@lib/date';
import {
  Table, Tooltip, Tag, Avatar
} from 'antd';

interface IProps {
  items: any[];
  total: number;
  pageSize: number;
  searching: boolean;
  onChange: Function;
}

const reportTableList = ({
  items,
  total,
  pageSize,
  searching,
  onChange
}: IProps) => {
  const columns = [
    {
      title: 'Reporter',
      dataIndex: 'sourceInfo',
      key: 'sourceInfo',
      render: (user) => (
        <span>
          <Avatar src={user?.avatar || '/no-avatar.png'} />
          {' '}
          {user?.name || user?.username || 'N/A'}
        </span>
      )
    },
    // {
    //   title: 'Type',
    //   dataIndex: 'target',
    //   key: 'target',
    //   render: (target) => (
    //     <Tag color="blue" style={{ textTransform: 'capitalize' }}>{target}</Tag>
    //   )
    // },
    {
      title: 'Video',
      dataIndex: 'targetId',
      key: 'targetId',
      render: (targetId, record) => (
        <span>
          {record?.targetInfo?.title || 'N/A'}
        </span>
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <Tooltip title={description}>
          <div style={{
            width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
          }}
          >
            {description || 'N/A'}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'created':
            return <Tag color="green">Created</Tag>;
          case 'deleted':
            return <Tag color="red">Deleted</Tag>;
          default: return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: 'Updated at',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: Date) => <span>{formatDate(updatedAt)}</span>
    }
  ];

  const dataSource = items.map((p) => ({ ...p, key: p._id }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className="table"
      pagination={{
        total,
        pageSize,
        position: ['bottomCenter']
      }}
      rowKey="_id"
      loading={searching}
      onChange={onChange.bind(this)}
    />
  );
};
export default reportTableList;
