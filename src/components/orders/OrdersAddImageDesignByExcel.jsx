import { Link } from 'react-router-dom';

import { constants as c } from '../../constants'

const OrdersAddImageDesignByExcel = () => {
    return (
        <div className='text-center'>
            <p className='mt-1'>Trên Google Sheet: &nbsp;
                <Link to={c.DESIGN_SKU_FILES_GOOGLE_SHEET} className='underline' target='_blank'>Design sku-files</Link>
            </p>
        </div>
    );
}
 
export default OrdersAddImageDesignByExcel;