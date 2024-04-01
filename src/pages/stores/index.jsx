import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Input, Layout, Modal, Popconfirm, Table, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { constants as c } from '../../constants';
import { useShopsStore } from '../../store/shopsStore';

import StoreAuthorization from './StoreAuthorization';
import StoreForm from './StoreForm';

const { Search } = Input;
function Stores() {
  const navigate = useNavigate();
  const [isShowModal, setShowModal] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { stores, loading, getAllStores, refreshToken, updateStore } = useShopsStore((state) => state);
  const [searchParams] = useSearchParams();
  const app_key = searchParams.get('app_key');
  const code = searchParams.get('code');
  const [storeSelected, setStoreSelected] = useState({});

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

  const deleteShop = (store) => {
    const onSuccess = () => {
      messageApi.open({
        type: 'success',
        content: 'Xoá cửa hàng thành công',
      });
      setShopData(shopData.filter((item) => item.id !== store.id));
    };
    const onFail = (err) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
    };
    updateStore(
      store.id,
      {
        is_active: false,
        access_token: store.access_token,
        auth_code: store.auth_code,
        shop_name: store.shop_name,
      },
      onSuccess,
      onFail,
    );
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
        <Link
          to={`/shops/${store.id}`}
          key={store.id}
          title={store.name}
          className="text-[#0e2482] font-medium cursor-pointer line-clamp-1"
        >
          {name}
        </Link>
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
    {
      title: '',
      key: 'action',
      // fixed: 'right',
      align: 'center',
      render: (_, store) => (
        <div className="flex gap-2 justify-center">
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleRefreshToken(store.id)}>
            Gia hạn
          </Button>
          <Tooltip title="Sửa" color="blue">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setShowModal(true);
                setStoreSelected(store);
              }}
            />
          </Tooltip>
          <Popconfirm
            placement="topRight"
            title="Bạn có thực sự muốn xoá shop này?"
            onConfirm={() => deleteShop(store)}
          >
            <Tooltip title="Xóa" color="red">
              <Button size="small" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </div>
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

  useEffect(() => {
    setShopData(stores);
  }, [stores]);

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
          setStoreSelected({});
        }}
        centered
        footer={null}
        width={600}
      >
        {!app_key && !code && !storeSelected?.id ? (
          <StoreAuthorization />
        ) : (
          <StoreForm app_key={app_key} code={code} storeSelected={storeSelected} setShowModal={setShowModal} />
        )}
      </Modal>
    </Layout.Content>
  );
}

export default Stores;
