import { useEffect, useState } from 'react'
import { CopyOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Input, Layout, Modal, Space, Table, message } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useShopsStore } from '../../store/shopsStore'

import StoreAuthorization from './StoreAuthorization'
import StoreForm from './StoreForm'

const { Search } = Input;
const Stores = () => {
  const navigate = useNavigate()
  const [isShowModal, setShowModal] = useState(false)
  const [shopData, setShopData] = useState([])
  const { stores, loading, getAllStores, refreshToken } = useShopsStore((state) => state)
  const [searchParams] = useSearchParams()
  const app_key = searchParams.get('app_key')
  const code = searchParams.get('code')


  const copyToClipboard = (token) => {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        message.success("Đã sao chép");
      })
      .catch(() => {
        message.error("Sao chép thất bại");
      });
  };

  const handleRefreshToken = (shopId) => {
    refreshToken(shopId, (res) => console.log(res), (err) => console.log(err))
  }

  const storesTable = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      align: 'center',
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
      render: (code, store) => (
        <p
          className='text-[#0e2482] font-medium cursor-pointer'
          onClick={() => {
            navigate(`/shops/${store.id}`, { state: { store }})
          }}
        >
          {code}
        </p>
      ),
    },
    {
      title: 'access_token',
      dataIndex: 'access_token',
      key: 'access_token',
      width: 350,
      render: (token) => (
        <p className="w-[350px] flex justify-between items-center">
          <p className="w-[300px]">{token}</p> <CopyOutlined className="cursor-pointer" onClick={() => copyToClipboard(token)}/>
        </p>
      ),
    },
    {
      title: 'refresh_token',
      dataIndex: 'refresh_token',
      key: 'refresh_token',
      width: 350,
      render: (token) => (
        <p className="w-[300px]">
          {token}
        </p>
      ),
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_, store) => <Button size='small' icon={<EyeOutlined />} onClick={() => handleRefreshToken(store.id)}>Gia hạn</Button>,
    },
  ]

  const onSearch = (e) => {
    const storesFilter = stores?.filter((item) => {
      return item.shop_name.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setShopData(storesFilter)
  }

  useEffect(() => {
    const onSuccess = (res) => {
      if (res.length > 0) {
        setShopData(res);
      }
    }
    const onFail = (err) => {
      console.log(err);
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
          <Search placeholder='Tìm kiếm theo tên...' onChange={onSearch}/>
        </div>
        <Button type='primary' onClick={() => setShowModal(true)}>Thêm cửa hàng</Button>
      </div>

      <Table
        columns={storesTable}
        scroll={{ x: true }}
        size='middle'
        bordered
        dataSource={shopData && shopData.length ? shopData : []}
        loading={loading}
      />

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
