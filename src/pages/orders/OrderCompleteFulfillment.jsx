import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Tooltip, Popconfirm, Modal, Form, Input, message, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

import { getPathByIndex } from '../../utils';
import { getTokenKey, setToken } from '../../utils/auth';
import { useShopsOrder } from '../../store/ordersStore';
import { useFlashShipStores } from '../../store/flashShipStores';
import SectionTitle from '../../components/common/SectionTitle';
import OrderCompleteFulfillmentDetail from '../../components/orders/OrderCompleteFulfillmentDetail';
import OrderCompleteFulfillmentReject from '../../components/orders/OrderCompleteFulfillmentReject';

function OrderCompleteFulfillment() {
  const shopId = getPathByIndex(2);
  const flashShipToken = getTokenKey('flash-ship-tk');
  const [messageApi, contextHolder] = message.useMessage();
  const [dataPackage, setDataPackage] = useState([]);
  const [dataOrderDetail, setDataOrderDetail] = useState([]);
  const [rejectOrderNote, setRejectOrderNote] = useState("");
  const [rejectOrder, setRejectOrder] = useState({});
  const [openLoginFlashShip, setOpenLoginFlashShip] = useState(false);
  const [openFlashShipDetail, setOpenFlashShipDetail] = useState(false);
  const [openFlashShipReject, setOpenFlashShipReject] = useState(false);
  const { packageFulfillmentCompleted, packageFulfillmentCompletedInActive, getAllOrders, orders } = useShopsOrder((state) => state);
  const { LoginFlashShip, detailOrderFlashShip, cancelOrderFlashShip } = useFlashShipStores((state) => state);

  const dataTableFlashShip = dataPackage.filter((item) => item.fulfillment_name === 'FlashShip');
  const dataTablePrintCare = dataPackage.filter((item) => item.fulfillment_name === 'PrintCare');
  const ConvertDataTable = (data) => {
    const result = data.reverse().map((item, index) => ({
      stt: index + 1,
      ...item,
    }));

    return result;
  };

  const handleOrderPackage = (index) => {
    const orderPackageFlashShip = dataTableFlashShip[index]
    const orderList = orders.flatMap((order) => order.data.order_list);
    const orderListHasPackageId = orderList.filter((order) => order.package_list.length);
    const packageOrders = orderListHasPackageId.filter((order) => order.package_list[0].package_id === orderPackageFlashShip.pack_id.toString());

    return (
      <ul className="flex flex-wrap">
        {packageOrders.map((item) => (
          <li key={item.order_id} className="mb-4">
            <Link to={`/shops/${shopId}/orders/${item.order_id}`} state={{ orderData: item }} className="font-medium">
              <Tag color="blue">{orderPackageFlashShip.order_id}</Tag>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const handleLoginFlashShip = (values) => {
    const onSuccess = (res) => {
      if (res) {
        setToken('flash-ship-tk', res.data.access_token);
        setOpenLoginFlashShip(false);
        messageApi.open({
          type: 'success',
          content: `Đăng nhập thành công`,
        });
        setOpenFlashShipDetail(true)
      }
    };

    const onFail = (err) => {
      messageApi.open({
        type: 'error',
        content: `Đăng nhập thất bại. Vui lòng thử lại. ${err}`,
      });
    };
    LoginFlashShip(values, onSuccess, onFail);
  };

  const handleDetailFlashShip = (orderCode) => {
    if (flashShipToken === null) {
      setOpenLoginFlashShip(true);
    }

    const onSuccess = (res) => {
      setOpenFlashShipDetail(true)
      setDataOrderDetail(res)
    };

    const onFail = (err) => {
      console.log(err);
    };
    detailOrderFlashShip(orderCode, onSuccess, onFail);
  };

  const handleCancelOrderFlashShipAPI = () => {
    const data = {
      orderCodeList: [rejectOrderNote.orderCode],
      rejectNote: rejectOrderNote.note,
    };

    const onSuccess = (res) => {
      if (res.data !== null) {
        messageApi.open({
          type: 'success',
          content: `Đã huỷ đơn ${rejectOrderNote.orderCode} (${rejectOrderNote.orderId})`,
        });
        packageFulfillmentCompletedInActive(rejectOrderNote.packageId, {package_status : false})
      } else {
        messageApi.open({
          type: 'error',
          content: res.err,
        });
      }
    }

    cancelOrderFlashShip(
      data,
      onSuccess,
      () => {},
    );
  }

  const handleRejectOrderNote = (note) => {
    setRejectOrderNote(note);
    setOpenFlashShipReject(false);
    handleCancelOrderFlashShipAPI()
  }

  const handleCancelOrderFlashShip = (orderCode, orderId, packageId) => {
    if (flashShipToken === null) {
      setOpenLoginFlashShip(true);
    } else {
      setOpenFlashShipReject(true)
      setRejectOrder({orderCode, orderId, packageId})
    }
  };

  const generateColumns = (showActionsColumn) => {
    const columns = [
      {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
      },
      {
        title: 'Order code',
        dataIndex: 'order_code',
        key: 'order_code'
      },
      {
        title: 'Order Id',
        dataIndex: 'order_id',
        key: 'order_id',
        render: (_, record, index) => handleOrderPackage(index),
      },
      {
        title: 'Package Id',
        dataIndex: 'pack_id',
        key: 'pack_id'
      },
      {
        title: 'Product items',
        dataIndex: 'products',
        key: 'products',
        render: (_, record) => <p>{record?.products?.length} Sản phẩm</p>,
      },
      {
        title: 'Label',
        dataIndex: 'linkLabel',
        key: 'linkLabel',
        width: '100px',
        render: (text) => (
          <div className="max-w-[200px] line-clamp-3">
            <Link to={text} target="_blank">
              {text}
            </Link>
          </div>
        ),
      },
      {
        title: 'Shipping information',
        dataIndex: 'shipping_info',
        key: 'shipping_info',
        render: (_, record) => (
          <ul>
            <li className="flex flex-wrap">
              <span className="min-w-[70px] font-bold mr-1">Buyer name:</span>
              <span className="flex-1">
                {record.buyer_first_name} {record.buyer_last_name}
              </span>
            </li>
            <li className="flex flex-wrap">
              <span className="min-w-[70px] font-bold mr-1">Buyer email:</span>
              <Link to={`mailto:${record.buyer_email}`} className="flex-1">
                {record.buyer_email}
              </Link>
            </li>
            <li className="flex flex-wrap">
              <span className="min-w-[70px] font-bold mr-1">Address:</span>
              <span className="flex-1">{record.buyer_address1}</span>
            </li>
            <li className="flex flex-wrap">
              <span className="min-w-[70px] font-bold mr-1">City:</span>
              <span className="flex-1">{record.buyer_city}</span>
            </li>
            <li className="flex flex-wrap">
              <span className="min-w-[70px] font-bold mr-1">State:</span>
              <span className="flex-1">{record.buyer_province_code}</span>
            </li>
            <li className="flex flex-wrap">
              <span className="min-w-[70px] font-bold mr-1">Country:</span>
              <span className="flex-1">{record.buyer_country_code}</span>
            </li>
            <li className="flex flex-wrap">
              <span className="min-w-[70px] font-bold mr-1">Zip code:</span>
              <span className="flex-1">{record.buyer_zip}</span>
            </li>
          </ul>
        ),
      },
    ];

    if (showActionsColumn) {
      columns.push({
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        align: 'center',
        render: (_, record) => (
          <div className="flex gap-2 justify-center">
            <Tooltip title="Xem chi tiết" color="blue">
              <Button size="small" icon={<EyeOutlined />} onClick={() => handleDetailFlashShip(record.order_code)} />
            </Tooltip>
            <Tooltip title="Huỷ đơn" color="red">
              <Button size="small" icon={<DeleteOutlined />} danger onClick={() => handleCancelOrderFlashShip(record.order_code, record.order_id, record.pack_id)} />
            </Tooltip>
          </div>
        ),
      });
    }

    return columns;
  };

  useEffect(() => {
    const onSuccess = (res) => {
      setDataPackage(res);
    };

    const onFail = (err) => {
      console.log(err);
    };

    packageFulfillmentCompleted(shopId, onSuccess, onFail);
    getAllOrders(shopId);
  }, []);

  const titleModalOrderFlashShipDetail = (
    <>
      Order {dataOrderDetail.orderCode} ({dataOrderDetail.partnerOrderId}) List Items{' '}
      <Tag color={dataOrderDetail.status?.includes('REJECT') ? '#f46a6a' : '#008000'}>{dataOrderDetail.status}</Tag>
    </>
  );

  return (
    <div className="p-10">
      {contextHolder}
      <div>
        <SectionTitle
          title="Orders that have been Fulfillment completed and sent to FlashShip"
          count={dataTableFlashShip.length ? dataTableFlashShip.length : '0'}
        />
        <Table columns={generateColumns(true)} dataSource={ConvertDataTable(dataTableFlashShip)} bordered />
      </div>

      <div className="mt-10">
        <SectionTitle
          title="Orders that have been Fulfillment completed and sent to PrintCare"
          count={dataTablePrintCare.length ? dataTablePrintCare.length : '0'}
        />
        <Table columns={generateColumns(false)} dataSource={ConvertDataTable(dataTablePrintCare)} bordered />
      </div>

      <Modal
        title="FlashShip Login"
        open={openLoginFlashShip}
        onCancel={() => setOpenLoginFlashShip(false)}
        footer={false}
      >
        <Form onFinish={handleLoginFlashShip}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={titleModalOrderFlashShipDetail}
        centered
        open={openFlashShipDetail}
        onCancel={() => setOpenFlashShipDetail(false)}
        footer={false}
        width={1000}
      >
        <OrderCompleteFulfillmentDetail data={dataOrderDetail}/>
      </Modal>

      <Modal
        title="Reject Order"
        centered
        open={openFlashShipReject}
        onCancel={() => setOpenFlashShipReject(false)}
        footer={false}
        width={1000}
      >
        <OrderCompleteFulfillmentReject rejectOrderNoteData={handleRejectOrderNote} data={rejectOrder} />
      </Modal>
    </div>
  );
}

export default OrderCompleteFulfillment;