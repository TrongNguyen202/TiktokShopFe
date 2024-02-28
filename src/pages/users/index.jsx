import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Space, Table, Tooltip, Button, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { useUsersStore } from '../../store/usersStore'

import PageTitle from '../../components/common/PageTitle'

const Users = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const { getShopByUser} = useUsersStore((state) => state)

  const handleUseEdit = (userId, shops) => {
    navigate(`/users/edit/${userId}`, { state: { shops }})
  }
  
  const handleUserDelete = (userId, shops) => {
    console.log(userId, shops);
  }

  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'user_name',
      key: 'user_name'
    },
    {
      title: 'Shops quản lý',
      key: 'shops',
      dataIndex: 'shops',
      render: (_, record) => record.shops.map((item, index) => (
        <>{index !== 0 && ', '}<Link to={`/shops/${item.id}`} key={index} target='_blank'>{item.name}</Link></>
      )),
    },
    {
      dataIndex: 'Actions',
      key: 'actions',
      width: '100px',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
            <Tooltip title="Sửa" color="blue" placement="left">
              <Button size="middle" icon={<EditOutlined />} onClick={() => handleUseEdit(record.user_id, record.shops)}/>
            </Tooltip>
            <Tooltip title="Xoá" color="blue" placement="right">
              <Button size="middle" icon={<DeleteOutlined />} onClick={handleUserDelete(record.user_id, record.shops)}/>
            </Tooltip>
        </Space>
      )
    }
  ]
    
  const onSearch = (e) => {
    const userFilter = data?.filter((item) => {
      return item.name.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setUserData(userFilter)
  }

  useEffect(() => {
    const onSuccess = (res) => {
      setUserData(res)
    }

    const onFail = (err) => {
      console.log(err);
    }

    getShopByUser(onSuccess, onFail)
  }, [])
    
  return (
      <div className="p-10">
        <PageTitle title={`Quản lý nhân viên phòng ${userData&&userData.group_name}`}/>
        <div className='mb-3 flex justify-between'>
            <Input.Search placeholder='Tìm kiếm theo tên...' onChange={onSearch} className='max-w-[700px]'/>
            <Button type='primary' onClick={() => console.log('click')}>Thêm user</Button>

        </div>
        <Table columns={columns} dataSource={userData&&userData?.users} bordered />
      </div>
  )
}
 
export default Users;