import { Row, Col, Tooltip, Image } from "antd";

import PageTitle from "../../components/common/PageTitle";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const OrderDetail = () => {
  const location = useLocation();
  const { orderData } = location.state;
  console.log("orderData: ", orderData);
  // const orderData = {
  //   buyer_email: "v2b2V5@chat.seller.tiktok.com",
  //   buyer_message: "Please ship asap!",
  //   cancel_order_sla_time: 1619621355,
  //   cancel_reason: "Pricing error",
  //   cancel_time: 1678389618,
  //   cancellation_initiator: "SELLER",
  //   collection_due_time: 1678389618,
  //   collection_time: 1678389618,
  //   cpf: "3213-31231412",
  //   create_time: 1619611561,
  //   delivery_due_time: 1678389618,
  //   delivery_option_id: "7091146663229654785",
  //   delivery_option_name: "Express shipping",
  //   delivery_option_required_delivery_time: 1678389618,
  //   delivery_sla_time: 1678389618,
  //   delivery_time: 1678389618,
  //   fulfillment_type: "FULFILLMENT_BY_SELLER",
  //   has_updated_recipient_address: false,
  //   id: "576461413038785752",
  //   is_buyer_request_cancel: false,
  //   is_cod: false,
  //   is_on_hold_order: false,
  //   is_sample_order: false,
  //   line_items: [
  //     {
  //       cancel_reason: "Discount not as expected",
  //       cancel_user: "BUYER",
  //       currency: "IDR",
  //       display_status: "TO_SHIP",
  //       id: "577086512123755123",
  //       is_gift: false,
  //       item_tax: [
  //         {
  //           tax_amount: "21.2",
  //           tax_rate: "0.35",
  //           tax_type: "SALES_TAX",
  //         },
  //       ],
  //       original_price: "0.01",
  //       package_id: "1153132168123859123",
  //       package_status: "TO_FULFILL",
  //       platform_discount: "0",
  //       product_id: "1729582718312380123",
  //       product_name: "Women's Winter Crochet Clothes",
  //       retail_delivery_fee: "1.28",
  //       rts_time: 1678389618,
  //       sale_price: "0.01",
  //       seller_discount: "0",
  //       seller_sku: "red_iphone_256",
  //       shipping_provider_id: "6617675021119438849",
  //       shipping_provider_name: "TT Virtual express",
  //       sku_id: "2729382476852921560",
  //       sku_image:
  //         "https://p16-oec-va.itexeitg.com/tos-maliva-d-o5syd03w52-us/46123e87d14f40b69b839",
  //       sku_name: "Iphone",
  //       sku_type: "PRE_ORDER",
  //       small_order_fee: "5000",
  //       tracking_number: "JX12345",
  //     },
  //   ],
  //   need_upload_invoice: "NEED_INVOICE",
  //   packages: [
  //     {
  //       id: "1152321127278713123",
  //     },
  //   ],
  //   paid_time: 1619611563,
  //   payment: {
  //     currency: "IDR",
  //     original_shipping_fee: "5000",
  //     original_total_product_price: "5000",
  //     platform_discount: "5000",
  //     product_tax: "21.3",
  //     retail_delivery_fee: "1.28",
  //     seller_discount: "5000",
  //     shipping_fee: "5000",
  //     shipping_fee_platform_discount: "5000",
  //     shipping_fee_seller_discount: "5000",
  //     shipping_fee_tax: "11",
  //     small_order_fee: "3000",
  //     sub_total: "5000",
  //     tax: "5000",
  //     total_amount: "5000",
  //   },
  //   payment_method_name: "CCDC",
  //   recipient_address: {
  //     address_detail: "Unit one building 8",
  //     address_line1: "TikTok 5800 bristol Pkwy",
  //     address_line2: "Suite 100",
  //     address_line3: '""',
  //     address_line4: '""',
  //     delivery_preferences: {
  //       drop_off_location: "Front Door",
  //     },
  //     district_info: [
  //       {
  //         address_level_name: "Country",
  //         address_name: "United Kingdom",
  //       },
  //     ],
  //     full_address: "1199 Coleman Ave San Jose, CA 95110",
  //     name: "Zay",
  //     phone_number: "(+1)213-***-1234",
  //     postal_code: "95110",
  //     region_code: "US",
  //   },
  //   request_cancel_time: 1678389618,
  //   rts_sla_time: 1619611688,
  //   rts_time: 1619611563,
  //   seller_note: "seller note",
  //   shipping_due_time: 1678389618,
  //   shipping_provider: "TT Virtual express",
  //   shipping_provider_id: "6617675021119438849",
  //   shipping_type: "TIKTOK",
  //   split_or_combine_tag: "COMBINED",
  //   status: "UNPAID",
  //   tracking_number: "JX12345",
  //   tts_sla_time: 1619611761,
  //   update_time: 1619621355,
  //   user_id: "7021436810468230477",
  //   warehouse_id: "6955005333819123123",
  // };

  const renderInfoShipping = () => {
    const {
      create_time,
      delivery_option,
      warehouse_id,
      paid_time,
      rts_sla,
      rts_time,
    } = orderData;
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
              <p className="">
                {dayjs(paid_time).format("MMM DD, YYYY hh:mm:ss A")}
              </p>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Ship order by</p>
              <p className="">
                {dayjs(rts_sla).format("MMM DD, YYYY hh:mm:ss A")}
              </p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Late dispatch after</p>
              <p className="">
                {dayjs(rts_time).format("MMM DD, YYYY hh:mm:ss A")}
              </p>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <p className=" text-gray-500">Auto-cancel date</p>
              <p className="">
                {dayjs(rts_time).format("MMM DD, YYYY hh:mm:ss A")}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderPackageInfo = (orderData) => {
    const renderListItemProduct = (record) => {
      const { item_list } = record;
      return item_list.map((item, index) => {
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
                  <Tooltip title={item.product_name}>
                    <p className="font-semibold line-clamp-1">
                      {item.product_name}
                    </p>
                  </Tooltip>
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

    const orderData = [
        {
            label: 'Mã đơn hàng:',
            key: 'id',
            value: ordersData.id
        },
        {
            label: 'Thời gian đặt hàng:',
            key: 'create_time',
            value: ordersData.create_time
        },
        {
            label: 'Trạng thái:',
            key: 'status',
            value: ordersData.status
        }

    ]

    const customerData = [
        {
            label: 'Mã khách hàng:',
            key: 'user_id',
            value: ordersData.user_id
        },
        {
            label: 'Địa chỉ email:',
            key: 'buyer_email',
            value: ordersData.buyer_email
        },
        {
            label: 'Lời nhắn:',
            key: 'buyer_message',
            value: ordersData.buyer_message
        }
    ]

    const shippingData = [
        {
            label: 'Mã vận đơn:',
            key: 'delivery_option_id',
            value: ordersData.delivery_option_id
        },
        {
            label: 'Tên người nhận',
            key: 'name',
            value: ordersData.recipient_address.name
        },
        {
            label: 'Số điện thoại người nhận',
            key: 'phone_number',
            value: ordersData.recipient_address.phone_number
        },
        {
            label: 'Thời gian giao hàng',
            key: 'delivery_due_time',
            value: formatDate(ordersData.delivery_due_time, 'DD/MM/YY, hh:mm:ss')
        },
        {
            label: 'Đơn vị vận chuyển:',
            key: 'delivery_option_name',
            value: ordersData.delivery_option_name
        },
        {
            label: 'Địa chỉ nhận hàng',
            key: 'recipient_address',
            value: ordersData.recipient_address
        },
        {
            label: 'Mã bưu điện',
            key: 'postal_code',
            value: ordersData.recipient_address.postal_code
        },
        {
            label: 'Ghi chú',
            key: 'postal_code',
            value: ordersData.recipient_address.delivery_preferences?.drop_off_location
        }           
    ]

    const paymentData = [
        {
            label: 'Phương thức thanh toán:',
            key: 'payment_method_name',
            value: ordersData.payment_method_name
        },
        {
            label: 'Thời gian trả',
            key: 'paid_time',
            value: formatDate(ordersData.payment.paid_time, 'DD/MM/YY, hh:mm:ss')
        },
        {
            label: 'Tổng đơn hàng: ',
            key: 'total_amount',
            value: IntlNumberFormat(ordersData.payment.currency, 'currency', 3, ordersData.payment.total_amount)
        }
    ]

    return (
      <div className="bg-white rounded-md p-5 w-[720px] flex flex-col gap-5">
        <div className="flex gap-1">
          <p className="text-gray-500">SKU ID:</p>
          <p>{orderData.package_list[0].package_id}</p>
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
          <p className="font-semibold text-gray-600">
            ${payment_info.sub_total}
          </p>
        </p>
        <p className="flex justify-between text-gray-500">
          <p className="max-w-[150px]">Shipping fee after discounts</p>
          <p className="font-semibold text-gray-600">
            ${payment_info.shipping_fee}
          </p>
        </p>
        <p className="flex justify-between text-gray-500">
          <p className="max-w-[150px]">Taxes</p>
          <p className="font-semibold text-gray-600">${payment_info.taxes}</p>
        </p>
        <p className="flex justify-between text-gray-500 items-center">
          <p className="max-w-[150px] text-[20px] text-black">Total</p>
          <p className="font-semibold text-gray-600 text-[18px]">
            ${payment_info.total_amount}
          </p>
        </p>
      </div>
    );
  };

  const renderCustomerInfo = () => {
    const {recipient_address, buyer_uid} = orderData;
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
        <span className="text-[20px] font-semibold">#{orderData.order_id}</span>

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
};

export default OrderDetail;
