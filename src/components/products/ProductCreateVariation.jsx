
import React, { useState } from 'react';
import { Form, Button, Row, Col, Input, Card, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import { DeleteDuplicateElementsById, DeleteDuplicateElements } from '../../utils'
import ProductSectionTitle from './ProuctSectionTitle';
import AntdTest from './AntdTest';

const ProductCreateVariation = ({variation}) => {
    const listAttributesData = variation?.map((item) => item.sales_attributes)
    const variationData = variation?.map((item) => ({
        variations: item.sales_attributes,
        price: item.price.original_price,
        stock_infos: item.stock_infos[0].available_stock,
        seller_sku: item.seller_sku
    }))
    const listAttributesConvert = listAttributesData&&[].concat(...listAttributesData)
    const listVariation = listAttributesConvert&&DeleteDuplicateElementsById(listAttributesConvert)
    // const variationData = listAttributesConvert&&DeleteDuplicateElements(listAttributesConvert)
    
    // console.log('variation: ', variation)
    // console.log('listAttributes: ', variationData)
    // console.log('variationData: ', variationData)
    return (
        <>
            <ProductSectionTitle title='Biến thể sản phẩm' />
            <AntdTest variationData={variationData} listVariation={listVariation} />
        </>
    );
}
 
export default ProductCreateVariation;