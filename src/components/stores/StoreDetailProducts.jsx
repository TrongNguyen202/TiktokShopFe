import { useEffect } from 'react'
import { Card } from 'antd'
import { useNavigate, Link } from 'react-router-dom'

import { alerts } from '../../utils/alerts'

import { useProductsStore } from '../../store/productsStore'

import StoreDetailSectionTitle from './StoreDetailSectionTitle';


const StoreDetailProducts = ({shopId}) => {
    const navigate = useNavigate();
    const { products, getAllProducts } = useProductsStore((state) => state)

    useEffect(() => {
      const onSuccess = (res) => {
        }
        const onFail = (err) => {
          alerts.error(err)
        }
        
        getAllProducts(shopId, onSuccess, onFail)
      }, [shopId])
    
    return (
        <>
        <Card className='cursor-pointer hover:shadow-md' onClick={() => navigate(`/shops/${shopId}/products`)}>
                <StoreDetailSectionTitle title='Sản phẩm' count={products?.length > 0 ? products?.length : '0'} isShowButton />
                <Link to={`/shops/${shopId}/products`}>Xem thêm</Link>
            </Card>
        </>
    );
}
 
export default StoreDetailProducts;