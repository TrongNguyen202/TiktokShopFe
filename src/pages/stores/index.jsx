import { useEffect, useState } from 'react';
import { CopyOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Input, Layout, Modal, Table, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useShopsStore } from '../../store/shopsStore';
import { constants as c } from '../../constants';

import StoreAuthorization from './StoreAuthorization';
import StoreForm from './StoreForm';

const { Search } = Input;
function Stores() {
  const navigate = useNavigate();
  const [isShowModal, setShowModal] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { stores, loading, getAllStores, refreshToken } = useShopsStore((state) => state);
  const [searchParams] = useSearchParams();
  const app_key = searchParams.get('app_key');
  const code = searchParams.get('code');

  const copyToClipboard = (content, key) => {
    const tempInput = document.createElement('input');
    tempInput.value = content;
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    try {
      document.execCommand('copy');
      message.success(`Đã sao chép ${key}`);
    } catch (err) {
      message.error(`${err} Sao chép ${key} thất bại!`);
    }

    document.body.removeChild(tempInput);
  };

  const handleRefreshToken = (shopId) => {
    const onSuccess = (res) => {
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Gia hạn cửa hàng thành công',
        });
      }
    };
    refreshToken(shopId, onSuccess, (err) => console.log(err));
  };

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
          className="text-[#0e2482] font-medium cursor-pointer"
          onClick={() => {
            navigate(`/shops/${store.id}`, { state: { store } });
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
          className="text-[#0e2482] font-medium cursor-pointer"
          onClick={() => {
            navigate(`/shops/${store.id}`, { state: { store } });
          }}
        >
          {code}
        </p>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    // {
    //   title: 'access_token',
    //   dataIndex: 'access_token',
    //   key: 'access_token',
    //   width: 350,
    //   render: (token) => (
    //     <p className="w-[350px] flex justify-between items-center">
    //       <p className="w-[300px]">{token}</p> <CopyOutlined className="cursor-pointer" onClick={() => copyToClipboard(token, 'access_token')}/>
    //     </p>
    //   ),
    // },
    // {
    //   title: 'refresh_token',
    //   dataIndex: 'refresh_token',
    //   key: 'refresh_token',
    //   width: 350,
    //   render: (token) => (
    //     <p className="w-[300px]">
    //       {token}
    //     </p>
    //   ),
    // },
    {
      title: '',
      key: 'action',
      // fixed: 'right',
      align: 'center',
      render: (_, store) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => handleRefreshToken(store.id)}>
          Gia hạn
        </Button>
      ),
    },
  ];

  const onSearch = (e) => {
    const storesFilter = stores?.filter((item) => {
      return item.shop_name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setShopData(storesFilter);
  };

  const handleAddStore = () => {
    setShowModal(true);
    copyToClipboard(c.LINK_STORE_CODE, 'link uỷ quyền');
  };

  useEffect(() => {
    const onSuccess = (res) => {
      if (res.length > 0) {
        setShopData(res);
      }
    };
    const onFail = (err) => {
      console.log(err);
    };

    getAllStores(onSuccess, onFail);

    if (app_key && code) setShowModal(true);
    else setShowModal(false);
  }, [app_key, code]);

  return (
    <Layout.Content className="mt-4 px-5">
      {contextHolder}
      <p className="my-5 font-semibold text-[20px]">Danh sách cửa hàng</p>
      <div className="mb-4 flex justify-between">
        <div className="w-[400px] mr-3">
          <Search placeholder="Tìm kiếm theo tên..." onChange={onSearch} />
        </div>
        <Button type="primary" onClick={() => handleAddStore()}>
          Thêm cửa hàng
        </Button>
      </div>

      <Table
        columns={storesTable}
        scroll={{ x: true }}
        size="middle"
        bordered
        dataSource={shopData && shopData.length ? shopData.sort((a, b) => a.id - b.id) : []}
        loading={loading}
      />

      <Modal
        open={isShowModal}
        onCancel={() => {
          setShowModal(false);
        }}
        centered
        footer={null}
        width={600}
      >
        {!app_key && !code ? <StoreAuthorization /> : <StoreForm app_key={app_key} code={code} />}
      </Modal>
    </Layout.Content>
  );
}

export default Stores;
