import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Table, Tag, message } from 'antd';

import { useShopsOrder } from '../../store/ordersStore';
import { getPathByIndex } from '../../utils';

import SectionTitle from '../common/SectionTitle';

function OrdersLabel({ changeNextStep, toShipInfoData }) {
  const location = useLocation();
  const { shippingDoc } = location.state;
  const shopId = getPathByIndex(2);
  const [ordersCompleted, setOrderCompleted] = useState([]);
  const [labelSelected, setLabelSelected] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { uploadLabelToDriver, packageFulfillmentCompleted, loadingUpload } = useShopsOrder((state) => state);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Package ID',
      dataIndex: 'package_id',
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      render: (_, record) =>
        (
          <ul className="flex flex-wrap">
            {record.order_list.map((item) => (
              <Link to={`/shops/${shopId}/orders/${item.order_id}`} state={{ orderData: item }} className="font-medium mb-5 last:mb-0">
                <Tag color="blue">{item.order_id}</Tag>
              </Link>
            ))}
          </ul>
        )
    },
    {
      title: 'Label URL',
      dataIndex: 'label',
      render: (text) =>
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
    onChange: (_, selectedRows) => {
      setLabelSelected(selectedRows);
      if (selectedRows.length > 0) changeNextStep(true);
    },
    getCheckboxProps: (record) => {
      const disabledOrderCompleted = ordersCompleted.filter((item) => item.pack_id === record.package_id && item.package_status === true);

      return {
        disabled: record.label === null || disabledOrderCompleted.length > 0,
      };
    },
  };

  const handlePushToDriver = (data) => {
    const dataLabelProcess = {
      order_documents: data?.map((item) => ({
        package_id: item.package_id,
        doc_url: item.label,
      })),
    };

    const onSuccess = (res) => {
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Đã đẩy label lên Server thành công',
        });
      }
    };

    const onFail = (err) => messageApi.error(err);
    uploadLabelToDriver(dataLabelProcess, onSuccess, onFail);
  };

  useEffect(() => {
    handlePushToDriver(shippingDoc);
  }, [shippingDoc]);

  useEffect(() => {
    toShipInfoData(labelSelected);
    packageFulfillmentCompleted(
      shopId,
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
