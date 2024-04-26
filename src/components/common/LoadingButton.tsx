import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

function LoadingButton({ loading }: { loading: boolean }) {
  return (
    loading && (
      <Spin
        indicator={
          <LoadingOutlined
            className="text-white ml-3"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        }
      />
    )
  );
}

export default LoadingButton;
