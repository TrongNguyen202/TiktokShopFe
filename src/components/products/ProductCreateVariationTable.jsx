import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Table, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import ProductCreateAddVariationForm from './ProductCreateAddVariationForm';

const ProductCreateVariationTable = ({variationData, listVariation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        setDataSource(variationData)
    }, [variationData, dataSource])
    
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    
    const listVariationColumn = listVariation?.map((item) => (
        {
            name: item.name,
            dataIndex: item.id,
            render: (_, record, index) => (
                record.variations?.map((value, i) => (
                    <>{value.id === item.id &&
                        <>
                            <Form.Item name={['variations', `${index}`, 'sales_attributes', `${i}`, 'attribute_id']} initialValue={item.name} className='hidden'>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={['variations', `${index}`, 'sales_attributes', `${i}`, 'attribute_name']} initialValue={item.id} className='hidden'>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={['variations', `${index}`, 'sales_attributes', `${i}`, 'value_id']} initialValue={item.value_id} className='hidden'>
                                <Input/>
                            </Form.Item>
                            <Form.Item name={['variations', `${index}`, 'sales_attributes', `${i}`, 'value_name']} initialValue={item.value_name}>
                                <Input disabled className='border-none !bg-transparent !text-black'/>
                            </Form.Item>
                        </>
                    }</>
                ))
            )
        }
    ))
    const converColumn = listVariationColumn&&[
        ...listVariationColumn,
        {
            name: 'Giá',
            dataIndex: 'price',
            align: 'center',
            render: (text, record, index) => (
                <>
                    <Form.Item name={['variations', `${index}`, 'id']} initialValue={record.key} className='hidden'>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['variations', `${index}`, 'original_price']} initialValue={record.price}>
                        <InputNumber addonAfter='$' />
                    </Form.Item>
                </>
            ),
        },
        {
            name: 'Số lượng',
            dataIndex: 'stock_infos',
            align: 'center',
            render: (_, record, index) => (
                <>
                    <Form.Item name={['variations', `${index}`, 'stock_infos', 'warehouse_id']} initialValue={record.stock_infos.warehouse_id} className='hidden'>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['variations', `${index}`, 'stock_infos', 'available_stock']} initialValue={record.stock_infos.available_stock}>
                        <InputNumber />
                    </Form.Item>
                </>
            ),
        },
        {
            name: 'SKU',
            dataIndex: 'seller_sku',
            align: 'center',
            render: (text, _, index) => (
                <Form.Item name={['variations', `${index}`, 'seller_sku']} initialValue={text}>
                    <Input />
                </Form.Item>
            ),
        },
        {
            name: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            width: '50px',
            align: 'center',
            render: (_, record) => dataSource.length >= 1 ? (
                <Popconfirm placement="topRight" title="Bạn có thực sự muốn xoá biến thể này?" onConfirm={() => handleDelete(record.key)}>
                    <DeleteOutlined />
                </Popconfirm>
            ) : null,
        }
    ]
    const columnsTable = converColumn?.map((item) => (
        {
            title: item.name,
            dataIndex: item.dataIndex,
            render: item.render,
            editable: item.editable,
            width: item.width,
            fixed: item.fixed,
            align: item.align
        }
    ))

  const handleAdd = (newData) => {
    setDataSource([newData, ...dataSource]);
    setIsModalOpen(false)
  };
  
  console.log('dataSource: ', dataSource)

  return (
    <div>
        <Button onClick={() => setIsModalOpen(true)} type="primary" className='mb-5' >Thêm biến thể</Button>
        <Table
            bordered
            dataSource={dataSource}
            columns={columnsTable}
        />
        <Modal title="Thêm giá trị thuộc tính" open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
            <ProductCreateAddVariationForm dataInput={listVariationColumn} handleClose={() => setIsModalOpen(false)} handleAdd={handleAdd} />
        </Modal>
    </div>
  );
};
export default ProductCreateVariationTable;