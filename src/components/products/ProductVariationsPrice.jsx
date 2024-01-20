import { Table, Form, Input, InputNumber, Select, Button } from 'antd'

const ProductVariationsPrice = ({selectedSelector, warehouseOptions, handleAddData}) => {
    const columns = [
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            render: (_, record, index) => {
                const initalValueColor = record.data[0]?.value_id ? record.data[0]?.value_id : `${Math.floor(Math.random() * 10000000000000000000)}`
                return (
                    <>
                        <Form.Item name={[`${index}`, 'variations', 'Color', 'value_id']} initialValue={initalValueColor} className='hidden'>
                            <Input disabled className='!bg-transparent border-none !text-black'/>
                        </Form.Item>
                        <Form.Item name={[`${index}`, 'variations', 'Color', 'value_name']} initialValue={record.data[0]?.value_name}>
                            <Input disabled className='!bg-transparent border-none !text-black'/>
                        </Form.Item>
                    </>
                )
            }
        }, 
        {
            title: 'Kích cỡ',
            dataIndex: 'size',
            render: (_, record, index) => {
                const initalValueSize = record.data[1]?.value_id ? record.data[1]?.value_id : `${Math.floor(Math.random() * 10000000000000000000)}`
                return (
                    <>
                        <Form.Item name={[`${index}`, 'variations', 'Size', 'value_id']} initialValue={initalValueSize} className='hidden'>
                            <Input disabled className='!bg-transparent border-none !text-black'/>
                        </Form.Item>
                        <Form.Item name={[`${index}`, 'variations', 'Size', 'value_name']} initialValue={record.data[1]?.value_name}>
                            <Input disabled className='!bg-transparent border-none !text-black'/>
                        </Form.Item>
                    </>
                )
            }
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            align: 'center',
            render: (_, record, index) => (
                <Form.Item name={[`${index}`, 'price']}>
                    <InputNumber min={0} addonAfter='$' className='w-full' />
                </Form.Item>
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'available_stock',
            align: 'center',
            render: (_, record, index) => (
                <Form.Item name={[`${index}`, 'stock_infos', 'available_stock']}>
                    <InputNumber min={0} className='w-full' />
                </Form.Item>
            )
        },
        {
            title: 'SKU',
            dataIndex: 'seller_sku',
            align: 'center',
            render: (_, record, index) => (
                <Form.Item name={[`${index}`, 'seller_sku']}>
                    <Input />
                </Form.Item>
            )
        },
        {
            title: 'Kho',
            dataIndex: 'warehouse_id',
            align: 'center',
            with: '100px',
            render: (_, record, index) => (
                <Form.Item name={[`${index}`, 'stock_infos', 'warehouse_id']}>
                    <Select placeholder='Hãy chọn 1 kho' options={warehouseOptions} />
                </Form.Item>
            )
        }
    ]

    const onFinish = (values) => {
        const resultArray = Object.keys(values).map(key => values[key]);
        // console.log('resultArray: ', resultArray)
        const newDataPrice = resultArray?.map((item) => (
            {
                ...item,
                key: `${Math.floor(Math.random() * 1000000000000000000)}`,
                variations: Object.keys(item.variations).map(key => (
                    {
                        ...item.variations[key],
                        name: key
                    }
                ))
            }
        ))
        // console.log('newDataPrice: ', newDataPrice)
        handleAddData(newDataPrice)
    }

    return (
        <Form onFinish={onFinish}>
            <Table columns={columns} dataSource={selectedSelector} onChange={() => {}} bordered pagination={false}/>
            <Form.Item className='mt-5'>
                <Button type="primary" htmlType="submit" className='w-[200px]'>Lưu</Button>
            </Form.Item>
        </Form>
    );
}
 
export default ProductVariationsPrice;