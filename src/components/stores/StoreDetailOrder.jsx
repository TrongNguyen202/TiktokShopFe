import { useEffect } from 'react'
import { Card } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { useShopsOrder } from '../../store/ordersStore'

import StoreDetailSectionTitle from '../../components/stores/StoreDetailSectionTitle'

const StoreDetailOrder = ({shopId}) => {
    const navigate = useNavigate();
    const { orders, getAllOrders } = useShopsOrder((state) => state)

    useEffect(() => {
        const onSuccess = (res) => {
        }

        const onFail = (err) => {
            console.log(err);
        }
        getAllOrders(shopId, onSuccess, onFail)
    }, [])

    return (
        <Card className='cursor-pointer hover:shadow-md' onClick={() => navigate(`/shops/${shopId}/orders`)}>
            <StoreDetailSectionTitle title='Đơn hàng' count={orders?.length > 0 ? orders?.length : '0'} isShowButton />
            <Link to={`/shops/${shopId}/orders`}>Xem thêm</Link>
        </Card>
    );
}
 
export default StoreDetailOrder;