import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Space, Table, Tag } from 'antd';

import { getPathByIndex } from '../../utils';
import { formatDate } from '../../utils/date'
import { useShopsOrder } from '../../store/ordersStore'
import { statusOrder } from '../../constants/index'

import Loading from '../../components/loading/Index';

const Orders = () => {
    const shopId = getPathByIndex(2)
    const { orders, getAllOrders, loading } = useShopsOrder((state) => state)

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Link to={`/shops/${shopId}/orders/${text}`}>{text}</Link>
        },
        {
            title: 'Thời gian đặt hàng',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (text) => <span>{formatDate(text, 'DD/MM/YY hh:mm:ss')}</span>,
        },
        {
            title: 'Đơn vị vận chuyển',
            dataIndex: 'shipping_provider',
            key: 'shipping_provider'
        },
        {
            title: 'Mã vận chuyển',
            dataIndex: 'tracking_number',
            key: 'tracking_number'
        },
        {
            title: 'Thời gian giao hàng',
            dataIndex: 'delivery_time',
            key: 'delivery_time',
            render: (text) => <span>{formatDate(text, 'DD/MM/YY hh:mm:ss')}</span>,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'payment_method_name',
            key: 'payment_method_name'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <>
                    {statusOrder.map((item, index) => (
                        <>{item.title === text && <Tag key={index} color={item.color}>{text}</Tag>}</>
                    ))}
                </>
            )
        }
    ]

    useEffect(() => {
        const onSuccess = (res) => {
            console.log(res)
        }

        const onFail = (res) => {
            alerts.error(res)
        }
        getAllOrders(shopId, onSuccess, onFail)
    }, [])

    const ordersData = [
        {
          "buyer_email": "v2b2V5@chat.seller.tiktok.com",
          "buyer_message": "Please ship asap!",
          "cancel_order_sla_time": 1619621355,
          "cancel_reason": "Pricing error",
          "cancel_time": 1678389618,
          "cancellation_initiator": "SELLER",
          "collection_due_time": 1678389618,
          "collection_time": 1678389618,
          "cpf": "3213-31231412",
          "create_time": 1619611561,
          "delivery_due_time": 1678389618,
          "delivery_option_id": "7091146663229654785",
          "delivery_option_name": "Express shipping",
          "delivery_option_required_delivery_time": 1678389618,
          "delivery_sla_time": 1678389618,
          "delivery_time": 1678389618,
          "fulfillment_type": "FULFILLMENT_BY_SELLER",
          "has_updated_recipient_address": false,
          "id": "576461413038785752",
          "is_buyer_request_cancel": false,
          "is_cod": false,
          "is_on_hold_order": false,
          "is_sample_order": false,
          "line_items": [
            {
              "cancel_reason": "Discount not as expected",
              "cancel_user": "BUYER",
              "currency": "IDR",
              "display_status": "TO_SHIP",
              "id": "577086512123755123",
              "is_gift": false,
              "item_tax": [
                {
                  "tax_amount": "21.2",
                  "tax_rate": "0.35",
                  "tax_type": "SALES_TAX"
                }
              ],
              "original_price": "0.01",
              "package_id": "1153132168123859123",
              "package_status": "TO_FULFILL",
              "platform_discount": "0",
              "product_id": "1729582718312380123",
              "product_name": "Women's Winter Crochet Clothes",
              "retail_delivery_fee": "1.28",
              "rts_time": 1678389618,
              "sale_price": "0.01",
              "seller_discount": "0",
              "seller_sku": "red_iphone_256",
              "shipping_provider_id": "6617675021119438849",
              "shipping_provider_name": "TT Virtual express",
              "sku_id": "2729382476852921560",
              "sku_image": "https://p16-oec-va.itexeitg.com/tos-maliva-d-o5syd03w52-us/46123e87d14f40b69b839",
              "sku_name": "Iphone",
              "sku_type": "PRE_ORDER",
              "small_order_fee": "5000",
              "tracking_number": "JX12345"
            }
          ],
          "need_upload_invoice": "NEED_INVOICE",
          "packages": [
            {
              "id": "1152321127278713123"
            }
          ],
          "paid_time": 1619611563,
          "payment": {
            "currency": "IDR",
            "original_shipping_fee": "5000",
            "original_total_product_price": "5000",
            "platform_discount": "5000",
            "product_tax": "21.3",
            "retail_delivery_fee": "1.28",
            "seller_discount": "5000",
            "shipping_fee": "5000",
            "shipping_fee_platform_discount": "5000",
            "shipping_fee_seller_discount": "5000",
            "shipping_fee_tax": "11",
            "small_order_fee": "3000",
            "sub_total": "5000",
            "tax": "5000",
            "total_amount": "5000"
          },
          "payment_method_name": "CCDC",
          "recipient_address": {
            "address_detail": "Unit one building 8",
            "address_line1": "TikTok 5800 bristol Pkwy",
            "address_line2": "Suite 100",
            "address_line3": "\"\"",
            "address_line4": "\"\"",
            "delivery_preferences": {
              "drop_off_location": "Front Door"
            },
            "district_info": [
              {
                "address_level_name": "Country",
                "address_name": "United Kingdom"
              }
            ],
            "full_address": "1199 Coleman Ave San Jose, CA 95110",
            "name": "Zay",
            "phone_number": "(+1)213-***-1234",
            "postal_code": "95110",
            "region_code": "US"
          },
          "request_cancel_time": 1678389618,
          "rts_sla_time": 1619611688,
          "rts_time": 1619611563,
          "seller_note": "seller note",
          "shipping_due_time": 1678389618,
          "shipping_provider": "TT Virtual express",
          "shipping_provider_id": "6617675021119438849",
          "shipping_type": "TIKTOK",
          "split_or_combine_tag": "COMBINED",
          "status": "UNPAID",
          "tracking_number": "JX12345",
          "tts_sla_time": 1619611761,
          "update_time": 1619621355,
          "user_id": "7021436810468230477",
          "warehouse_id": "6955005333819123123"
        }
    ]

    if(loading) return <Loading/>
    return (
        <div className="p-10">
            <Table columns={columns} dataSource={ordersData} />
        </div>
    );
}
 
export default Orders;