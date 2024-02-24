import { useState } from "react";
import { Form, Radio, InputNumber, Row, Col, Switch } from 'antd'

import ProductSectionTitle from "./ProuctSectionTitle";

const ProductCreateShipping = ({isProductCreate}) => {
    const [valuePackage, setValuePackage] = useState('');

    return (
        <>
            <ProductSectionTitle title='Thông tin vận chuyển' />
            {/* <Row gutter={30}>
                <Col md={{ span: 6 }} span={24}>
                    <Form.Item name='is_cod_open' label='Chấp nhận thanh toán khi nhận hàng: '>
                        <Switch {...(isProductCreate && { defaultChecked: true })}
                            checkedChildren='Bật'
                            unCheckedChildren='Tắt'
                        />
                    </Form.Item>
                </Col>
            </Row> */}


            <Row gutter={30}>
                <Col md={{ span: 6 }} span={12}>
                    <Form.Item name='package_weight' label='Cân nặng:' rules={[{ required: true, message: 'Cân nặng không được để trống' }]}>
                        <InputNumber
                            min={0}
                            max={220}
                            onChange={() => {}}
                            addonAfter='pound'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col md={{ span: 6 }} span={12}>
                    <Form.Item name='package_width' label='Chiều rộng:' rules={[{ required: true, message: 'Chiều rộng không được để trống' }]}>
                        <InputNumber
                            min={0}
                            max={393}
                            onChange={() => {}}
                            addonAfter='inch'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col md={{ span: 6 }} span={12}>
                    <Form.Item name='package_height' label='Chiều dài:' rules={[{ required: true, message: 'Chiều dài không được để trống' }]}>
                        <InputNumber
                            min={0}
                            max={393}
                            onChange={() => {}}
                            addonAfter='inch'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
                <Col md={{ span: 6 }} span={12}>
                    <Form.Item name='package_length' label='Chiều cao:' rules={[{ required: true, message: 'Chiều cao không được để trống' }]}>
                        <InputNumber
                            min={0}
                            max={393}
                            onChange={() => {}}
                            addonAfter='inch'
                            className="w-full"
                        />
                    </Form.Item>
                </Col>
            </Row>


        </>
    );
}
 
export default ProductCreateShipping;