import { Divider, Table, Space, Button } from 'antd';

import SectionTitle from "../common/SectionTitle";

const OrderForPartner = ({toShipInfoData}) => {
    console.log('toShipInfoData: ', toShipInfoData);
    const dataFlashShip = []
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