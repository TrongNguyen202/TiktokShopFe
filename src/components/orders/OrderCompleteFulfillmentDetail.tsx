import { Table, Image, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/date';
import React from 'react';

import { constants } from '../../constants';

function OrderCompleteFulfillmentDetail({ data }) {
  const [dataTable, setDataTable] = useState([]);
  const dataTableConvert = dataTable
    .map((item) => {
      return item.products.map((product) => ({
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
      render: (_, record) => (
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
      render: (_, record) => (
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
      render: (_, record) => (
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
      render: (text) => formatDate(text, 'DD/MM/YY hh:mm:ss'),
    },
  ];

  useEffect(() => {
    if (data) setDataTable([data]);
  }, [data]);

  return (
    <Table
      columns={columns}
      dataSource={dataTableConvert}
      bordered
      pagination={false}
      id="flash-ship-table-order-view"
    />
  );
}

export default OrderCompleteFulfillmentDetail;
