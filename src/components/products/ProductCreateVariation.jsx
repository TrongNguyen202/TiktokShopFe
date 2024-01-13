
import React, { useState } from 'react';
import { Form, Button, Row, Col, Input, Card, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import { DeleteDuplicateElementsById, DeleteDuplicateElements } from '../../utils'
import ProductSectionTitle from './ProuctSectionTitle';
import ProductCreateVariationTable from './ProductCreateVariationTable'

const ProductCreateVariation = ({variation}) => {
    const listAttributesData = variation?.map((item) => item.sales_attributes)
    const variationData = variation?.map((item) => ({
        variations: item.sales_attributes,
        price: item.price.original_price,
        stock_infos: {
            available_stock: item.stock_infos[0].available_stock,
            warehouse_id: item.stock_infos[0].warehouse_id
        },
        seller_sku: item.seller_sku,
        key: item.id
    }))
    const listAttributesConvert = listAttributesData&&[].concat(...listAttributesData)
    const listVariation = listAttributesConvert&&DeleteDuplicateElementsById(listAttributesConvert)

    return (
        <>
            <ProductSectionTitle title='Biến thể sản phẩm' />
            <ProductCreateVariationTable variationData={variationData} listVariation={listVariation} />
        </>
    );
}
 
export default ProductCreateVariation;