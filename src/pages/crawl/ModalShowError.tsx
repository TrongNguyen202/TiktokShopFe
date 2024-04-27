import { Modal } from 'antd';
import React from 'react';

type DetailMessage = {
  message: string;
  data: any;
};

type ErrorItem = {
  status: string;
  title: string;
  order_in_excel: string;
  detail: DetailMessage;
};

type ModalErrorInfo = {
  isShow: boolean;
  title: string;
  data: ErrorItem[];
};

export default function ModalShowError({
  setModalErrorInfo,
  modalErrorInfo,
}: {
  setModalErrorInfo: (value: React.SetStateAction<any>) => void;
  modalErrorInfo: ModalErrorInfo;
}) {
  const errorResponse = modalErrorInfo.data.filter((item: ErrorItem) => item.status === 'error');

  const renderDetailMessage = (data: DetailMessage) => {
    if (Array.isArray(data)) {
      return 'All photos are defective!';
    }
    if (data.message === 'required qualification is missing') {
      return 'required qualification is missing (Wrong category, please choose another category)';
    }
    return data.message;
  };

  const renderError = () => {
    if (!errorResponse || !errorResponse.length) return null;
    return errorResponse.map((item: ErrorItem, index: number) => {
      const { detail, title, order_in_excel: orderInExcel } = item;
      return (
        <div key={index} className="text-[16px] bg-[#F0EBF8] mb-5 p-5 rounded-md">
          <div className="flex gap-2">
            <span className="block w-[150px] shrink-0">Vị trí sản phẩm:</span> <span>{orderInExcel}</span>
          </div>
          <div className="flex gap-2 line-clamp-1">
            <span className="block w-[150px] shrink-0">Tên sản phẩm:</span> <p className="line-clamp-1">{title}</p>
          </div>
          <div className="flex gap-2">
            <span className="block w-[150px] shrink-0">Mô tả:</span> <span>{detail.message}</span>
          </div>
          <div className="flex gap-2">
            <span className="block w-[150px] shrink-0">chi tiết lỗi:</span>{' '}
            <span className="font-semibold text-red-400">{renderDetailMessage(detail.data)}</span>
          </div>
        </div>
      );
    });
  };
  return (
    <Modal
      // open="true"
      open={modalErrorInfo.isShow}
      title={modalErrorInfo.title}
      footer={null}
      width={1000}
      onCancel={() => setModalErrorInfo({ isShow: false })}
      zIndex={1001}
    >
      <p className="text-[20px] font-semibold mb-3">Danh sách sản phẩm bị lỗi</p>
      {renderError()}
    </Modal>
  );
}
