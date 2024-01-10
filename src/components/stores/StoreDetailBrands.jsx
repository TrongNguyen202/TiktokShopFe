import { useEffect } from 'react'
import { Table, Tag } from 'antd'

import { useShopsBrand } from '../../store/brandStore'

import StoreDetailSectionTitle from './StoreDetailSectionTitle';

const StoreDetailBrands = ({shopId}) => {
  console.log('shop id: ', shopId)
  const { brands, getAllBrand } = useShopsBrand((state) => state)

    const columnBrand = [
        {
          title: 'Mã thương hiệu',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          width: '170px'
        },
        {
          title: 'Tên thương hiệu',
          dataIndex: 'name',
          key: 'name',
          render: (text) => (
            <p dangerouslySetInnerHTML={{ __html: text }} />
          )
        },
        {
          title: 'Trạng thái',
          dataIndex: 'authorized_status',
          key: 'authorized_status',
          width: '100px',
          align: 'center',
          render: (text) => (
            <span>{text === 1 ? <Tag color='success'>Đã uỷ quyền</Tag> : <Tag color='error'>Chưa uỷ quyền</Tag>}</span>
          )
        }
    ]

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
            <StoreDetailSectionTitle title='Danh sách thương hiệu' count={brands?.brand_list?.length} />
            <Table
              columns={columnBrand}
              scroll={{ x: 1199}}
              size='middle'
              bordered
              dataSource={brands?.brand_list?.length > 0 ? brands?.brand_list : []}
            />
        </>
    );
}
 
export default StoreDetailBrands;