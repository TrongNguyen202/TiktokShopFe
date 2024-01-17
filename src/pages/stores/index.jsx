import { useEffect, useState } from 'react'
import { EyeOutlined } from '@ant-design/icons'
import { Button, Drawer, Layout, Modal, Space, Table } from 'antd'
import Search from 'antd/es/transfer/search'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useShopsStore } from '../../store/shopsStore'
import { alerts } from '../../utils/alerts'
import StoresDetail from './StoreDetail'

import StoreAuthorization from './StoreAuthorization'
import StoreForm from './StoreForm'

const Stores = () => {
  const navigate = useNavigate()
  const { stores, loading, getAllStores } = useShopsStore((state) => state)
  const [isOpenDrawer, setOpenDrawer] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [isShowModal, setShowModal] = useState(false)
  const [searchParams] = useSearchParams()
  const app_key = searchParams.get('app_key')
  const code = searchParams.get('code')

  const storesTable = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (store1, store2) => +store1.id - +store2.id,
    },
    {
      title: 'Tên cửa hàng',
      dataIndex: 'shop_name',
      key: 'shop_name',
      render: (name, store) => (
        <p
          className='text-[#0e2482] font-medium cursor-pointer'
          onClick={() => {
            navigate(`/shops/${store.id}`, { state: { store }})
          }}
        >
          {name}
        </p>
      ),
    },
    {
      title: 'Shop code',
      dataIndex: 'shop_code',
      key: 'shop_code',
      render: (code, seller) => (
        <p
          className='text-[#0e2482] font-medium cursor-pointer'
        >
          {code}
        </p>
      ),
    },
    {
      title: 'Grant type',
      dataIndex: 'grand_type',
      key: 'grand_type',
    },
    {
      title: 'access_token',
      dataIndex: 'access_token',
      key: 'access_token',
    },
    {
      title: 'refresh_token',
      dataIndex: 'refresh_token',
      key: 'refresh_token',
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_, store) => {
        return (
          <Space size='middle'>
            <Button
              size='small'
              icon={<EyeOutlined />}
              onClick={() => {
                setOpenDrawer(true)
                setSelectedId(store.id)
              }}
            >
              Gia hạn
            </Button>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    const onSuccess = (res) => {
      console.log('res: ', res)
    }
    const onFail = (err) => {
      alerts.error(err)
    }

    getAllStores(onSuccess, onFail)
    
    if (app_key && code) setShowModal(true)
    else setShowModal(false)
  }, [app_key, code])

  return (
    <Layout.Content className='mt-4 px-5'>
      <p className='my-5 font-semibold text-[20px]'>Danh sách cửa hàng</p>
      <div className='mb-4 flex justify-between'>
        <div className='w-[400px]'>
          <Search placeholder='Tìm kiếm...' name='search' />
        </div>
        <Button type='primary' onClick={() => setShowModal(true)}>
          Thêm cửa hàng
        </Button>
      </div>

      <Table
        columns={storesTable}
        scroll={{ x: true }}
        size='middle'
        bordered
        dataSource={stores && stores.length ? stores : []}
        loading={loading}
      />

      <Drawer
        title='Thông tin cửa hàng'
        placement='right'
        width='35vw'
        onClose={() => setOpenDrawer(false)}
        open={isOpenDrawer}
      >
        <StoresDetail id={selectedId} />
      </Drawer>

      <Modal
        open={isShowModal}
        onCancel={() => {
          setShowModal(false)
        }}
        centered
        footer={null}
        width={600}
      >
        {!app_key && !code ? <StoreAuthorization /> : <StoreForm app_key={app_key} code={code} />}
        
      </Modal>
    </Layout.Content>
  )
}

export default Stores
