import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Input, Popconfirm, Row, Space, Table, Tag, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useUsersStore } from '../../store/usersStore';

import PageTitle from '../../components/common/PageTitle';
import ModalUserForm from './ModalUserForm';

function Users() {
  const { getShopByUser, shopsByUser, updateUser } = useUsersStore((state) => state);

  const [userData, setUserData] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [userSelected, setUserSelected] = useState({});

  const handleUseEdit = (record) => {
    setUserSelected(record);
    setIsShowModal(true);
  };

  const handleUserDelete = (userId) => {
    const dataUpdate = {
      user_id: userId,
      is_active: false,
    };
    const onSuccess = (res) => {
      getShopByUser();
      if (res) {
        message.open({
          type: 'success',
          content: 'Thành công',
        });
        setIsShowModal(false);
      }
    };

    const onFail = (err) => {
      message.open({
        type: 'error',
        content: err,
      });
    };

    updateUser(dataUpdate, onSuccess, onFail);
  };

  const handleAddUser = () => {
    setUserSelected({});
    setIsShowModal(true);
  };

  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Shops quản lý',
      key: 'shops',
      dataIndex: 'shops',
      render: (_, record) => (
        <Row key={record.id} gutter={[8, 8]}>
          {record.shops.map((item, index) => (
            <Link
              to={`/shops/${item.id}`}
              key={index}
              target="_blank"
              title={item.name}
              className="text-[#0e2482] font-medium cursor-pointer line-clamp-1"
            >
              <Tag color="blue">
                {index + 1}. {item.name}
              </Tag>
            </Link>
          ))}
        </Row>
      ),
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'user_code',
      key: 'user_code',
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
          <Tooltip title="Xoá" color="blue" placement="top">
            <Popconfirm
              title="Bạn có chắc muốn xoá người dùng này?"
              onConfirm={() => handleUserDelete(record.user_id)}
              placement="left"
            >
              <Button size="middle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onSearch = (e) => {
    const userFilter = shopsByUser?.users?.filter((item) => {
      return item.user_name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setUserData((prevState) => ({ ...prevState, users: userFilter }));
  };

  useEffect(() => {
    getShopByUser();
  }, []);

  useEffect(() => {
    setUserData(shopsByUser);
  }, [JSON.stringify(shopsByUser)]);

  return (
    <div className="p-10">
      <PageTitle title={`Quản lý nhân viên phòng ${userData && userData.group_name}`} />
      <div className="mb-3 flex justify-between">
        <Input.Search placeholder="Tìm kiếm theo tên..." onChange={onSearch} className="max-w-[700px]" />
        <Button type="primary" onClick={handleAddUser}>
          Thêm user
        </Button>
      </div>
      <Table columns={columns} dataSource={userData ? userData.users : []} bordered />
      {isShowModal && (
        <ModalUserForm isShowModal={isShowModal} setIsShowModal={setIsShowModal} userSelected={userSelected} />
      )}
    </div>
  );
}

export default Users;