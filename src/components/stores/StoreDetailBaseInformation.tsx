import { Card, Row, Col } from 'antd';
import React from 'react';
import { formatDate } from '../../utils/date';
import StoreDetailSectionTitle from './StoreDetailSectionTitle';

function StoreDetailBaseInformation({ store }) {
  return (
    <>
      <StoreDetailSectionTitle title="Thông tin cơ bản" />
      <Card className="mb-5">
        <Row>
          <Col md={{ span: 12 }} span={24}>
            <Row className="items-center gap-2 justify-start mt-3 break-words flex-nowrap">
              <Col>Tên cửa hàng:</Col>
              <Col className="font-medium text-[#21409A]">{store.shop_name}</Col>
            </Row>
          </Col>

          <Col md={{ span: 12 }} span={24}>
            <Row className="items-center gap-2 justify-start mt-3 break-words flex-nowrap">
              <Col>Thời gian hết hạn:</Col>
              <Col className="font-medium text-[#21409A]">{formatDate(new Date(), 'DD/MM/YY, h:mm:ss a')}</Col>
            </Row>
          </Col>

          <Col md={{ span: 12 }} span={24}>
            <Row className="items-center gap-2 justify-start mt-3 break-words flex-nowrap">
              <Col>Mã cửa hàng:</Col>
              <Col className="font-medium text-[#21409A]">{store.shop_code}</Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default StoreDetailBaseInformation;
