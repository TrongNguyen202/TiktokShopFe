import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Input, Card, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import { alerts } from '../../utils/alerts';
import { removeDuplicates } from '../../utils';
import { useWareHousesStore } from '../../store/warehousesStore';

import ProductSectionTitle from './ProuctSectionTitle';
import ProductVariationTable from './ProductVariationTable';

function ProductVariation({ shopId, variations, variationsDataTable, isProductCreate }) {
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore((state) => state);

  const variationsData = variations?.map((item) => ({
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

  return (
    <>
      <ProductSectionTitle title="Biến thể sản phẩm" />
      {isProductCreate ? (
        <ProductVariationTable
          variationsData={variationsData}
          variationsDataTable={variationsDataTable}
          warehouses={warehousesById}
          isProductCreate
        />
      ) : (
        <ProductVariationTable
          variationsData={variationsData}
          variationsDataTable={variationsDataTable}
          warehouses={warehousesById}
        />
      )}
    </>
  );
}

export default ProductVariation;
