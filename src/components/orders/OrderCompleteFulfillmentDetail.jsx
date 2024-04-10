import { Table, Image, Tag } from "antd";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/date";
import { Link } from "react-router-dom";

const OrderCompleteFulfillmentDetail = ({data}) => {
    const [dataTable, setDataTable] = useState([]);
    const dataTableConvert = dataTable.flatMap((item) => item.products);
    console.log('dataTableConvert: ', dataTableConvert);

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
                    <li><span className="font-semibold">Product Type:</span> <span>{record.productTypeEnum}</span></li>
                    <li><span className="font-semibold">Variant Sku:</span> <span>{record.variantSku}</span></li>
                    <li><span className="font-semibold">Variant Title:</span> <span>{record.variantTitle}</span></li>
                    <li><span className="font-semibold">Variant Size:</span> <span>{record.variantSize}</span></li>
                </ul>
            )
        },
        {
            title: "Front",
            dataIndex: "front",
            key: "front",
            align: 'center',
            render: (_, record) =>
                <Link to={record.frontPrintUrl} target="_blank">
                    <Image width={70} src={record.frontPrintUrl} preview={false} alt="Front image" />
                </Link>
        },
        {
            title: "Back",
            dataIndex: "back",
            key: "back",
            align: 'center',
            render: (_, record) =>
                <Link to={record.frontPrintUrl} target="_blank">
                    <Image width={70} src={record.backPrintUrl} preview={false} alt="Back image" />
                </Link>
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
        <Table columns={columns} dataSource={dataTableConvert} bordered pagination={false} />
    );
}
 
export default OrderCompleteFulfillmentDetail;