import React from 'react';
import { Table, Tag } from 'antd';
import { ISubscription } from 'src/interfaces';
import { formatDate } from '@lib/date';
import moment from 'moment';

interface IProps {
  dataSource: ISubscription[];
  pagination: any;
  rowKey: string;
  onChange: any;
  loading: boolean;
}

export const TableListSubscription = ({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading
}: IProps) => {
  const columns = [
    {
      title: 'User',
      dataIndex: 'userInfo',
      render(data, records) {
        return <span>{records?.userInfo.username || 'N/A'}</span>;
      }
    },
    {
      title: 'Type',
      dataIndex: 'subscriptionType',
      render(subscriptionType: string) {
        switch (subscriptionType) {
          case 'monthly':
            return <Tag color="#936dc9">Monthly Subscription</Tag>;
          case 'yearly':
            return <Tag color="#00dcff">Yearly Subscription</Tag>;
          case 'system':
            return <Tag color="#FFCF00">System</Tag>;
          default:
            return null;
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string, record) {
        switch (status) {
          case 'active':
            return <Tag color={moment().isAfter(moment(record.expiredAt)) ? 'red' : 'success'}>{moment().isAfter(moment(record.expiredAt)) ? 'Deactivated' : 'Active'}</Tag>;
          case 'deactivated':
            return <Tag color="red">Deactivated</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: 'Start Date',
      dataIndex: 'createdAt',
      render(data, records) {
        return <span>{records?.status === 'active' ? formatDate(records.createdAt, 'LL') : ''}</span>;
      }
    },
    {
      title: 'Renewal Date',
      dataIndex: 'nextRecurringDate',
      render(data, records) {
        return <span>{records?.status === 'active' ? formatDate(records.nextRecurringDate, 'LL') : ''}</span>;
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiredAt',
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Last update',
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    }
  ];
  return (
    <div className="table-responsive">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        pagination={pagination}
        onChange={onChange}
        loading={loading}
      />
    </div>
  );
};
