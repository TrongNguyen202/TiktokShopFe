import { ArrowLeftOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContentHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <p className="mt-4 text-[20px] font-semibold flex gap-3 items-center">
      <ArrowLeftOutlined onClick={() => navigate(-1)} />
      {title}
    </p>
  );
}

ContentHeader.propTypes = {
  title: PropTypes.string,
};
