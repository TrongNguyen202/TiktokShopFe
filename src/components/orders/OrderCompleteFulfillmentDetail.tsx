import { Image, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/date';

import { constants } from '../../constants';

type OrderCompleteFulfillmentDetailProps = {
  data: {
    orderCode: string;
    partnerOrderId: string;
    status: string;
  };
};

function OrderCompleteFulfillmentDetail({ data }: OrderCompleteFulfillmentDetailProps) {
  const [dataTable, setDataTable] = useState([]);
  const dataTableConvert = dataTable
    .map((item: Record<string, unknown>) => {
      return (item as { products: any[] })?.products.map((product) => ({
        ...product,
        created: item.created,
        note: item.note,
      }));
    })
    .flat();

  const columns = [
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Variant',
      dataIndex: 'variant',
      key: 'variant',
      align: 'center',
      render: (_: any, record: any) => (
        <ul>
          <li>
            <span className="font-semibold">Product Type:</span> <span>{record.productTypeEnum}</span>
          </li>
          <li>
            <span className="font-semibold">Variant Sku:</span> <span>{record.variantSku}</span>
          </li>
          <li>
            <span className="font-semibold">Variant Title:</span> <span>{record.variantTitle}</span>
          </li>
          <li>
            <span className="font-semibold">Variant Size:</span> <span>{record.variantSize}</span>
          </li>
        </ul>
      ),
    },
    {
      title: 'Front',
      dataIndex: 'front',
      key: 'front',
      align: 'center',
      render: (_: any, record: any) => (
        <>
          {record.frontPrintUrl !== null ? (
            <Link to={record.frontPrintUrl} target="_blank">
              <Image
                width={70}
                src={`${constants.API_FLASH_SHIP}/productImage/${record.frontPrintImage}`}
                preview={false}
                alt="Front image"
              />
            </Link>
          ) : (
            'Không có ảnh mặt trước'
          )}
        </>
      ),
    },
    {
      title: 'Back',
      dataIndex: 'back',
      key: 'back',
      align: 'center',
      render: (_: any, record: any) => (
        <>
          {record.backPrintUrl !== null ? (
            <Link to={record.backPrintUrl} target="_blank">
              <Image
                width={70}
                src={`${constants.API_FLASH_SHIP_IMAGE}${record.backPrintImage}`}
                preview={false}
                alt="Back image"
              />
            </Link>
          ) : (
            'Không có ảnh mặt sau'
          )}
        </>
      ),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      align: 'center',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      align: 'center',
      render: (text: string) => formatDate(text, 'DD/MM/YY hh:mm:ss'),
    },
  ];

  useEffect(() => {
    if (data) setDataTable([data]);
  }, [data]);

  return (
    <Table
      columns={columns as ColumnType<any>[]}
      dataSource={dataTableConvert}
      bordered
      pagination={false}
      id="flash-ship-table-order-view"
    />
  );
}

export default OrderCompleteFulfillmentDetail;
