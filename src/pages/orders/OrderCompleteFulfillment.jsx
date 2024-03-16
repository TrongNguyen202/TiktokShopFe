import { useEffect, useState } from 'react';
import { Table } from 'antd';

import { Link } from 'react-router-dom';
import { useShopsOrder } from '../../store/ordersStore';
import { getPathByIndex } from '../../utils';
import SectionTitle from '../../components/common/SectionTitle';

function OrderCompleteFulfillment() {
  const shopId = getPathByIndex(2);
  const [dataPackage, setDataPackage] = useState([]);
  const { packageFulfillmentCompleted, getAllOrders, orders } = useShopsOrder((state) => state);

  const dataTableFlashShip = dataPackage.filter((item) => item.fulfillment_name === 'FlashShip');
  const dataTablePrintCare = dataPackage.filter((item) => item.fulfillment_name === 'PrintCare');
  const ConvertDataTable = (data) => {
    return data.map((item, index) => ({
      stt: index + 1,
      ...item,
    }));
  };

  const handleOrderPackage = (packageId) => {
    const orderList = orders.flatMap((order) => order.data.order_list);
    const orderListHasPackageId = orderList.filter((order) => order.package_list.length);
    const packageOrders = orderListHasPackageId.filter((order) => order.package_list[0].package_id === packageId);

    return (
      <ul>
        {packageOrders.map((item) => (
          <li key={item.order_id} className="mb-4">
            <Link to={`/shops/${shopId}/orders/${item.order_id}`} state={{ orderData: item }} className="font-medium">
              {item.order_id}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Package Id',
      dataIndex: 'package_id',
      key: 'package_id',
      render: (_, record) => record.order_id,
    },
    {
      title: 'Order Id',
      dataIndex: 'order_id',
      key: 'order_id',
      render: (text) => handleOrderPackage(text),
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

  console.log('FlashShip: ', ConvertDataTable(dataTableFlashShip));

  return (
    <div className="p-10">
      <div>
        <SectionTitle
          title="Orders that have been Fulfillment completed and sent to FlashShip"
          count={dataTableFlashShip.length ? dataTableFlashShip.length : '0'}
        />
        <Table columns={columns} dataSource={ConvertDataTable(dataTableFlashShip)} bordered />
      </div>

      <div className="mt-10">
        <SectionTitle
          title="Orders that have been Fulfillment completed and sent to PrintCare"
          count={dataTablePrintCare.length ? dataTablePrintCare.length : '0'}
        />
        <Table columns={columns} dataSource={ConvertDataTable(dataTablePrintCare)} bordered />
      </div>
    </div>
  );
}

export default OrderCompleteFulfillment;
