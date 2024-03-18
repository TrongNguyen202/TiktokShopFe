import { Link } from 'react-router-dom';
import { Table } from 'antd';

function OrdersLabelsSearch({ dataSource }) {
  const columns = [
    {
      title: 'SST',
      dataIndex: 'stt',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Order ID',
      dataIndex: 'name',
    },
    {
      title: 'Label URL',
      dataIndex: 'link',
      render: (text) => (
        <Link to={text} target="_blank">
          {text}
        </Link>
      ),
    },
  ];

  return <Table columns={columns} dataSource={dataSource} pagination={{ position: ['none'] }} bordered />;
}

export default OrdersLabelsSearch;
