import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Space, Table, Tag, Tooltip, Button, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      render: (text) => <Tag color='red' >{text.toUpperCase()}</Tag>,
    },
    {
        title: 'Accounts',
        key: 'accounts',
        dataIndex: 'accounts',
        render: (text) => text.map((item, index) => (
            <>{index !== 0 && ', '}<Link to={`/shops/${item.id}`} key={index} target='_blank'>{item.shop_name}</Link></>
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
                <Button size="middle" icon={<EditOutlined />} onClick={() => handleProductEdit(record.id)}/>
              </Tooltip>
              <Tooltip title="Xoá" color="blue" placement="right">
                <Button size="middle" icon={<DeleteOutlined />} onClick={() => handleProductDetail(record.id)}/>
              </Tooltip>
          </Space>
        )
    }
]

const Users = () => {
    const [userData, setUserData] = useState([])
    const data = [
        {
          key: '1',
          name: 'John Brown',
          email: '123@gmail.com',
          phone: '0956781234',
          role: 'sale',
          accounts: [
            {id: 1, shop_name: 'Shop 1'},
            {id: 2, shop_name: 'Shop 2'}
          ]
        },
        {
          key: '2',
          name: 'Jim Green',
          email: 'Jim123@gmail.com',
          phone: '0912345678',
          role: 'sale',
          accounts: [
            {id: 1, shop_name: 'Shop 1'},
            {id: 3, shop_name: 'Shop 3'}
          ]
        }
    ]
    
    const onSearch = (e) => {
        const userFilter = data?.filter((item) => {
          return item.name.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setUserData(userFilter)
    }

    useEffect(() => {
        setUserData(data)
    }, [])
    
    return (
        <div className="p-10">
            <div className='mb-3 flex justify-between'>
                <Input.Search placeholder='Tìm kiếm theo tên...' onChange={onSearch} className='max-w-[700px]'/>
                <Button type='primary' onClick={() => console.log('click')}>Thêm user</Button>

            </div>
            <Table columns={columns} dataSource={userData} bordered />
        </div>
    )
}
 
export default Users;