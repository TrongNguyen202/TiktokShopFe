import { useState } from "react";
import { Form, Radio, InputNumber, Row, Col } from 'antd'

import ProductSectionTitle from "./ProuctSectionTitle";

const ProductCreateShipping = () => {
    const [valuePackage, setValuePackage] = useState('');

    return (
        <>
            <ProductSectionTitle title='Thông tin bán hàng' />
            <Form.Item name='package_dimension_unit' label='Chọn loại kích thước gói sản phẩm:'>
                <Radio.Group onChange={(e) => setValuePackage(e.target.value)} value={valuePackage}>
                    <Radio value='metric'>Số liệu</Radio>
                    <Radio value='imperial'>Hệ đo lường Anh</Radio>
                </Radio.Group>
            </Form.Item>


            <Row>
                <Col span={6}>
                    <Form.Item name='package_weight' label='Cân nặng:'>
                        <InputNumber
                            min={0}
                            max={100}
                            onChange={() => {}}
                            addonAfter='Kg'
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_width' label='Chiều rộng:'>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='Cm'
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_height' label='Chiều dài:'>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='Cm'
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_length' label='Chiều cao:'>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='Cm'
                        />
                    </Form.Item>
                </Col>
            </Row>


        </>
    );
}
 
export default ProductCreateShipping;