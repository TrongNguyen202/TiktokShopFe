import { Form, Input, InputNumber, Row, Col } from 'antd'

import ProductSectionTitle from "./ProuctSectionTitle";

const ProductCreateSale = () => {
    return (
        <>
            <ProductSectionTitle title='Thông tin bán hàng' />
            <Row>
                <Col span={6}>
                    <Form.Item name='price' label="Giá:">
                        <InputNumber min={0} className='w-full' addonAfter='USD' />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item label="Số lượng:" name='available'>
                        <InputNumber min={0} className='w-full' />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item name='seller_sku' label="SKU (Đơn vị lưu trữ hàng tồn kho):">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
 
export default ProductCreateSale;