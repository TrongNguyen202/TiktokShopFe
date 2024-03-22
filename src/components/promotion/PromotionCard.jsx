import { Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import StoreDetailSectionTitle from '../stores/StoreDetailSectionTitle';

function StoreDetailOrder({ shopId }) {
  const navigate = useNavigate();

  return (
    <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate(`/shops/${shopId}/promotions`)}>
      <StoreDetailSectionTitle title="Promotions" isShowButton />
      <Link to={`/shops/${shopId}/promotions`}>Xem thêm</Link>
    </Card>
  );
}

export default StoreDetailOrder;
