import { Row, Button } from 'antd';
import React from 'react';

type StoreDetailSectionTitleProps = {
  title: string;
  count?: number;
  isShowButton?: boolean;
  buttonLabel?: string;
  handleButton?: () => void;
};
function StoreDetailSectionTitle({
  title,
  count,
  isShowButton,
  buttonLabel,
  handleButton,
}: StoreDetailSectionTitleProps) {
  return (
    <Row justify="space-between" className="mb-3">
      <h3 className="text-[16px] font-semibold">
        {title}&nbsp;
        {count && <span className="font-bold text-[#214093]">({count > 0 ? count : 0})</span>}
      </h3>
      {isShowButton && buttonLabel && handleButton && (
        <Button type="primary" onClick={handleButton}>
          {buttonLabel}
        </Button>
      )}
    </Row>
  );
}

export default StoreDetailSectionTitle;
