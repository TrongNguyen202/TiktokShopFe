import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Space, Table, Tooltip, Button, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { useUsersStore } from '../../store/usersStore'

import PageTitle from '../../components/common/PageTitle'
import ModalUserForm from './ModalUserForm';

const Users = () => {
  const { getShopByUser, shopsByUser } = useUsersStore((state) => state)

  const [userData, setUserData] = useState([])
  const [isShowModal, setIsShowModal] = useState(false)
  const [userSelected, setUserSelected] = useState({})

  const handleUseEdit = (record) => {
    setUserSelected(record)
    setIsShowModal(true)
  // navigate(`/users/edit/${record.user_id}`, { state: { shops: record.shops } })
  }
  
  const handleUserDelete = (userId, shops) => {
    console.log(userId, shops);
  }

  const handleAddUser = () => {
    setUserSelected({})
    setIsShowModal(true)
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
            <Button size="middle" icon={<EditOutlined />} onClick={() => handleUseEdit(record)} />
            </Tooltip>
            <Tooltip title="Xoá" color="blue" placement="right">
            <Button size="middle" icon={<DeleteOutlined />} onClick={() => handleUserDelete(record.user_id, record.shops)} />
            </Tooltip>
        </Space>
      )
    }
  ]
    
  const onSearch = (e) => {
    const userFilter = shopsByUser?.users?.filter((item) => {
      return item.user_name.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setUserData((prevState) => ({ ...prevState, users: userFilter }))
  }

  useEffect(() => {
    getShopByUser()
  }, [])

  useEffect(() => {
    setUserData(shopsByUser)
  }, [JSON.stringify(shopsByUser)])

  return (
    <div className="p-10">
      <PageTitle
        title={`Quản lý nhân viên phòng ${userData && userData.group_name}`}
      />
      <div className="mb-3 flex justify-between">
        <Input.Search
          placeholder="Tìm kiếm theo tên..."
          onChange={onSearch}
          className="max-w-[700px]"
        />
        <Button type="primary" onClick={handleAddUser}>
          Thêm user
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={userData ? userData.users : []}
        bordered
      />
      {isShowModal && (
        <ModalUserForm
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
          userSelected={userSelected}
        />
      )}
    </div>
  );
}
 
export default Users;