import { useState } from "react";
import { Form, Radio, InputNumber, Row, Col, Switch } from 'antd'

import ProductSectionTitle from "./ProuctSectionTitle";

const ProductCreateShipping = () => {
    const [valuePackage, setValuePackage] = useState('');

    return (
        <>
            <ProductSectionTitle title='Thông tin vận chuyển' />
            <Row gutter={30}>
                <Col span={6}>
                    <Form.Item name='is_cod_open' label='Chấp nhận thanh toán khi nhận hàng: '>
                        <Switch defaultChecked 
                            checkedChildren='Bật'
                            unCheckedChildren='Tắt' 
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
                    <Form.Item name='package_weight' label='Cân nặng:' rules={[{ required: true, message: 'Cân nặng không được để trống' }]}>
                        <InputNumber
                            min={0}
                            max={100}
                            onChange={() => {}}
                            addonAfter='gr'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_width' label='Chiều rộng:' rules={[{ required: true, message: 'Chiều rộng không được để trống' }]}>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='cm'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_height' label='Chiều dài:' rules={[{ required: true, message: 'Chiều dài không được để trống' }]}>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='cm'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name='package_length' label='Chiều cao:' rules={[{ required: true, message: 'Chiều cao không được để trống' }]}>
                        <InputNumber
                            min={0}
                            onChange={() => {}}
                            addonAfter='cm'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
            </Row>


        </>
    );
}
 
export default ProductCreateShipping;