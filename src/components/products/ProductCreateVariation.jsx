import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Input, Card, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import { alerts } from '../../utils/alerts';
import { removeDuplicates } from '../../utils';
import { useWareHousesStore } from '../../store/warehousesStore';

import ProductSectionTitle from './ProuctSectionTitle';
import ProductCreateAddVariationForm from './ProductCreateAddVariationForm';

function ProductCreateVariation({ shopId, variations, variationsDataTable }) {
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore((state) => state);
  const listAttributesData = variations?.map((item) => item.sales_attributes);
  const variationData = variations?.map((item) => ({
    variations: item.sales_attributes,
    price: item?.price?.original_price,
    stock_infos: {
      available_stock: item.stock_infos[0].available_stock,
      warehouse_id: item.stock_infos[0].warehouse_id,
    },
    seller_sku: item.seller_sku,
    key: item.id,
  }));

  useEffect(() => {
    const onSuccess = (res) => {};
    const onFail = (err) => {
      alerts.error(err);
    };

    getWarehousesByShopId(shopId, onSuccess, onFail);
  }, [shopId]);

  const listAttributesConvert = listAttributesData && [].concat(...listAttributesData);
  const listVariation = listAttributesConvert && removeDuplicates(listAttributesConvert, 'id');

  return (
    <>
      <ProductSectionTitle title="Biến thể sản phẩm" />
      <ProductCreateAddVariationForm
        warehouse={warehousesById}
        variationsData={variationData}
        listVariation={listVariation}
        variationsDataTable={variationsDataTable}
      />
    </>
  );
}

export default ProductCreateVariation;
