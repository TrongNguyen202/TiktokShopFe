
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Input, Card, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import { removeDuplicates } from '../../utils'
import ProductSectionTitle from './ProuctSectionTitle';
import ProductCreateVariationTable from './ProductCreateVariationTable'

const ProductCreateVariation = ({variations, variationsDataTable}) => {
    const listAttributesData = variations?.map((item) => item.sales_attributes)
    const variationData = variations?.map((item) => ({
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
    const listVariation = listAttributesConvert&&removeDuplicates(listAttributesConvert, 'id')

    return (
        <>
            <ProductSectionTitle title='Biến thể sản phẩm' />
            <ProductCreateVariationTable variationsData={variationData} listVariation={listVariation} variationsDataTable={variationsDataTable}/>
        </>
    );
}
 
export default ProductCreateVariation;