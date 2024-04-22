import { Table, Tag } from 'antd';
import React from 'react';

import { IntlNumberFormat } from '../../utils';
import { statusOrder } from '../../constants';

function OrderGetToShipInfo({ data, loading }) {
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      render: (_, record) => record.data.order_list[0].order_id,
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
      render: (_, record) => `${record.street.replace(' - ', '')}, ${record.city}, ${record.state}, ${record.zip_code}`,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'order_status',
      render: (_, record) =>
        statusOrder.map(
          (item) => item.value === record.data.order_list[0].order_status && <Tag color={item.color}>{item.title}</Tag>,
        ),
    },
    {
      title: 'Tổng giá',
      dataIndex: 'sub_total',
      align: 'center',
      render: (_, record) =>
        IntlNumberFormat(
          record.data.order_list[0].payment_info.currency,
          'currency',
          4,
          record.data.order_list[0].payment_info.sub_total,
        ),
    },
  ];

  const checkDataTable = (value) => {
    if (value.length === 0) {
      return [];
    }
    const data = [];
    value.forEach((item) => {
      if (item.data) {
        data.push(item);
      }
    });
    return data;
  };
  return (
    <Table
      columns={columns}
      dataSource={checkDataTable(data).length ? checkDataTable(data) : []}
      bordered
      pagination={{ position: ['none'] }}
      loading={loading}
      rowKey="order_id"
    />
  );
}

export default OrderGetToShipInfo;
