import { useEffect } from 'react'
import { Card } from 'antd'
import { Link } from 'react-router-dom'

import { alerts } from '../../utils/alerts'
import { useShopsBrand } from '../../store/brandStore'

import StoreDetailSectionTitle from '../../components/stores/StoreDetailSectionTitle'

const StoreDetailOrder = ({shopId}) => {
    const { brands, getAllBrand } = useShopsBrand((state) => state)

    useEffect(() => {
        const onSuccess = (res) => {
            console.log(res)
        }

        const onFail = (res) => {
            alerts.error(res)
        }
        getAllBrand(shopId, onSuccess, onFail)
    }, [])

    return (
        <Card className='cursor-pointer hover:shadow-md'>
            <StoreDetailSectionTitle title='Sản phẩm' count={brands?.length > 0 ? brands?.length : '0'} isShowButton />
            <Link to={`/shops/${shopId}/orders`}>Xem thêm</Link>
        </Card>
    );
}
 
export default StoreDetailOrder;