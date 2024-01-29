import { useState } from "react";
import { useLocation, Link } from "react-router-dom"
import { Table, Tag, Button } from 'antd';

import PageTitle from "../../components/common/PageTitle";

const OrderLabels = () => {
    const location = useLocation();
    const { labels, orders } = location.state;
    const [labelSelected, setLabelSelected] = useState([])

    const data = orders.order_ids.map((order, index) => (
        {
            key: index,
            order_id: order,
            label: labels[index]
        }
    ))

    const columns = [
        {
          title: 'Order ID',
          dataIndex: 'order_id'
        },
        {
          title: 'Label URL',
          dataIndex: 'label',
          render: (text) => text ? <Link to={text} target="_blank">{text}</Link> : <Tag color="error">Không lấy được label</Tag>
        }
    ];

    const rowSelection = {
        onChange: (_, selectedRows) => {
            setLabelSelected(selectedRows)
        },
        getCheckboxProps: (record) => ({
            disabled: record.label === null
        })
    };

    return (
        <div className="p-10">
            <PageTitle title='Danh sách label' showBack count={labels.length}/>
            {labelSelected.length > 0 && <Button type="primary" className="mb-3" onClick={() => {}}>Xử lý label &nbsp;<span>({labelSelected.length})</span></Button>}
            <Table 
                rowSelection={{
                type: 'checkbox',
                ...rowSelection,
                }}
                columns={columns} 
                dataSource={data} 
                // loading={loading} 
                bordered
            />
        </div>
    );
}
 
export default OrderLabels;