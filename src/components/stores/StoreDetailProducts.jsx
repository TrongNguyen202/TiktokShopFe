import { useEffect } from 'react'
import { Card } from 'antd'
import { useNavigate, Link } from 'react-router-dom'

import { alerts } from '../../utils/alerts'

import { useProductsStore } from '../../store/productsStore'

import StoreDetailSectionTitle from './StoreDetailSectionTitle';


const StoreDetailProducts = ({shopId}) => {
    const navigate = useNavigate();
    const { products, getAllProducts,infoTable } = useProductsStore((state) => state)

    useEffect(() => {
      const onSuccess = (res) => {
        }
        const onFail = (err) => {
          alerts.error(err)
        }
        
        getAllProducts(shopId,1, onSuccess, onFail)
      }, [shopId])

      
  console.log('infoTable: ', infoTable);
    
    return (
        <>
        <Card className='cursor-pointer hover:shadow-md' onClick={() => navigate(`/shops/${shopId}/products`)}>
                <StoreDetailSectionTitle title='Sản phẩm' count={infoTable?.data?.total > 0 ? infoTable?.data?.total: '0'} isShowButton />
                <Link to={`/shops/${shopId}/products`}>Xem thêm</Link>
            </Card>
        </>
    );
}
 
export default StoreDetailProducts;