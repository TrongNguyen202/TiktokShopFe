import { useEffect } from 'react';
import { Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useShopsOrder } from '../../store/ordersStore';
import StoreDetailSectionTitle from './StoreDetailSectionTitle';

function StoreDetailOrderFulfillmentCompleted({ shopId }) {
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
    <Card
      className="cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/shops/${shopId}/orders/fulfillment/completed`)}
    >
      <StoreDetailSectionTitle
        title="Đơn hàng đã Fulfillment"
        count={orderList?.length > 0 ? orderList?.length : '0'}
        isShowButton
      />
      <Link to={`/shops/${shopId}/orders/fulfillment/completed`}>Xem thêm</Link>
    </Card>
  );
}

export default StoreDetailOrderFulfillmentCompleted;
