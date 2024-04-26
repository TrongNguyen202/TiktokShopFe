import React, { useEffect } from 'react';
import { Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useShopsOrder } from '../../store/ordersStore';
import StoreDetailSectionTitle from './StoreDetailSectionTitle';

function StoreDetailOrder({ shopId }: { shopId: string }) {
  const navigate = useNavigate();
  const { orders, getAllOrders } = useShopsOrder((state) => state);
  const orderList = orders.length ? orders?.map((order) => order?.data?.order_list).flat() : [];
  useEffect(() => {
    const onSuccess = () => {};

    const onFail = (err) => {
      console.log(err);
    };
    getAllOrders(shopId, onSuccess, onFail);
  }, []);

  return (
    <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate(`/shops/${shopId}/orders`)}>
      <StoreDetailSectionTitle title="Đơn hàng" count={orderList?.length > 0 ? orderList?.length : '0'} isShowButton />
      <Link to={`/shops/${shopId}/orders`}>Xem thêm</Link>
    </Card>
  );
}

export default StoreDetailOrder;
