import { Row, Col, Tooltip, Image } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import PageTitle from '../../components/common/PageTitle';
import { getPathByIndex } from '../../utils';

function OrderDetail() {
  const location = useLocation();
  const { orderData } = location.state;

  const renderInfoShipping = () => {
    const { create_time, delivery_option, warehouse_id, paid_time, rts_sla, rts_time } = orderData;
    return (
      <div className="bg-white rounded-md p-5 w-[720px] flex flex-col gap-5">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">location</p>
              <p className="">美国</p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Created time</p>
              <p className="">{create_time}</p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Delivery option type</p>
              <p className="">TikTok shipping</p>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Delivery option</p>
              <p className="">{delivery_option}</p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Order type</p>
              <p className="">Normal</p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Fulfilment type</p>
              <p className="">Fulfilment by seller</p>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Warehouse name</p>
              <p className="">TikTok Shop Sandbox US Local Sales warehouse</p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Warehouse ID</p>
              <p className="">{warehouse_id}</p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Prepare order by</p>
              <p className="">{dayjs(paid_time).format('MMM DD, YYYY hh:mm:ss A')}</p>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Ship order by</p>
              <p className="">{dayjs(rts_sla).format('MMM DD, YYYY hh:mm:ss A')}</p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Late dispatch after</p>
              <p className="">{dayjs(rts_time).format('MMM DD, YYYY hh:mm:ss A')}</p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Auto-cancel date</p>
              <p className="">{dayjs(rts_time).format('MMM DD, YYYY hh:mm:ss A')}</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderPackageInfo = (orderData) => {
    const renderListItemProduct = (record) => {
      const { item_list } = record;
      const shopId = getPathByIndex(2);
      return item_list.map((item) => {
        return (
          <div>
            <div className="flex justify-between items-center gap-3 mt-3 w-f7ull">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Image
                    src={item.sku_image}
                    className="w-[26px] h-[26px] object-cover mt-1 flex-1"
                    width={26}
                    height={26}
                  />
                </div>
                <div>
                  <Link to={`/shops/${shopId}/products/${item.product_id}`}>
                    <Tooltip title={item.product_name}>
                      <p className="font-semibold line-clamp-1">{item.product_name}</p>
                    </Tooltip>
                  </Link>
                  <p className="text-[12px] text-gray-500">{item.sku_name}</p>
                  <p className="text-[12px] text-gray-500">{item.seller_sku}</p>
                </div>
              </div>
              <p className="font-semibold">x{item.quantity}</p>
            </div>
          </div>
        );
      });
    };

    return (
      <div className="bg-white rounded-md p-5 w-[720px] flex flex-col gap-5">
        <div className="flex gap-1">
          <p className="text-gray-500">SKU ID:</p>
          <p>{orderData.package_list[0]?.package_id}</p>
        </div>
        <div>{renderListItemProduct(orderData)}</div>
      </div>
    );
  };

  const renderBuyerPaid = () => {
    const { payment_method_name, payment_info } = orderData;
    return (
      <div className="bg-white rounded-md p-5 w-[300px] flex flex-col gap-5">
        <p className="font-semibold text-[18px]">What your buyer paid</p>
        <p className="flex justify-between text-gray-500">
          <p className="max-w-[150px]">Payment method</p>
          <p className="font-semibold text-gray-600">{payment_method_name}</p>
        </p>
        <hr />
        <p className="flex justify-between text-gray-500">
          <p className="max-w-[150px]">Item(s) subtotal after discounts</p>
          <p className="font-semibold text-gray-600">${payment_info.sub_total}</p>
        </p>
        <p className="flex justify-between text-gray-500">
          <p className="max-w-[150px]">Shipping fee after discounts</p>
          <p className="font-semibold text-gray-600">${payment_info.shipping_fee}</p>
        </p>
        <p className="flex justify-between text-gray-500">
          <p className="max-w-[150px]">Taxes</p>
          <p className="font-semibold text-gray-600">${payment_info.taxes}</p>
        </p>
        <p className="flex justify-between text-gray-500 items-center">
          <p className="max-w-[150px] text-[20px] text-black">Total</p>
          <p className="font-semibold text-gray-600 text-[18px]">${payment_info.total_amount}</p>
        </p>
      </div>
    );
  };

  const renderCustomerInfo = () => {
    const { recipient_address, buyer_uid } = orderData;
    return (
      <div className="bg-white rounded-md p-5 w-[300px] flex flex-col gap-5">
        <p className="font-semibold text-[18px]">Customer info</p>
        <p className="flex justify-between text-gray-500">
          <p className="max-w-[150px]">Name</p>
          <p className="font-semibold text-gray-600">{buyer_uid}</p>
        </p>
        <hr />
        <p className="">
          <p className="max-w-[150px] text-gray-500 mb-2">Shipping address</p>
          <p className="font-semibold text-gray-800">
            <p>{recipient_address.name}</p>
            <p>{recipient_address.phone}</p>
            <p>{recipient_address.address_detail}</p>
            <p>{recipient_address.district}</p>
            <p>{recipient_address.zipcode}</p>
          </p>
        </p>
      </div>
    );
  };

  return (
    <div className="p-10 bg-[#F4F4F5] min-h-[calc(100vh-100px)]">
      <div className="max-w-[1100px] mx-auto">
        <PageTitle title="Chi tiết đơn hàng" showBack />
        <span className="text-[20px] font-semibold">#{orderData?.order_id}</span>

        <div className="mt-4 flex gap-3">
          <div className="flex gap-3 flex-col">
            {renderInfoShipping()}
            {renderPackageInfo(orderData)}
          </div>
          <div className="flex gap-3 flex-col">
            {renderBuyerPaid()}
            {renderCustomerInfo()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
