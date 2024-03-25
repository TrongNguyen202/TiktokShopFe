import { Table, Image, Tag } from "antd";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/date";

const OrderCompleteFulfillmentDetail = ({data}) => {
    const [dataTable, setDataTable] = useState([]);
    const columns = [
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            align: 'center',
        },
        {
            title: "Variant",
            dataIndex: "variant",
            key: "variant",
            align: 'center',
            render: (_, record) => (
                <ul>
                    <li><span className="font-semibold">Product Type:</span> <span>{record.products[0].productTypeEnum}</span></li>
                    <li><span className="font-semibold">Variant Sku:</span> <span>{record.products[0].variantSku}</span></li>
                    <li><span className="font-semibold">Variant Title:</span> <span>{record.products[0].variantTitle}</span></li>
                    <li><span className="font-semibold">Variant Size:</span> <span>{record.products[0].variantSize}</span></li>
                </ul>
            )
        },
        {
            title: "Front",
            dataIndex: "front",
            key: "front",
            align: 'center',
            render: (_, record) =><Image width={70} src={record.products[0].frontPrintUrl} alt="Front image" />
        },
        {
            title: "Back",
            dataIndex: "back",
            key: "back",
            align: 'center',
            render: (_, record) => <Image width={70} src={record.products[0].backPrintUrl} alt="Back image" />
        },
        {
            title: "Note",
            dataIndex: "note",
            key: "note",
            align: 'center',
        },
        {
            title: "Created",
            dataIndex: "created",
            key: "created",
            align: 'center',
            render: (text) => formatDate(text, 'DD/MM/YY hh:mm:ss')
        },
    ];

    useEffect(() => {
        if (data) setDataTable([data]);
    }, [data]);

    return (
        <Table columns={columns} dataSource={dataTable} bordered pagination={false} />
    );
}
 
export default OrderCompleteFulfillmentDetail;