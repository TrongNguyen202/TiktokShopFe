import { Table, Tag } from 'antd';
import React from 'react';

import { ColumnGroupType } from 'antd/es/table';
import { IntlNumberFormat } from '../../utils';
import { statusOrder } from '../../constants';

function OrderGetToShipInfo({ data, loading }: { data: any; loading: boolean }) {
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      align: 'center',
      render: (_: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      render: (_: any, record: any) => record.data.order_list[0].order_id,
    },
    {
      title: 'Tracking ID',
      dataIndex: 'tracking_id',
    },
    {
      title: 'Người mua',
      dataIndex: 'name_buyer',
    },
    {
      title: 'Địa chỉ nhận hàng',
      dataIndex: 'shipping_address',
      render: (_: any, record: any) =>
        `${record.street.replace(' - ', '')}, ${record.city}, ${record.state}, ${record.zip_code}`,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'order_status',
      render: (_: any, record: any) =>
        statusOrder.map(
          (item) => item.value === record.data.order_list[0].order_status && <Tag color={item.color}>{item.title}</Tag>,
        ),
    },
    {
      title: 'Tổng giá',
      dataIndex: 'sub_total',
      align: 'center',
      render: (_: any, record: any) =>
        IntlNumberFormat(
          record.data.order_list[0].payment_info.currency,
          'currency',
          4,
          record.data.order_list[0].payment_info.sub_total,
        ),
    },
  ];

  const checkDataTable = (value: any) => {
    if (value.length === 0) {
      return [];
    }
    const data: any[] = [];
    value.forEach((item: any) => {
      if (item.data) {
        data.push(item);
      }
    });
    return data;
  };
  return (
    <Table
      columns={columns as unknown as ColumnGroupType<any>[]}
      dataSource={checkDataTable(data).length ? checkDataTable(data) : []}
      bordered
      pagination={false}
      loading={loading}
      rowKey="order_id"
    />
  );
}

export default OrderGetToShipInfo;
