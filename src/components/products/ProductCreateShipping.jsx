import { useState } from "react";
import { Form, Radio, InputNumber, Row, Col, Switch } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import ProductSectionTitle from "./ProuctSectionTitle";

const ProductCreateShipping = () => {
    const [valuePackage, setValuePackage] = useState('');

    return (
        <>
            <ProductSectionTitle title='Thông tin bán hàng' />
            <Row gutter={30}>
                <Col span={6}>
                    <Form.Item name='is_cod_open' label='Chấp nhận thanh toán khi nhận hàng: '>
                        <Switch 
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />} 
                        />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item name='package_dimension_unit' label='Chọn loại kích thước gói sản phẩm:'>
                        <Radio.Group onChange={(e) => setValuePackage(e.target.value)} value={valuePackage}>
                            <Radio value='metric'>Số liệu</Radio>
                            <Radio value='imperial'>Hệ đo lường Anh</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>


            <Row gutter={30}>
                <Col span={6}>
                    <Form.Item name='package_weight' label='Cân nặng:'>
                        <InputNumber
                            min={0}
                            max={100}
                            onChange={() => {}}
                            addonAfter='Kg'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_width' label='Chiều rộng:'>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='Cm'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_height' label='Chiều dài:'>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='Cm'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_length' label='Chiều cao:'>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='Cm'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
            </Row>


        </>
    );
}
 
export default ProductCreateShipping;