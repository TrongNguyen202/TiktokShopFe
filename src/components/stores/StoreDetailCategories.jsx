import { useEffect } from 'react'
import { Table } from 'antd'

import { useCategoriesStore } from '../../store/categoriesStore'

import StoreDetailSectionTitle from './StoreDetailSectionTitle';

const StoreDetailCategories = ({shopId}) => {
    const { getCategoriesById, categoriesById } = useCategoriesStore((state) => state)
    const { category_list } = categoriesById

    const columnCollection = [
        {
            title: 'Mã danh mục',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: '170px'
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'local_display_name',
            key: 'local_display_name'
        }
    ]

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
        <>
            <StoreDetailSectionTitle title='Danh sách danh mục' count={category_list?.length} />
            <Table
                columns={columnCollection}
                scroll={{ x: 1199}}
                size='middle'
                bordered
                dataSource={category_list?.length ? category_list : []}
            />
        </>
    );
}
 
export default StoreDetailCategories;