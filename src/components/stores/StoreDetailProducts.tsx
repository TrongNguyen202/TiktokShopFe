import { useEffect } from 'react';
import { Card } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { alerts } from '../../utils/alerts';
import { useProductsStore } from '../../store/productsStore';
import StoreDetailSectionTitle from './StoreDetailSectionTitle';
import React from 'react';

function StoreDetailProducts({ shopId }: { shopId: string }) {
  const navigate = useNavigate();
  const { getAllProducts, infoTable, resetProductById } = useProductsStore((state) => state);

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };

    getAllProducts(shopId, 1, onSuccess, onFail);
    return () => {
      resetProductById();
    };
  }, [shopId]);

  return (
    <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate(`/shops/${shopId}/products`)}>
      <StoreDetailSectionTitle
        title="Sản phẩm"
        count={infoTable?.data?.total > 0 ? infoTable?.data?.total : '0'}
        isShowButton
      />
      <Link to={`/shops/${shopId}/products`}>Xem thêm</Link>
    </Card>
  );
}

export default StoreDetailProducts;
