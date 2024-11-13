import React from 'react';
import { Space, Table, Tag } from 'antd';
const columns = [
    {
        title: 'SST',
        dataIndex: 'sst',
        key: 'sst',
        render: (_, record, index) => index,
        with: '20px'
    },
    {
        title: 'Order Id',
        dataIndex: 'order_id',
        key: 'order_id'
    },
    {
        title: 'Package Id',
        dataIndex: 'pack_id',
        key: 'pack_id'
    },
    {
        title: 'Product Item',
        dataIndex: 'product_item',
        key: 'product_item',
        render: (_, record) => <div>{record?.products?.length} sản phẩm</div>,
    },
    {
        title: 'Label',
        dataIndex: 'linkLabel',
        key: 'linkLabel',
        render: (text) => <a href={text}>{text}</a>
    },
    {
        title: 'Shipping information',
        dataIndex: 'linkLabel',
        key: 'linkLabel',
        render: (_, record) => (
            <div>
                <ul>
                    <li><strong>Buyer name:</strong> <span>{record.buyer_first_name} {record.buyer_last_name}</span></li>
                    <li><strong>Buyer email:</strong> <span>{record.buyer_email}</span></li>
                    <li><strong>Address:</strong> <span>{record.buyer_address1} | {record.buyer_address2}</span></li>
                    <li><strong>City:</strong> <span>{record.buyer_city}</span></li>
                    <li><strong>State:</strong> <span>{record.buyer_province_code}</span></li>
                    <li><strong>Country:</strong> <span>{record.buyer_country_code}</span></li>
                    <li><strong>Zip code:</strong> <span>{record.buyer_zip}</span></li>
                </ul>
            </div>
        )
    },
];

const AllPackagesTable = ({ data, loadingAllPackages }) => <Table columns={columns} dataSource={data} loading={loadingAllPackages} />;
export default AllPackagesTable;