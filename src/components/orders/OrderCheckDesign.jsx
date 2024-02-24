import { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Tag } from 'antd'

import { useGoogleStore } from '../../store/googleSheets'
import { signInWithGoogle } from '../../Firebase'
import { IntlNumberFormat } from '../../utils'
import { statusOrder } from '../../constants'

import PageTitle from "../../components/common/PageTitle";
import OrdersAddNewDesignData from '../../components/orders/OrdersAddNewDesignData';
import OrdersAddImageDesignByExcel from '../../components/orders/OrdersAddImageDesignByExcel';
import SectionTitle from '../common/SectionTitle';
import OrderProductProver from './OrderProductProver';

const OrderCheckDesign = ({ toShipInfoData, sheetData }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [stepCheckDesign, setStepCheckDesign] = useState(1)
    const [newDesignData, setNewDesignData] = useState([])
    const [hasAddDesign, setHasAddDesign] = useState(false)
    const [hasNewDesignData, setHasNewDesignData] = useState(false)
    const { AddRowToSheet } = useGoogleStore()

    const toShipInfoDataConvert = toShipInfoData.reduce((acc, item) => {
            const rows = item.data?.order_list[0].item_list?.map((subItem, index) => ({
              ...subItem,
              order_id: item.data.order_list[0].order_id,
              linkLabel: item.linkLabel,
              city: item.city,
              name_buyer: item.name_buyer,
              state: item.state,
              street: item.street.replace(' - ', ''),
              tracking_id: item.tracking_id,
              zip_code: item.zip_code,
              payment_info: item.data.order_list[0].payment_info
            }));
        if (!rows) return acc;
            return [...acc, ...rows];
        }, []);


    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
            render: (_, record, index) => index + 1
        },
        {
            title: 'Order ID',
            dataIndex: 'order_id',
            render: (_, record) => record.data.order_list[0].order_id
        },
        {
            title: 'Tracking ID',
            dataIndex: 'tracking_id'
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'product_item',
            width: 200,
            render: (_, record) => (
                <OrderProductProver data={record} />
            ),
        },
        {
            title: 'Người mua',
            dataIndex: 'name_buyer'
        },       
        {
            title: 'Địa chỉ nhận hàng',
            dataIndex: 'shipping_address',
            render: (_, record) => `${record.street.replace(' - ', '')}, ${record.city}, ${record.state}, ${record.zip_code}`,
        },
        {
            title: 'Tình trạng',
            dataIndex: 'order_status',
            render: (_, record) => statusOrder.map(item => item.value === record.data.order_list[0].order_status && <Tag color={item.color}>{item.title}</Tag>),
        },
        {
            title: 'Tổng giá',
            dataIndex: "sub_total",
            align: 'center',
            render: (_, record) => IntlNumberFormat(record.data.order_list[0].payment_info.currency, 'currency', 4, record.data.order_list[0].payment_info.sub_total)
        }
    ]

    const handleCheckDesign = async() => {
        const designData = sheetData?.values?.slice(2)
        const designDataAppend = []
        const designSkuIdObject = {}

        designData?.forEach((item, index) => {
            designSkuIdObject[index] = item[0];
        })

        const designNewId = toShipInfoData.map(item => (
            item.data?.order_list[0].item_list.map(sku => sku.sku_id)
        )).flat()
        
        designNewId.forEach(item => {
            if (!Object.values(designSkuIdObject).includes(item)) {
                messageApi.open({
                    type: 'success',
                    content: `${item} là mẫu mới. Hãy thêm mẫu mới vào Google Sheet`,
                });
                const newIndex = Object.keys(designDataAppend).length.toString()
                const newItem = toShipInfoDataConvert?.find(itemFind => itemFind.sku_id === item)
                
                designDataAppend[newIndex] = [
                    newItem.sku_id, newItem.product_name, newItem.sku_name, "", "", newItem.quantity
                ]
                setNewDesignData(designDataAppend)
                setHasAddDesign(true)
            } else {
                messageApi.open({
                    type: 'error',
                    content: `Mẫu ${item} này đã tồn tại`,
                });
            }
        });
    }

    const handleAddDesign = async () => {
        let oauthAccessToken = localStorage.getItem('oauthAccessToken')
        if (!oauthAccessToken) {
          const response = await signInWithGoogle();
          localStorage.setItem('oauthAccessToken', response._tokenResponse.oauthAccessToken)
          oauthAccessToken = response._tokenResponse.oauthAccessToken
        }
        const dataAddRowToSheet = {
            values: newDesignData
        }

        if (oauthAccessToken) {
            const onSuccess = (res) => {
                if (res) {
                    messageApi.open({
                        type: 'success',
                        content: `Đã thêm mẫu mới vào Google Sheet. Vui lòng kiểm tra lại`,
                    });
                    setHasNewDesignData(true)
                }
            }
            const onFail = () => { }
            AddRowToSheet('Team Truong', dataAddRowToSheet, oauthAccessToken, onSuccess, onFail)            
        }
    }

    const checkDataTable = () => {
        if (toShipInfoData.length == 0) {
            return []
        }
        let data = []
        toShipInfoData.forEach(item => {
            if (item?.data?.order_list) {
                data.push(item)
            }
        })
        return data
    }

    return (
        <div className="p-3 md:p-10">
            <SectionTitle title='Kiểm tra và thêm mẫu' />
            <div>
                {stepCheckDesign === 1 && <Button type="primary" className='mb-3' onClick={handleCheckDesign}>Kiểm tra mẫu trên Google Sheet</Button>}
                {hasAddDesign && 
                    <Tooltip placement="top" title='Dữ liệu không có Image 1 (front) và Image 2 (back)' className='ml-3'>
                        <Button type="primary" className='mb-3' onClick={handleAddDesign}>Thêm mẫu trực tiếp trên Google Sheet</Button>
                    </Tooltip>
                }
            </div>
            {hasNewDesignData && <OrdersAddImageDesignByExcel/>}
            {!hasAddDesign && <Table rowKey="order_id" scroll={{ x: true }} columns={columns} dataSource={checkDataTable().length ? checkDataTable() : []} bordered pagination={{ position: ['none'] }} />}
            {hasAddDesign && <OrdersAddNewDesignData dataColumns={newDesignData} /> }
            {contextHolder}
        </div>
    );
}
 
export default OrderCheckDesign;