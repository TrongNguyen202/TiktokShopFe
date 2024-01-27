import { Table, Button, Form, Input, Divider } from 'antd'

const OrdersAddNewDesignData = ({dataColumns}) => {
    const columns = [
        {
            title: 'SKU',
            dataIndex: 'SKU',
            key: 'SKU',
            width: '210px',
            align: 'center',
            render: (text, _, index) => (
                <Form.Item name={[index, "SKU"]} initialValue={text}>
                    <Input disabled className='border-none hover:border-none !bg-transparent !text-[#000000E0]'/>
                </Form.Item>
            )
        },
        {
            title: 'Product Name',
            dataIndex: 'Product Name',
            key: 'Product Name'
        },
        {
            title: 'Variation',
            dataIndex: 'Variation',
            key: 'Variation'
        },
        {
            title: 'Image 1 (front)',
            dataIndex: 'Image 1 (front)',
            key: 'Image 1 (front)',
            render: (text, _, index) => (
                <Form.Item name={[index, "Image 1 (front)"]}>
                    <Input/>
                </Form.Item>
            )
        },
        {
            title: 'Image 2 (back)',
            dataIndex: 'Image 2 (back)',
            key: 'Image 2 (back)',
            render: (text, _, index) => (
                <Form.Item name={[index, "Image 2 (back)"]}>
                    <Input/>
                </Form.Item>
            )
        },
    ]

    const onFinish = (values) => {
        console.log('values: ', values);
    }

    return (
        <>
            <Divider>Hoặc </Divider>
            <Form onFinish={onFinish}>
                <Table columns={columns} dataSource={dataColumns} bordered />
                <Form.Item>
                    <Button type="primary" htmlType="submit">Thêm mẫu</Button>
                </Form.Item>
            </Form>
        </>
    );
}
 
export default OrdersAddNewDesignData;