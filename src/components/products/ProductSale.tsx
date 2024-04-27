import { Form, Input, InputNumber, Row, Col, Select } from 'antd';
import React from 'react';

import { WareHouseProduct } from '../../types/products';
import ProductSectionTitle from './ProuctSectionTitle';

interface ProductSaleProps {
  warehouses: WareHouseProduct[];
}

function ProductSale({ warehouses }: ProductSaleProps) {
  const warehousesOption = warehouses
    ?.filter((item) => item.warehouse_type === 1)
    ?.map((item) => ({
      value: item.warehouse_id,
      label: item.warehouse_name,
    }));
  return (
    <>
      <ProductSectionTitle title="Thông tin bán hàng" />
      <Row gutter={30}>
        <Col md={{ span: 6 }} span={12}>
          <Form.Item name="price" label="Giá:">
            <InputNumber min={0} className="w-full" addonAfter="USD" />
          </Form.Item>
        </Col>

        <Col md={{ span: 6 }} span={12}>
          <Form.Item label="Số lượng:" name={['stock_infos', 'available_stock']}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Col>

        <Col md={{ span: 6 }} span={12}>
          <Form.Item name="seller_sku" label="SKU:">
            <Input />
          </Form.Item>
        </Col>

        <Col md={{ span: 6 }} span={12}>
          <Form.Item name={['stock_infos', 'warehouse_id']} label="Chọn kho:">
            <Select options={warehousesOption} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

export default ProductSale;
