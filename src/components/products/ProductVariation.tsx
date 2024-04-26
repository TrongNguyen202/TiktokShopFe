import React, { useEffect, useState } from 'react';

import { useWareHousesStore } from '../../store/warehousesStore';
import { alerts } from '../../utils/alerts';
import { SkuProductForm, stockInfosProduct } from "../../types/products"

import ProductVariationTable from './ProductVariationTable';
import ProductSectionTitle from './ProuctSectionTitle';

interface ProductVariationProps {
  shopId: string;
  variations?: any;
  variationsDataTable?: any;
  isProductCreate?: boolean;
}

function ProductVariation({ shopId, variations, variationsDataTable, isProductCreate }: ProductVariationProps) {
  const [variationProduct, setVariationProduct] = useState([]);
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore((state) => state);

  const variationsData: SkuProductForm[] = variationProduct?.map((item: SkuProductForm) => ({
    variations: item.variations,
    price: item?.price,
    stock_infos: {
      available_stock: item?.stock_infos.available_stock,
      warehouse_id: item?.stock_infos.warehouse_id,
    },
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
