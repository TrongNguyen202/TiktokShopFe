import { useEffect } from 'react';
import { Col, Row } from 'antd';
import { useSellersStore } from '../../store/sellersStore';
import Loading from '../../components/loading';
import { formatDate } from '../../utils/date';

export default function SellerDetail({ id }) {
  const { loadingById, getSellersById, sellerById } = useSellersStore((state) => state);

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alert.error(err);
    };
    getSellersById(id, onSuccess, onFail);
  }, [id]);

  const renderSellerDetail = () => {
    if (loadingById) return <Loading />;
    if (!sellerById) return <p>Không có dữ liệu</p>;

    const {
      created_at: createdAt,
      name,
      phone_number: phoneNumber,
      updated_at: updatedAt,
      last_visit_time: lastVisitTime,
      email,
    } = sellerById;
    return (
      <>
        <p className="text-[20px] font-semibold">Thông tin gian hàng</p>
        <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={6} className="text-[#0e2482] font-medium">
            Tên:
          </Col>
          <Col>{name}</Col>
        </Row>
        <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={6} className="text-[#0e2482] font-medium">
            Số điện thoại:
          </Col>
          <Col>{phoneNumber}</Col>
        </Row>
        <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={6} className="text-[#0e2482] font-medium">
            Email:
          </Col>
          <Col>{email}</Col>
        </Row>
        <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={6} className="text-[#0e2482] font-medium">
            Ngày tạo:
          </Col>
          <Col>{formatDate(new Date(createdAt), ' HH:mm DD/MM/yyyy').toLocaleString()}</Col>
        </Row>
        <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={6} className="text-[#0e2482] font-medium">
            Ngày cập nhật:
          </Col>
          <Col>{formatDate(new Date(updatedAt), ' HH:mm DD/MM/yyyy').toLocaleString()}</Col>
        </Row>
        <Row className="items-center gap-[4px] justify-start mt-3 break-words flex-nowrap">
          <Col span={6} className="text-[#0e2482] font-medium">
            Ngày cập nhật:
          </Col>
          <Col>{formatDate(new Date(lastVisitTime), ' HH:mm DD/MM/yyyy').toLocaleString()}</Col>
        </Row>
      </>
    );
  };

  return renderSellerDetail();
}
