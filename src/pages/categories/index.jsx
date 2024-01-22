import { useEffect } from 'react'
import { Row, Col, Card } from 'antd'

import { useCategoriesStore } from '../../store/categoriesStore'
import { buildNestedArraysMenu, getPathByIndex } from '../../utils/index'
import { alerts } from '../../utils/alerts';

import PageTitle from '../../components/common/PageTitle';

const Categories = () => {
    const shopId = getPathByIndex(2)
    const { getCategoriesById, categoriesById } = useCategoriesStore((state) => state)
    const { category_list } = categoriesById

    const categories = category_list&&buildNestedArraysMenu(category_list, "0")

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

            <Row gutter={[30, 30]}>
                {categories?.length > 0 && categories?.map((category) => (
                    <Col key={category.key} span={8}>
                        <Card title={category.label} className='h-full'>
                            <ul>
                                {category.children?.map(item => (
                                    <li key={item.key} className='py-2 border-0 border-solid border-bottom-[1px]'>{item.label}</li>
                                ))}
                            </ul>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
 
export default Categories;