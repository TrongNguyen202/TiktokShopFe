import { useEffect, useState } from 'react';
import { useLocation, Link } from "react-router-dom"
import { Table, Button, message, Tooltip, Tag } from 'antd'

import { useGoogleStore } from '../../store/googleSheets'
import { signInWithGoogle } from '../../Firebase'
import { IntlNumberFormat } from '../../utils'
import { statusOrder } from '../../constants'

import PageTitle from "../../components/common/PageTitle";
import OrdersAddNewDesignData from '../../components/orders/OrdersAddNewDesignData';
import OrdersAddImageDesignByExcel from '../../components/orders/OrdersAddImageDesignByExcel';
import SectionTitle from '../common/SectionTitle';

const OrderCheckDesign = ({toShipInfoData}) => {
    const location = useLocation()
    // const { orders } = location.state
    const [messageApi, contextHolder] = message.useMessage();
    const [newDesignData, setNewDesignData] = useState([])
    const [hasAddDesign, setHasAddDesign] = useState(false)
    const [hasNewDesignData, setHasNewDesignData] = useState(false)
    const { getAllSheetInfo, sheets, AddRowToSheet } = useGoogleStore()

    // const dataSource = toShipInfoData.reduce((acc, item) => {
    //     const rows = item.d?.map((subItem, index) => ({
    //       ...subItem,
    //       order_id: index === 0 ? item.order_id : null,
    //       linkLabel: index === 0 ? item.linkLabel : null,
    //       rowSpan: index === 0 ? item.item_list.length : 0,
    //     }));
    //     return [...acc, ...rows];
    // }, []);

    // console.log('dataSource: ', dataSource);
    // console.log('sheets: ', sheets);

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

    const handleCheckOrderWithExcel = () => {
        const designData = sheets?.values?.slice(2)
        const designDataAppend = []
        const designSkuIdObject = {}
        designData?.forEach((item, index) => {
            designSkuIdObject[index] = item[0];
        });

        const designNewId = dataSource?.map(item => item.sku_id)
        designNewId.forEach(item => {
            if (!Object.values(designSkuIdObject).includes(item)) {
                messageApi.open({
                    type: 'success',
                    content: 'Có mẫu mới hãy thêm mẫu mới vào Google Sheet',
                });
                const newIndex = Object.keys(designDataAppend).length.toString()
                const newItem = dataSource?.find(itemFind => itemFind.sku_id === item)
                designDataAppend[newIndex] = [
                    newItem.sku_id, newItem.product_name, newItem.sku_name, "", "", newItem.quantity
                ]
                setNewDesignData(designDataAppend)
                setHasAddDesign(true)
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Mẫu này đã tồn tại',
                });
            }
        });
    }
    console.log('newDesignData: ', newDesignData);

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
                    setHasNewDesignData(true)
                }
            }
            const onFail = () => { }
            AddRowToSheet('Team Dang!A:F', dataAddRowToSheet, oauthAccessToken, onSuccess, onFail)            
        }
      }

    useEffect(() => {
        const onSuccess = (res) => {
            // console.log('res: ', res);
        }

        const onFail = (err) => {
            console.log(err);
        }
        getAllSheetInfo('Team Dang!A:F', onSuccess, onFail)
    }, [])

    return (
        <div className="p-10">
            <SectionTitle title='Kiểm tra và thêm mẫu' />
            <div>
                {!hasAddDesign && <Button type="primary" className='mb-3' onClick={handleCheckOrderWithExcel}>Kiếm tra mẫu trên Google Sheet</Button>}
                {hasAddDesign && 
                    <Tooltip placement="top" title='Dữ liệu không có Image 1 (front) và Image 2 (back)'>
                        <Button type="primary" className='mb-3' onClick={handleAddDesign}>Thêm mẫu trực tiếp trên Google Sheet</Button>
                    </Tooltip>
                }
            </div>
            {hasNewDesignData && <OrdersAddImageDesignByExcel/>}
            {!hasAddDesign && <Table rowKey="order_id" columns={columns} dataSource={toShipInfoData} bordered pagination={{ position: ['none'] }} /> }
            {hasAddDesign && <OrdersAddNewDesignData dataColumns={newDesignData} /> }
            {contextHolder}
        </div>
    );
}
 
export default OrderCheckDesign;