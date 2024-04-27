import React, { useEffect, useState } from 'react';

import { useWareHousesStore } from '../../store/warehousesStore';
import { alerts } from '../../utils/alerts';

import ProductVariationTable from './ProductVariationTable';
import ProductSectionTitle from './ProuctSectionTitle';

function ProductVariation({ shopId, variations, variationsDataTable, isProductCreate }) {
  const [variationProduct, setVariationProduct] = useState([]);
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore((state) => state);

  const variationsData = variationProduct?.map((item) => ({
    variations: item.variations,
    price: item?.price,
    stock_infos: item.stock_infos.map((info) => ({
      available_stock: info.available_stock,
      warehouse_id: info.warehouse_id,
    })),
    seller_sku: item.seller_sku,
    key: item.key,
  }));

  useEffect(() => {
    setVariationProduct(variations);
  }, [variations]);

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err: string) => {
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
