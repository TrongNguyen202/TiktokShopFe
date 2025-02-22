import { useEffect } from 'react'
import { Col, Row, Card, Table, Badge, Divider, Button } from 'antd'
import { useLocation, useNavigate  } from 'react-router-dom'

import { formatDate } from '../../utils/date'
import { alerts } from '../../utils/alerts'
import { useShopsStore } from '../../store/shopsStore'
import { useProductsStore } from '../../store/productsStore'
import { useCategoriesStore } from '../../store/categoriesStore'
import { useWareHousesStore } from '../../store/warehousesStore'

import Loading from '../../components/loading/Index'

export default function StoreDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loadingById, getStoreById, storeById } = useShopsStore((state) => state)
  const { products, getAllProducts } = useProductsStore((state) => state)
  const { getCategoriesById, categoriesById } = useCategoriesStore((state) => state)
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore((state) => state)
  
  const store = location.state.store;

  useEffect(() => {
    const onSuccess = (res) => {
      console.log(res)
    }
    const onFail = (err) => {
      alerts.error(err)
    }
    getStoreById(store.id, onSuccess, onFail)
    getAllProducts(store.id, onSuccess, onFail)
    getCategoriesById(store.id, onSuccess, onFail)
    getWarehousesByShopId(store.id, onSuccess, onFail)
  }, [store.id])

  const columnCollection = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '100px'
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'local_display_name',
      key: 'local_display_name'
    }
  ]

  const columnProduct = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'SKU',
      dataIndex: ["skus", "id"],
      key: 'id',
      align: 'center',
      render: (_, record) => record?.skus?.map((item, index) => (
        <div key={index}>
          {index > 0 && <Divider/>}
          <p>{item.seller_sku}</p>
        </div>
      ))
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: ['skus', 'price'],
      key: 'price',
      align: 'center',
      render: (_, record) => record?.skus?.map((item, index) => (
        <div key={index}>
          {index > 0 && <Divider/>}
          <p><span>{item.price.currency}</span> {item.price.original_price}</p>
        </div>
      ))
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'satus',
      align: 'center',
    },
    {
      title: 'Khu vực bán',
      dataIndex: 'sale_regions',
      key: 'sale_regions',
      align: 'center',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'create_time',
      key: 'create_time',
      sorter: (a, b) => a.create_time - b.create_time,
      render: (create_time) => <span>{formatDate(create_time, 'DD/MM/YY, h:mm:ss a')}</span>,
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'update_time',
      key: 'update_time',
      sorter: (a, b) => a.update_time - b.update_time,
      render: (update_time) => <span>{formatDate(update_time, 'DD/MM/YY, h:mm:ss a')}</span>
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => {}}>Sửa</Button>
          <Button type="primary" onClick={() => (navigate(`/shops/${store.id}/products/${record.id}`))} className='ml-3'>Xem</Button>
        </>
      )
      ,
    }
  ]

  const renderStoreDetail = () => {
    if (loadingById) return <Loading />    
    const { store_code, date_expried, created_at, name, user, name_career, updated_at, address } = storeById
    const { category_list } = categoriesById
    const { warehouse_list } = warehousesById

    return (
      <div className='p-10'>
        <h2 className='text-[20px] font-semibold mb-10'>Thông tin cửa hàng</h2>

        <div className='mb-10'>
          <h3 className='text-[16px] font-semibold mb-3'>Thông tin cơ bản</h3>
          <Card className='mb-5'>
            <Row>
              <Col span={12}>
                <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                  <Col span={4}>Tên cửa hàng:</Col>
                  <Col className='font-medium text-[#21409A]'>{store.shop_name}</Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                  <Col span={4}>Hạn sử dụng:</Col>
                  <Col className='font-medium text-[#21409A]'>
                    {date_expried ? 
                      formatDate(new Date(date_expried), 'DD/MM/yyyy').toLocaleString()
                      :
                      formatDate(new Date(), 'DD/MM/yyyy').toLocaleString()
                    }
                  </Col>
                </Row>
              </Col>

              <Col span={12}>
                <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                  <Col span={4}>Mã cửa hàng:</Col>
                  <Col className='font-medium text-[#21409A]'>{store.shop_code}</Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                  <Col span={4}>Ngày tạo:</Col>
                  <Col className='font-medium text-[#21409A]'>
                    {date_expried ? 
                      formatDate(new Date(created_at), 'DD/MM/yyyy').toLocaleString()
                      :
                      formatDate(new Date(), 'DD/MM/yyyy').toLocaleString()
                    }
                  </Col>
                </Row>
              </Col>
              
              <Col span={12}>
                <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                  <Col span={4}>Địa chỉ:</Col>
                  <Col className='font-medium text-[#21409A]'>{address ? address : 'Hiện không có địa chỉ'}</Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                  <Col span={4}>Ngày cập nhật:</Col>
                  <Col className='font-medium text-[#21409A]'>
                    {updated_at ? 
                      formatDate(new Date(updated_at), 'DD/MM/yyyy').toLocaleString()
                      :
                      formatDate(new Date(), 'DD/MM/yyyy').toLocaleString()
                    }
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>          
        </div>

        <div className='mb-10'>
          <h3 className='text-[16px] font-semibold mb-3'>Thông tin kho</h3>
            <Row className='mb-5' gutter={30}>
              {warehouse_list?.map((warehouse) => (
                <Col key={warehouse.warehouse_id} span={12}>
                  <Card className='relative'>
                    {warehouse.is_default && <Badge count='Kho mặc định' style={{ backgroundColor: '#52c41a' }} className='absolute -top-[10px] left-[10px]' />}
                    <span></span>
                    <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                      <Col span={4}>Tên kho:</Col>
                      <Col className='font-medium text-[#21409A]'>{warehouse?.warehouse_name}</Col>
                    </Row>

                    <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                      <Col span={4}>Mã kho:</Col>
                      <Col className='font-medium text-[#21409A]'>{warehouse?.warehouse_id}</Col>
                    </Row>

                    <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                      <Col span={4}>Số điện thoại:</Col>
                      <Col className='font-medium text-[#21409A]'>{warehouse?.warehouse_address?.phone}</Col>
                    </Row>

                    <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                      <Col span={4}>Địa chỉ:</Col>
                      <Col className='font-medium text-[#21409A]'>{warehouse?.warehouse_address?.full_address}</Col>
                    </Row>

                    <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                      <Col span={4}>Quốc gia:</Col>
                      <Col className='font-medium text-[#21409A]'>{warehouse?.warehouse_address?.region}</Col>
                    </Row>

                    <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                      <Col span={4}>Tiểu bang/Tỉnh:</Col>
                      <Col className='font-medium text-[#21409A]'>{warehouse?.warehouse_address?.state}</Col>
                    </Row>

                    <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                      <Col span={4}>Mã zip/postal:</Col>
                      <Col className='font-medium text-[#21409A]'>{warehouse?.warehouse_address?.zipcode}</Col>
                    </Row>
                  </Card>          
                </Col>
              ))}
            </Row>
        </div>

        <div className='mb-10'>
          <h3 className='text-[16px] font-semibold mb-3'>
            Danh sách danh mục&nbsp;
            <span className='font-bold text-[#1677ff]'>({category_list?.length > 0 ? category_list?.length : 0})</span>
          </h3>
          <Table
            columns={columnCollection}
            scroll={{ x: 'calc(700px + 50%)', y: 350 }}
            size='middle'
            bordered
            dataSource={category_list && category_list?.length ? category_list : []}
          />
        </div>

        <div>
          <h3 className='text-[16px] font-semibold mb-3'>
            Danh sách sản phẩm&nbsp;
            <span className='font-bold text-[#1677ff]'>({products?.length > 0 ? products?.length : 0})</span>
          </h3>
          <Table
            columns={columnProduct}
            scroll={{ x: 'calc(700px + 50%)', y: 350 }}
            size='middle'
            bordered
            dataSource={products && products.length ? products : []}
          />
        </div>
      </div>
    )
  }

  return renderStoreDetail()
}
