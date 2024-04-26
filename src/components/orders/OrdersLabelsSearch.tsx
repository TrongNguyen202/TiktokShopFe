import { Link } from 'react-router-dom';
import { Table } from 'antd';
import React from 'react';
import { ColumnType } from 'antd/es/table';

type Column = ColumnType<Record<string, any>>;

function OrdersLabelsSearch({ dataSource }: { dataSource: any[] }) {
  const columns: Column[] = [
    {
      title: 'SST',
      dataIndex: 'stt',
      align: 'center',
      render: (_: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Order ID',
      dataIndex: 'name',
    },
    {
      title: 'Label URL',
      dataIndex: 'link',
      render: (text: any) => (
        <Link to={text} target="_blank">
          {text}
        </Link>
      ),
    },
  ];

  return <Table columns={columns} dataSource={dataSource} pagination={false} bordered />;
}

export default OrdersLabelsSearch;
