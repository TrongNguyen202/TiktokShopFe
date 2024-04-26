import { Button, Row } from 'antd';
import React from 'react';

type SectionTitleProps = {
  title: string;
  count?: number;
  isShowButton?: boolean;
  buttonLabel?: string;
  handleButton?: () => void;
};

function SectionTitle({ title, count, isShowButton, buttonLabel, handleButton }: SectionTitleProps) {
  return (
    <Row justify="space-between" className="mb-3">
      <h2 className="text-[20px] font-semibold">
        {title}&nbsp;
        {count && <span className="font-bold text-[#214093]">({count > 0 ? count : 0})</span>}
      </h2>
      {isShowButton && buttonLabel && handleButton && (
        <Button type="primary" onClick={handleButton}>
          {buttonLabel}
        </Button>
      )}
    </Row>
  );
}

export default SectionTitle;
