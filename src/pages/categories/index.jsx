import { useEffect } from 'react'
import { Table, List, Card, Menu } from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import { useCategoriesStore } from '../../store/categoriesStore'
import { buildNestedArrays, buildNestedArraysMenu } from '../../utils/index'
import { alerts } from '../../utils/alerts';

import PageTitle from '../../components/common/PageTitle';

const Categories = ({shopId}) => {
    const { getCategoriesById, categoriesById } = useCategoriesStore((state) => state)
    const { category_list } = categoriesById

    const categories = buildNestedArraysMenu(category_list, "0")

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
        <div className='p-10 categories-list'>
            <PageTitle title='Danh sách danh mục' count={category_list?.length} showBack />

            {category_list?.length > 0 &&
                <Menu
                    onClick={() => {}}
                    mode="inline"
                    items={categories}
                    className='!border-none'
                />
            }
        </div>
    );
}
 
export default Categories;