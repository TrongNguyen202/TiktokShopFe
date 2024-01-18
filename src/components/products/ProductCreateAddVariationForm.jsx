import React, { useState } from 'react';
import { Button, Form, Input, Row, Col, InputNumber, Select } from 'antd';

import { variationsOption } from '../../constants'

const ProductCreateAddVariationForm = ({handleAdd, handleClose}) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('values', values);
    const variationAddData = {
        id: values.variations.id,
        name: variationsOption.find((attr) => attr.value === values.variations.id).label,
        value_id: `${Math.floor(Math.random() * 1000000000000000000)}`,
        value_name: values.variations.value_name,
        seller_sku: values?.seller_sku ? values?.seller_sku : '',
        price: values?.price,
        stock_infos: {
            available_stock: values?.stock_infos?.available_stock
        }
    }
    
    handleAdd(variationAddData)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
        <Form.Item name={['variations', 'id']} label='Chọn thuộc tính' required tooltip="This is a required field">
            <Select
                className='w-full'
                onChange={() => {}}
                options={variationsOption}
            />
        </Form.Item>
        <Form.Item name={['variations', 'value_name']} label='Giá trị thuộc tính' required tooltip="This is a required field">
            <Input />
        </Form.Item>
        <Row gutter={30}>
            <Col span={12}>
                <Form.Item name='price' label='Giá'>
                    <InputNumber addonAfter='$' min={0} className='w-full' />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name={['stock_infos', 'available_stock']} label='Số lượng'>
                    <InputNumber min={0} className='w-full' />
                </Form.Item>                
            </Col>
        </Row>
        <Form.Item name='seller_sku' label='SKU'>
            <Input />
        </Form.Item>
      
        <Form.Item>
            <Button type="primary" htmlType="button" onClick={handleClose} className='mr-3'>Huỷ</Button>
            <Button type="primary" htmlType="submit">Thêm biến thể</Button>
        </Form.Item>
    </Form>
  );
};
export default ProductCreateAddVariationForm;