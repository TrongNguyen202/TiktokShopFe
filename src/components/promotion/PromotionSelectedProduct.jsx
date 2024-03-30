import { Table } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { getPathByIndex } from "../../utils";

const PromotionSelectedProduct = ({data}) => {
    const shopId = getPathByIndex(2);

    const columns = [
        {
            title: "Product Id",
            dataIndex: 'id',
            key: "id"
        },
        {
            title: "Product name",
            dataIndex: 'name',
            key: "name"
        },
        {
            title: "Actions",
            dataIndex: 'actions',
            key: "actions",
            align: 'center',
            width: '100px',
            render: (_, record) => <Link to={`/shops/${shopId}/products/${record.id}`} target="_blank"><EyeOutlined /></Link>
        }
    ]

    return (
        <div className="w-full">
            <p className="mb-2 text-sm font-semibold">{data.length} products selected</p>
            <Table
                columns={columns} 
                dataSource={data} 
                bordered
                pagination={{
                    pageSize: 50
                }}
            />
        </div>
    );
}
 
export default PromotionSelectedProduct;