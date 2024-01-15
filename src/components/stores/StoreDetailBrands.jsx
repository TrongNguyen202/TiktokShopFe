import { useEffect } from 'react'
import { Card } from 'antd'
import { Link } from 'react-router-dom';

import { useShopsBrand } from '../../store/brandStore'

import StoreDetailSectionTitle from './StoreDetailSectionTitle';

const StoreDetailBrands = ({shopId}) => {
  const { brands, getAllBrand } = useShopsBrand((state) => state)

    useEffect(() => {
      const onSuccess = (res) => {
        console.log(res)
      }
      const onFail = (err) => {
        alerts.error(err)
      }

      getAllBrand(shopId, onSuccess, onFail)
    }, [shopId])

    return (
        <>
            <Card className='cursor-pointer hover:shadow-md'>
                <StoreDetailSectionTitle title='Thương hiệu' count={brands?.brand_list?.length > 0 ? brands?.brand_list?.length : '0'} />
                <Link to={`/shops/${shopId}/brands`}>Xem thêm</Link>
            </Card>
        </>
    );
}
 
export default StoreDetailBrands;