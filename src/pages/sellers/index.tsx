import { Drawer, Layout, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import TableHeader from '../../components/table-header';
import { useSellersStore } from '../../store/sellersStore';
import { formatDate } from '../../utils/date';
import SellerDetail from './SellerDetail';

type SellerType = {
  id: number;
  name: string;
  phone_number: string;
  stores: any[];
  created_at: string;
  updated_at: string;
  last_visit_time: string;
};

export default function Sellers() {
  const { sellers, loading, getAllSellers, searchSeller } = useSellersStore((state) => state);

  const [isOpenDrawer, setOpenDrawer] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    search: '',
    begin_date_register: '',
    end_date_register: '',
    begin_last_visit_time: '',
    end_last_visit_time: '',
  });

  const sellersTable: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (seller1: SellerType, seller2: SellerType) => +seller1.id - +seller2.id,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (seller1: SellerType, seller2: SellerType) => (seller1.name || '').localeCompare(seller2.name || ''),
      fixed: 'left',
      render: (name: string, seller: SellerType) => (
        <p
          className="text-[#0e2482] font-medium cursor-pointer"
          onClick={() => {
            setOpenDrawer(true);
            setSelectedId(seller.id);
          }}
        >
          {name}
        </p>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      sorter: (seller1: SellerType, seller2: SellerType) => seller1.phone_number.localeCompare(seller2.phone_number),
      render: (phone: string, seller: SellerType) => (
        <p
          className="text-[#0e2482] font-medium cursor-pointer"
          onClick={() => {
            setOpenDrawer(true);
            setSelectedId(seller.id);
          }}
        >
          {phone}
        </p>
      ),
    },
    {
      title: 'Stores',
      dataIndex: 'stores',
      key: 'stores',
      render: (_: string, sellers: SellerType) => {
        const { stores } = sellers;
        if (!stores || !stores.length) return null;
        const storeList = stores.map((item) => item).join(', ');
        return <div>{storeList}</div>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (seller: string) =>
        seller ? <p>{formatDate(new Date(seller), ' HH:mm DD/MM/yyyy').toLocaleString()}</p> : <></>,
      sorter: (seller1: SellerType, seller2: SellerType) =>
        new Date(seller1.created_at || '').getTime() - new Date(seller2.created_at || '').getTime(),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (seller: string) =>
        seller ? <p>{formatDate(new Date(seller), ' HH:mm DD/MM/yyyy').toLocaleString()}</p> : <></>,
      sorter: (seller1: SellerType, seller2: SellerType) =>
        new Date(seller1.updated_at || '').getTime() - new Date(seller2.updated_at || '').getTime(),
    },
    {
      title: 'Truy cập gần nhất',
      dataIndex: 'last_visit_time',
      key: 'last_visit_time',
      // responsive: ["md"],
      render: (seller: string) =>
        seller ? <p>{formatDate(new Date(seller), ' HH:mm DD/MM/yyyy').toLocaleString()}</p> : <></>,
      sorter: (seller1: SellerType, seller2: SellerType) =>
        new Date(seller1.last_visit_time || '').getTime() - new Date(seller2.last_visit_time || '').getTime(),
    },
    // {
    //   title: "",
    //   key: "action",
    //   fixed: "right",
    //   align: "center",
    //   render: (_, seller) => {
    //     return (
    //       <Space size="middle">
    //         <Button
    //           size="small"
    //           icon={<EyeOutlined />}
    //           onClick={() => {
    //             setOpenDrawer(true);
    //             setSelectedId(seller.id);
    //           }}
    //         >
    //           Xem
    //         </Button>
    //       </Space>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err: string) => {
      message.error(err);
    };
    getAllSellers(onSuccess, onFail);
  }, []);

  return (
    <Layout.Content className="mt-4 px-5">
      <p className="my-5 font-semibold text-[20px]">Danh sách Sellers</p>
      <TableHeader
        onSearch={searchSeller}
        setParams={setParams}
        params={params}
        titleDatePicker1="Ngày đăng ký"
        titleDatePicker2="Thời gian truy cập"
      />
      <Table
        columns={sellersTable}
        scroll={{ x: true }}
        size="middle"
        bordered
        dataSource={sellers.length ? sellers : []}
        loading={loading}
      />
      <Drawer
        title="Thông tin cửa hàng"
        placement="right"
        width="35vw"
        onClose={() => setOpenDrawer(false)}
        open={isOpenDrawer}
      >
        <SellerDetail id={selectedId} />
      </Drawer>
    </Layout.Content>
  );
}
