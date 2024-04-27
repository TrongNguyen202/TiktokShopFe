import { Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import React from 'react';

import { getPathByIndex } from '../../utils';

function PromotionSelectedProduct({ data, promotionType, discount }: any) {
  const shopId = getPathByIndex(2);

  const expandedRowRender = (record: any) => {
    const columnsRow: any = [
      {
        title: 'SKU Name',
        dataIndex: 'seller_sku',
        key: 'seller_sku',
      },
      {
        title: 'Original Price',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: (text: any) => (
          <p>
            <span>$</span>
            <span>{text.original_price}</span>
          </p>
        ),
      },
      {
        title: 'Deal Price',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: (text: any) => {
          const dealPrice = Number(text.original_price) - Number(text.original_price) * (discount / 100);
          return (
            <p>
              <span>$</span>
              <span>{dealPrice.toFixed(2)}</span>
            </p>
          );
        },
      },
    ];

    return (
      <div className="py-2">
        <p className="mb-3 text-[#1677ff] font-bold">
          <i>({record.skus.length} items)</i>
        </p>
        <Table columns={columnsRow} dataSource={record.skus} pagination={false} />
      </div>
    );
  };

  const columns: any = [
    // Table.EXPAND_COLUMN,
    {
      title: 'Product Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: '100px',
      render: (_: any, record: any) => (
        <Link to={`/shops/${shopId}/products/${record.id}`} target="_blank">
          <EyeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        </Link>
      ),
    },
  ];

  function handleRowClick(record: any): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="w-full">
      <p className="mb-2 text-sm font-semibold">{data.length} products selected</p>
      <Table
        showHeader={false}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 50,
        }}
        {...(promotionType === 'FlashSale' && {
          expandable: {
            expandedRowRender: (record) => expandedRowRender(record),
          },
        })}
        rowKey={(record) => record.id}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </div>
  );
}

export default PromotionSelectedProduct;
