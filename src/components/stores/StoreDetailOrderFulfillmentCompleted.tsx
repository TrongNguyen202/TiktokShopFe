import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useShopsOrder } from '../../store/ordersStore';
import StoreDetailSectionTitle from './StoreDetailSectionTitle';

function StoreDetailOrderFulfillmentCompleted({ shopId }: { shopId: string }) {
  const navigate = useNavigate();
  const { packageFulfillmentCompleted } = useShopsOrder((state) => state);
  const [orders, setOrder] = useState([]);
  useEffect(() => {
    const onSuccess = (res) => {
      setOrder(res);
    };

    const onFail = (err) => {
      console.log(err);
    };
    packageFulfillmentCompleted(shopId, onSuccess, onFail);
  }, []);

  return (
    <Card
      className="cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/shops/${shopId}/orders/fulfillment/completed`)}
    >
      <StoreDetailSectionTitle
        title="Đơn hàng đã Fulfillment"
        count={orders?.length > 0 ? orders?.length : '0'}
        isShowButton
      />
      <Link to={`/shops/${shopId}/orders/fulfillment/completed`}>Xem thêm</Link>
    </Card>
  );
}

export default StoreDetailOrderFulfillmentCompleted;
