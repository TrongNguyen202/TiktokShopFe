import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Table, Tag, message } from 'antd';

import { ColumnType } from 'antd/es/table';
import { useShopsOrder } from '../../store/ordersStore';
import { getPathByIndex } from '../../utils';

import SectionTitle from '../common/SectionTitle';

type Column = ColumnType<Record<string, any>>;

type OrdersLabelProps = {
  changeNextStep: (value: boolean) => void;
  toShipInfoData: (data: any) => void;
};

function OrdersLabel({ changeNextStep, toShipInfoData }: OrdersLabelProps) {
  const location = useLocation();
  const { shippingDoc } = location.state;
  const shopId = getPathByIndex(2);
  const [ordersCompleted, setOrderCompleted] = useState([]);
  const [labelSelected, setLabelSelected] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { uploadLabelToDriver, packageFulfillmentCompleted, loadingUpload } = useShopsOrder((state) => state);

  const columns: Column[] = [
    {
      title: 'STT',
      dataIndex: 'stt',
      align: 'center',
      render: (_: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Package ID',
      dataIndex: 'package_id',
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      render: (_: any, record: any) => (
        <ul className="flex flex-wrap">
          {record.order_list.map((item: any) => (
            <Link
              to={`/shops/${shopId}/orders/${item.order_id}`}
              state={{ orderData: item }}
              className="font-medium mb-5 last:mb-0"
            >
              <Tag color="blue">{item.order_id}</Tag>
            </Link>
          ))}
        </ul>
      ),
    },
    {
      title: 'Label URL',
      dataIndex: 'label',
      render: (text: string) =>
        text ? (
          <Link to={text} target="_blank">
            {text}
          </Link>
        ) : (
          <Tag color="error">Không lấy được label</Tag>
        ),
    },
  ];

  const rowSelection = {
    onChange: (_: any, selectedRows: any) => {
      setLabelSelected(selectedRows);
      if (selectedRows.length > 0) changeNextStep(true);
    },
    getCheckboxProps: (record: Record<string, string>) => {
      const disabledOrderCompleted = ordersCompleted.filter(
        (item: any) => item.pack_id === record.package_id && item.package_status === true,
      );

      return {
        disabled: record.label === null || disabledOrderCompleted.length > 0,
      };
    },
  };

  const handlePushToDriver = (data: any) => {
    const dataLabelProcess = {
      order_documents: data?.map((item: any) => ({
        package_id: item.package_id,
        doc_url: item.label,
      })),
    };

    const onSuccess = (res: any) => {
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Đã đẩy label lên Server thành công',
        });
      }
    };

    const onFail = (err: any) => messageApi.error(err);
    uploadLabelToDriver(dataLabelProcess, onSuccess, onFail);
  };

  useEffect(() => {
    handlePushToDriver(shippingDoc);
  }, [shippingDoc]);

  useEffect(() => {
    toShipInfoData(labelSelected);
    packageFulfillmentCompleted(
      String(shopId),
      (res) => setOrderCompleted(res),
      () => {},
    );
  }, [labelSelected]);

  return (
    <div className="p-3 md:p-10">
      {contextHolder}
      <div className="mb-3 text-start">
        <SectionTitle title="Danh sách label" count={shippingDoc.length ? shippingDoc.length : '0'} />
        <p>
          <i>(Vui lòng tick vào ô để chọn những đơn hàng cần Fulfillment)</i>
        </p>
      </div>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        scroll={{ x: true }}
        columns={columns}
        dataSource={shippingDoc.reverse()}
        bordered
        pagination={false}
        loading={loadingUpload}
        rowKey={(record) => record.package_id}
      />
    </div>
  );
}

export default OrdersLabel;
