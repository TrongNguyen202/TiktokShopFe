import { Link } from 'react-router-dom';

import { constants as c } from '../../constants';

function OrdersAddImageDesignByExcel() {
  return (
    <div className="text-center">
      <p className="mt-1">
        Hãy thêm <span className="font-bold">Image 1 (front)</span> và <span className="font-bold">Image 2 (back)</span>{' '}
        trên Google Sheet: &nbsp;
        <Link to={c.DESIGN_SKU_FILES_GOOGLE_SHEET} className="underline" target="_blank">
          Design sku-files
        </Link>
      </p>
    </div>
  );
}

export default OrdersAddImageDesignByExcel;
