import React from 'react';
import { Button, Form, Input, Row, Col, InputNumber } from 'antd';

const ProductCreateAddVariationForm = ({dataInput, handleAdd, handleClose}) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('form: ', values)
    const variationsForm = Object.keys(values.variations).map((key) => values.variations[key]);
    const variationAddData = {
        variations: variationsForm.map((item) => (
            {
                key: `${Math.floor(Math.random() * 1000000000000000000)}`,
                id: item.dataIndex,
                name: item.name,
                value_id: `${Math.floor(Math.random() * 1000000000000000000)}`,
                value_name: item.value_name
            }
        )),
        price: values.price,
        stock_infos: values.available,
        seller_sku: values.seller_sku
    }

    handleAdd(variationAddData)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
        {dataInput?.map((item, index) => (
            <>
                <Form.Item name={['variations', `${index}`, 'dataIndex']} initialValue={item.dataIndex} className='hidden'>
                    <Input/>
                </Form.Item>
                <Form.Item name={['variations', `${index}`, 'name']} initialValue={item.name} className='hidden'>
                    <Input/>
                </Form.Item>
                <Form.Item name={['variations', `${index}`, 'value_name']} label={item.name} required tooltip="This is a required field">
                    <Input />
                </Form.Item>
            </>
        ))}

        <Row gutter={20}>
            <Col span={12}>
                <Form.Item name='price' label='Giá'>
                    <InputNumber addonBefore='$' min={0} className='w-full'/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name='available' label='Số lượng'>
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