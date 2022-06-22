import React from 'react';
import {
  Table, Tag, Button, Avatar
} from 'antd';
import { ISubscription } from 'src/interfaces';
import { formatDate, formatDateNoTime } from '@lib/date';
import Link from 'next/link';
import moment from 'moment';

interface IProps {
  dataSource: ISubscription[];
  pagination: any;
  rowKey: string;
  onChange: any;
  loading: boolean;
  cancelSubscription: Function;
}

export const TableListSubscription = ({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading,
  cancelSubscription
}: IProps) => {
  const columns = [
    {
      title: 'Model',
      dataIndex: 'performerInfo',
      render(data, records) {
        return (
          <Link
            href={{
              pathname: '/model/profile',
              query: { username: records?.performerInfo?.username || records?.performerInfo?._id }
            }}
            as={`/model/${records?.performerInfo?.username || records?.performerInfo?._id}`}
          >
            <a>
              <Avatar src={records?.performerInfo?.avatar || '/no-avatar.png'} />
              {' '}
              {records?.performerInfo?.username || records?.performerInfo?.name || 'N/A'}
            </a>
          </Link>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'subscriptionType',
      render(subscriptionType: string) {
        switch (subscriptionType) {
          case 'monthly':
            return <Tag color="orange">Monthly Subscription</Tag>;
          case 'yearly':
            return <Tag color="orange">Yearly Subscription</Tag>;
          case 'system':
            return <Tag color="orange">System</Tag>;
          default:
            return <Tag color="orange">{subscriptionType}</Tag>;
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
        return <span>{records?.status === 'active' ? formatDate(records.createdAt, 'LL') : 'N/A'}</span>;
      }
    },
    {
      title: 'Renewal date',
      dataIndex: 'nextRecurringDate',
      render(data, records) {
        return <span>{records?.status === 'active' ? formatDate(records.nextRecurringDate, 'LL') : 'N/A'}</span>;
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiredAt',
      render(date: Date) {
        return <span>{formatDateNoTime(date)}</span>;
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
      render(record) {
        return (
          <>
            {record.status === 'active' && moment().isBefore(moment(record.expiredAt)) && (
            <Button danger onClick={() => cancelSubscription(record)}>
              Cancel subscription
            </Button>
            )}
          </>
        );
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
