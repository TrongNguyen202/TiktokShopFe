import { useEffect, useState } from 'react';
import { Divider, Table, Space, Button } from 'antd';

import { useShopsOrder } from '../../store/ordersStore'
import { getPathByIndex } from "../../utils";

import SectionTitle from "../common/SectionTitle";

const OrderForPartner = ({toShipInfoData}) => {
    const shopId = getPathByIndex(2)
    const FlashShipPODVariantList = []
    const [ dataOCR, setDataOCR ] = useState([])
    const {getToShipInfo, loadingGetInfo} = useShopsOrder(state => state)
    const dataFlashShip = dataOCR.map((dataItem, index) => {
        const itemList = dataItem.data.order_list.map(order => order.item_list).flat()
        const variations = itemList.map(variation => variation.sku_name)
        const checkFashShip = variations.map(item => {
            const checkProductType = FlashShipPODVariantList.filter(variant => item.includes(variant.product_type))
            if (checkProductType.length) {
                const checkSku = checkProductType.find(variant => item.include(variant.variant_sku))
            }

            console.log('checkProductType: ', checkProductType);
        })
        console.log('checkFashShip: ', index, variations, checkFashShip)
    })
    const dataPrintCare = []
    const column = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: '20px',
            render: (_, record, index) => index + 1
        },
        {
            title: 'Package ID',
            dataIndex: 'package_id',
            key: 'package_id'
        },
        {
            title: 'Product items',
            dataIndex: 'product_items',
            key: 'product_items'
        },
        {
            title: 'Tracking ID',
            dataIndex: 'tracking_id',
            key: 'tracking_id'
        },
        {
            title: 'Shipping information',
            dataIndex: 'shipping_info',
            key: 'shipping_info'
        },
    ]

    useEffect(() => {
        const data = {
            order_documents: toShipInfoData
        }

        const onSuccess = (res) => {
            if (res) {
                setDataOCR(res)
            }
        }

        const onFail = (err) => {
            console.log(err)
        }

        getToShipInfo(shopId, data, onSuccess, onFail)
    }, [toShipInfoData])

    console.log('dataOCR: ', dataOCR)

    return (
        <div className="p-10">
            <div>
                <div className='flex flex-wrap items-center mb-3'>
                    <div className="flex-1"><SectionTitle title="Create Order in FlashShip" /></div>
                    <Space>
                        <Button type='primary'>Create Order with FlashShip</Button>
                        <Button type='primary'>Export to excel file</Button>
                    </Space>
                </div>
                <Table columns={column} dataSource={dataFlashShip} bordered />
            </div>

            <Divider className='my-10'/>
            <div>            
                <div className='flex flex-wrap items-center mb-3'>
                    <div className="flex-1"><SectionTitle title="Create Order in PrintCare" className="flex-1" /></div>
                    <Button type='primary'>Export to excel file</Button>
                </div>             
                <Table columns={column} dataSource={dataPrintCare} bordered />
            </div>
        </div>
    );
}
 
export default OrderForPartner;