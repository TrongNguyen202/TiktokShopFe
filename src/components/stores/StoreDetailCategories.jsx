import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Card } from 'antd'

import { useCategoriesStore } from '../../store/categoriesStore'

import StoreDetailSectionTitle from './StoreDetailSectionTitle';

const StoreDetailCategories = ({shopId}) => {
    const { getCategoriesById, categoriesById } = useCategoriesStore((state) => state)
    const { category_list } = categoriesById

    useEffect(() => {
        const onSuccess = (res) => {
          console.log(res)
        }
        const onFail = (err) => {
          alerts.error(err)
        }

        getCategoriesById(shopId, onSuccess, onFail)
    }, [shopId])

    return (
        <Card className='cursor-pointer hover:shadow-md'>
            <StoreDetailSectionTitle title='Danh mục' count={category_list?.length > 0 ? category_list?.length : '0'} />
            <Link to={`/shops/${shopId}/categories`}>Xem thêm</Link>
        </Card>
    );
}
 
export default StoreDetailCategories;