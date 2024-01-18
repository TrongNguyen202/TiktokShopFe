import { Row, Col, Card, List, Tag } from 'antd'

import { statusOrder } from '../../constants'
import { formatDate } from '../../utils/date'
import { IntlNumberFormat } from '../../utils'

import PageTitle from "../../components/common/PageTitle";
import { Link } from 'react-router-dom';

const OrderDetail = () => {
    const ordersData = {
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
        <div className='p-10'>
            <PageTitle title='Chi tiết đơn hàng' showBack/>
            <Row gutter={[30, 30]}>
                <Col span={12}>
                    <Card title="Thông tin đơn hàng" className='cursor-pointer hover:shadow-md'>
                        <List
                            itemLayout="horizontal"
                            dataSource={orderData}
                            renderItem={(item, index) => (
                                <List.Item key={index} className='hover:bg-[#e6f4ff]'>
                                    <span>{item.label}</span>
                                    {item.key !== 'status' && <span>{item.value}</span>}
                                    {item.key === 'status' && statusOrder.map((statusItem, StatusIndex) => (
                                        <>{statusItem.title === item.value && <Tag key={StatusIndex} color={statusItem.color}>{item.value}</Tag>}</>
                                    ))}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Thông tin khách hàng" className='cursor-pointer hover:shadow-md'>
                        <List
                            itemLayout="horizontal"
                            dataSource={customerData}
                            renderItem={(item, index) => (
                                <List.Item key={index} className='hover:bg-[#e6f4ff]'>
                                    <span>{item.label}</span>
                                    {item.key === 'buyer_email' && <Link to={`mailto: ${item.value}`}>{item.value}</Link>}
                                    {item.key !== 'buyer_email' && <span>{item.value}</span>}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Thông tin vận chuyển" className='cursor-pointer hover:shadow-md'>
                        <List
                            itemLayout="horizontal"
                            dataSource={shippingData}
                            renderItem={(item, index) => (
                                <List.Item key={index} className='hover:bg-[#e6f4ff]'>
                                    <span>{item.label}</span>
                                    {item.key !== 'recipient_address' && <span>{item.value}</span>}
                                    {item.key === 'recipient_address' && 
                                        <div>
                                            {item.value.address_detail && <span>{item.value.address_detail}, &nbsp;</span>}
                                            {item.value.address_line1 && <span>{item.value.address_line1}, &nbsp;</span>}
                                            {item.value.address_line2 && <span>{item.value.address_line2}, &nbsp;</span>}
                                            {item.value.address_line3 && <span>{item.value.address_line3}, &nbsp;</span>}
                                            {item.value.address_line4 && <span>{item.value.address_line4}, &nbsp;</span>}
                                            <span>{item.value?.district_info[0].address_name}</span>
                                        </div>
                                    }
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Thông tin thanh toán" className='cursor-pointer hover:shadow-md'>
                        <List
                            itemLayout="horizontal"
                            dataSource={paymentData}
                            renderItem={(item, index) => (
                                <List.Item key={index} className='hover:bg-[#e6f4ff]'>
                                    <span>{item.label}</span>
                                    <span>{item.value}</span>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
 
export default OrderDetail;