import { useEffect, useState } from 'react';
import { useLocation, Link } from "react-router-dom"
import { Table, Button, message, Tooltip } from 'antd'

import { useGoogleStore } from '../../store/googleSheets'
import { signInWithGoogle } from '../../Firebase'

import PageTitle from "../../components/common/PageTitle";
import OrdersAddNewDesignData from '../../components/orders/OrdersAddNewDesignData';
import OrdersAddImageDesignByExcel from '../../components/orders/OrdersAddImageDesignByExcel';

const OrderCheckDesign = () => {
    const location = useLocation()
    const { orders } = location.state
    const [messageApi, contextHolder] = message.useMessage();
    const [newDesignData, setNewDesignData] = useState([])
    const [hasAddDesign, setHasAddDesign] = useState(false)
    const [hasNewDesignData, setHasNewDesignData] = useState(false)
    const { getAllSheetInfo, sheets, AddRowToSheet } = useGoogleStore()

    const dataSource = orders.reduce((acc, item) => {
        const rows = item.item_list?.map((subItem, index) => ({
          ...subItem,
          order_id: index === 0 ? item.order_id : null,
          linkLabel: index === 0 ? item.linkLabel : null,
          rowSpan: index === 0 ? item.item_list.length : 0,
        }));
        return [...acc, ...rows];
    }, []);

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'order_id',
            key: 'order_id',
            onCell: (record) => ({
                rowSpan: record.rowSpan
            }),
        },
        {
            title: 'SKU ID',
            dataIndex: 'SKU ID',
            key: 'SKU ID',
            render: (_, record) => record.sku_id
        },
        {
            title: 'Product Name',
            dataIndex: 'Product Name',
            key: 'Product Name',
            render: (_, record) => record.product_name
        },
        {
            title: 'Variation',
            dataIndex: 'Variation',
            key: 'Variation',
            render: (_, record) => record.sku_name
        },
        {
            title: 'Quantity',
            dataIndex: 'Quantity',
            key: 'Quantity',
            align: 'center',
            render: (_, record) => record.quantity
        },
        {
            title: 'Label URL',
            dataIndex: 'linkLabel',
            key: 'linkLabel',
            render: (text) => <Link to={text} target='_blank' className='max-w-[200px] line-clamp-3'>{text}</Link>
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
            AddRowToSheet('Team Truong', dataAddRowToSheet, oauthAccessToken, onSuccess, onFail)            
        }
      }

    useEffect(() => {
        const onSuccess = (res) => {
            // console.log('res: ', res);
        }

        const onFail = (err) => {
            console.log(err);
        }
        getAllSheetInfo('Team Truong', onSuccess, onFail)
    }, [])

    return (
        <div className="p-3 md:p-10">
            <PageTitle title='Kiểm tra và thêm mẫu' showBack/>
            <div className='text-center'>
                {!hasAddDesign && <Button type="primary" className='mb-3' onClick={handleCheckOrderWithExcel}>Kiếm tra mẫu trên Google Sheet</Button>}
                {hasAddDesign && 
                    <Tooltip placement="top" title='Dữ liệu không có Image 1 (front) và Image 2 (back)'>
                        <Button type="primary" className='mb-3' onClick={handleAddDesign}>Thêm mẫu trực tiếp trên Google Sheet</Button>
                    </Tooltip>
                }
            </div>
            {hasNewDesignData && <OrdersAddImageDesignByExcel/>}
            {!hasAddDesign && <Table scroll={{ x: true }} rowKey="order_id" columns={columns} dataSource={dataSource} bordered pagination={{ position: ['none'] }} />}
            {hasAddDesign && <OrdersAddNewDesignData dataColumns={newDesignData} /> }
            {contextHolder}
        </div>
    );
}
 
export default OrderCheckDesign;