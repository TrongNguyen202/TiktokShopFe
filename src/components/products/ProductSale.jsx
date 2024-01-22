import { Form, Input, InputNumber, Row, Col, Select } from 'antd'

import ProductSectionTitle from "./ProuctSectionTitle";

const ProductSale = ({warehouses}) => {
    const warehousesOption = warehouses?.map(item => (
        {
            value: item.warehouse_id,
            label: item.warehouse_name
        }
    ))
    return (
        <>
            <ProductSectionTitle title='Thông tin bán hàng' />
            <Row gutter={30}>
                <Col span={6}>
                    <Form.Item name='price' label="Giá:">
                        <InputNumber min={0} className='w-full' addonAfter='USD' />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item label="Số lượng:" name={['stock_infos', 'available_stock']}>
                        <InputNumber min={0} className='w-full' />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item name='seller_sku' label="SKU (Đơn vị lưu trữ hàng tồn kho):">
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item name={['stock_infos', 'warehouse_id']} label="Chọn kho">
                        <Select 
                            options={warehousesOption}/>
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
 
export default ProductSale;