import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useProductsStore } from '../../store/productsStore';

type PageTitleProps = {
  title: string;
  showBack?: boolean;
  count?: number;
};

function PageTitle({ title, showBack, count }: PageTitleProps) {
  const navigate = useNavigate();
  const { clearProducts } = useProductsStore((state) => state);

  const BackClearProductZustand = () => {
    navigate(-1);
    clearProducts();
  };

  return (
    <div className="text-[20px] font-semibold mb-5">
      {showBack && (
        <ArrowLeftOutlined onClick={() => BackClearProductZustand()} className="inline-block align-middle mr-5" />
      )}
      <h1 className="inline-block align-middle">
        {title}
        {count && <span className="text-[#214093]"> ({count})</span>}
      </h1>
    </div>
  );
}

export default PageTitle;

