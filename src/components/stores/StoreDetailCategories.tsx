import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { useCategoriesStore } from '../../store/categoriesStore';
import StoreDetailSectionTitle from './StoreDetailSectionTitle';
import { alerts } from '../../utils/alerts';

function StoreDetailCategories({ shopId }: { shopId: string }) {
  const { getCategoriesById, categoriesById } = useCategoriesStore((state) => state);

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err: string) => {
      alerts.error(err);
    };

    getCategoriesById(shopId, onSuccess, onFail);
  }, [shopId]);

  return (
    <Card className="cursor-pointer hover:shadow-md">
      <StoreDetailSectionTitle
        title="Danh mục"
        count={categoriesById.category_list?.length > 0 ? categoriesById.category_list?.length : 0}
      />
      <Link to={`/shops/${shopId}/categories`}>Xem thêm</Link>
    </Card>
  );
}

export default StoreDetailCategories;
