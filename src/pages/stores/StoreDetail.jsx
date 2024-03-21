import { useEffect } from 'react';
import { Col, Row } from 'antd';

// import { useNavigate } from 'react-router-dom';
import { alerts } from '../../utils/alerts';
import { getPathByIndex } from '../../utils';

import { useShopsStore } from '../../store/shopsStore';

import PageTitle from '../../components/common/PageTitle';
import StoreDetailBaseInformation from '../../components/stores/StoreDetailBaseInformation';
// import StoreDetailBrands from '../../components/stores/StoreDetailBrands';
import StoreDetailWareHouses from '../../components/stores/StoreDetailWareHouses';
// import StoreDetailCategories from '../../components/stores/StoreDetailCategories';
import StoreDetailProducts from '../../components/stores/StoreDetailProducts';
import StoreDetailOrder from '../../components/stores/StoreDetailOrder';
import StoreDetailSectionTitle from '../../components/stores/StoreDetailSectionTitle';
import StoreDetailOrderFulfillmentCompleted from '../../components/stores/StoreDetailOrderFulfillmentCompleted';
import Promotions from '../../components/promotion/PromotionCard';

export default function StoreDetail() {
  // const navigate = useNavigate();
  const shopId = getPathByIndex(2);
  const { getStoreById, storeById } = useShopsStore((state) => state);

  useEffect(() => {
    const onSuccess = () => { };
    const onFail = (err) => {
      alerts.error(err);
    };
    getStoreById(shopId, onSuccess, onFail);
  }, []);

  return (
    <div className=" p-4 md:p-10">
      <PageTitle title="Chi tiết cửa hàng" showBack />

      <div className="mb-10">
        <StoreDetailBaseInformation store={storeById} />
      </div>

      <div className="mb-10">
        <StoreDetailSectionTitle title="Thông tin chi tiết" />
        <Row gutter={[30, 30]}>
          {/* <Col span={6}>
              <StoreDetailBrands shopId={shopId} />
            </Col>

            <Col span={6}>
              <StoreDetailCategories shopId={shopId} />
            </Col> */}

          <Col md={{ span: 6 }} span={12}>
            <StoreDetailProducts shopId={shopId} />
          </Col>

          <Col md={{ span: 6 }} span={12}>
            <StoreDetailOrder shopId={shopId} />
          </Col>

          <Col md={{ span: 6 }} span={12}>
            <StoreDetailOrderFulfillmentCompleted shopId={shopId} />
          </Col>

          <Col md={{ span: 6 }} span={12}>
            <Promotions shopId={shopId} />
          </Col>
        </Row>
      </div>

      <div className="mb-10">
        <StoreDetailWareHouses shopId={shopId} />
      </div>
    </div>
  );
}
