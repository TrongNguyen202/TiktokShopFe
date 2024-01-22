import React, { useState } from 'react';
import { Button, Form, Input, Row, Col, InputNumber, Select, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons'

import { variationsOption } from '../../constants'
import { flatMapArray, removeDuplicates } from '../../utils'

import ProductEditCustomSelect from './ProductEditCustomSelect'
import ProductVariationsPrice from './ProductVariationsPrice';

const ProductEditAddVariationForm = ({handleAdd, handleClose, warehouses, variationsSelect}) => {
    const [form] = Form.useForm()
    const [showModalPrice, setShowModalPrice] = useState(false)
    const [variationsData, setVariationsData] = useState([]);
    const warehouseOptions = warehouses?.warehouse_list?.map(item => (
        {
            value: item.warehouse_id,
            label: item.warehouse_name
        }
    ))
    console.log('warehouseOptions: ', warehouseOptions)
    const variationsSelectColor = variationsSelect?.filter(item => item.name === 'Color')?.map((item) => (
        {
            label: item.value_name,
            value: item.value_id
        }
    ))
    const variationsSelectSize = variationsSelect?.filter(item => item.name === 'Size').map(item => (
        {
            label: item.value_name,
            value: item.value_id
        }
    ))
    const initColorOptions = removeDuplicates(variationsSelectColor, 'value')
    const initSizeOptions = removeDuplicates(variationsSelectSize, 'value')
    const [selectedColor, setSelectedColor] = useState(initColorOptions?.map(item => (
        {label: item.label, value: item.value}
    )));
    const [selectedSize, setSelectedSize] = useState(initSizeOptions?.map(item => ({label: item.label, value: item.value})));

    const selectedSelector = selectedColor.flatMap(item1 =>
        selectedSize.map(item2 => ({
            data: [
              {value_name: item1.label, value_id: item1.value},
              {value_name: item2.label, value_id: item2.value }
            ]
        }))
    );  
    // console.log('variationsData: ', variationsData)

    const handAddVariations = () => {
        handleAdd(variationsData)
    }

    const handleAddData = (data) => {
        console.log('data: ', data);
        const newData = data?.map((item) => ({
            ...item,
            variations: item.variations?.map((item, index) => ({
                id: variationsOption.find(option => option.label === item.name).value,
                ...item,
            }))
        }))
        console.log('newData: ', newData);
        setVariationsData(newData)
        setShowModalPrice(false)
    }

    return (
        <Form
            form={form}
            layout="vertical"
        >
            <Form.Item name={['variations', 'Size']} label='Size' required tooltip="This is a required field">
                <ProductEditCustomSelect
                    selectedDefault={selectedSize}
                    optionsSelect={initSizeOptions}
                    type={"kích cỡ"}
                    onChange={setSelectedSize}
                />
            </Form.Item>
            <Form.Item name={['variations', 'Color']} label='Màu' required tooltip="This is a required field">
                <ProductEditCustomSelect
                    selectedDefault={selectedColor}
                    optionsSelect={initColorOptions}
                    type={"màu"}
                    onChange={setSelectedColor}
                />
            </Form.Item>
            {selectedSelector?.length > 0 && 
                <Button type="primary" ghost onClick={() => setShowModalPrice(true)} icon={<EditOutlined />} className="block ml-auto mt-9" >
                    Chỉnh sửa giá
                </Button>
            }

            {showModalPrice && (
                <Modal
                    title="Chỉnh sửa giá"
                    open={showModalPrice}
                    onCancel={() => {setShowModalPrice(false)}}
                    footer={null}
                    okText="Đồng ý"
                    cancelText="Hủy"
                    width={1200}
                    maskClosable={false}
                >
                    <ProductVariationsPrice selectedSelector={selectedSelector} warehouseOptions={warehouseOptions} handleAddData={handleAddData}/>
                </Modal>
            )}            
        
            <Form.Item>
                <Button type="primary" htmlType="button" onClick={handleClose} className='mr-3'>Huỷ</Button>
                <Button type="primary" htmlType="submit" onClick={handAddVariations}>Thêm biến thể</Button>
            </Form.Item>
        </Form>
    );
};
export default ProductEditAddVariationForm;