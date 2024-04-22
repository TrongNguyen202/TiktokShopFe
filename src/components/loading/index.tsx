import { Spin } from 'antd';
import React from 'react';

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center p-10">
      <Spin />
    </div>
  );
}
