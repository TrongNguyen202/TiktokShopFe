import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Space, Input, Select, Form, message, Tooltip, Popconfirm, Pagination, Tabs, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import { useShopsOrder } from '../../store/ordersStore';
import { useUsersStore } from '../../store/usersStore';

import SectionTitle from '../../components/common/SectionTitle';
import DesignEdit from '../../components/design-sku/DesignEdit';

type DesignSkuType = {
  count?: number;
  next?: string;
  previous?: string;
  results?: {
    id: number;
    sku_id: string;
    product_name: string;
    variation: string;
    image_front: string;
    image_back: string;
  }[];
};

function DesignSku() {
  const [groups, setGroups] = useState([]);
  const [groupIndex, setGroupIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [designSku, setDesignSku] = useState<DesignSkuType>({});
  const [recordEdit, setRecordEdit] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [hadSearch, setHadSearch] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { getDesignSkuByGroup, getDesignSkuByGroupSize, deleteDesignSku, searchDesignSku, loading } = useShopsOrder(
    (state) => state,
  );
  const { getGroupUser } = useUsersStore((state) => state);

  const handleEditDesign = (index: number) => {
    setRecordEdit(designSku?.results ? designSku?.results[index] : []);
    setOpenEditModal(true);
  };

  const handleDeleteDesign = (index: number) => {
    const onSuccess = (res: any) => {
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Xoá design thành công',
        });

        getDesignSkuByGroup(
          String(groupIndex),
          (newRes) => setDesignSku(newRes),
          (err) => console.log('Error when fetching design SKU: ', err),
        );
      }
    };

    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
    };

    deleteDesignSku(String(designSku?.results ? designSku.results[index]?.id : ''), onSuccess, onFail);
  };

  const onChangeTab = (key: number) => {
    setGroupIndex(key);
    const onSuccess = (res: any) => {
      if (res) {
        setDesignSku(res);
      }
    };

    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: `${err} - Lỗi khi lấy danh sách Design`,
      });
    };
    getDesignSkuByGroup(String(key), onSuccess, onFail);
  };

  const handleChangePagePagination = (page: number) => {
    const onSuccess = (res: any) => {
      if (res) {
        setPageIndex(page);
        setDesignSku(res);
      }
    };

    const onFail = (err: string) => {
      console.log(err);
    };
    getDesignSkuByGroupSize(String(groupIndex), String(page), onSuccess, onFail);
  };

  const handleRefreshDesign = (newData: DesignSkuType) => {
    setDesignSku(newData);
  };

  const handleSearchDesign = (values: any) => {
    setHadSearch(true);
    setGroupIndex(values.group_id);
    setOpenSearchModal(false);
    const onSuccess = (res: any) => {
      if (res) {
        messageApi.open({
          type: 'success',
          content: res.count > 0 ? `Tìm thấy ${res.count} kết quả` : 'Không có kết quả nào trùng khớp',
        });
        setDesignSku(res);
      }
    };

    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: `${err} - Lỗi khi tìm Design`,
      });
    };

    searchDesignSku(values, onSuccess, onFail);
  };

  const handleClearSearch = () => {
    const onSuccess = (res: any) => {
      if (res) {
        setHadSearch(false);
        setDesignSku(res);
      }
    };
    getDesignSkuByGroup(String(groupIndex), onSuccess, (err) => console.log(err));
  };

  const tabContent = (data: any) => {
    return (
      <div className="text-right">
        <Table scroll={{ x: true }} columns={columns} dataSource={data} bordered pagination={false} loading={loading} />
        <Pagination
          className="mt-10"
          current={pageIndex}
          total={designSku?.count}
          pageSize={20}
          onChange={handleChangePagePagination}
        />
      </div>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      align: 'center',
      render: (_: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Sku ID',
      dataIndex: 'sku_id',
    },
    {
      title: 'Product name',
      dataIndex: 'product_name',
    },
    {
      title: 'Variation',
      dataIndex: 'variation',
    },
    {
      title: 'Design image front',
      dataIndex: 'image_front',
      render: (text: string) => (
        <Link to={text} target="_blank" className="inline-block max-w-[200px]">
          {text}
        </Link>
      ),
    },
    {
      title: 'Design image back',
      dataIndex: 'image_back',
      render: (text: string) => (
        <Link to={text} target="_blank" className="inline-block max-w-[200px]">
          {text}
        </Link>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      align: 'center',
      render: (_: any, record: any, index: number) => (
        <Space>
          <Tooltip title="Sửa design">
            <Button className="border-none bg-transparent shadow-none" onClick={() => handleEditDesign(index)}>
              <EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </Button>
          </Tooltip>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteDesign(index)}>
            <Button className="border-none bg-transparent shadow-none">
              <DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const items = groups.map((group: any) => ({
    key: group.id,
    label: group.group_name,
    children: tabContent(designSku && designSku?.results),
  }));

  useEffect(() => {
    const onSuccess = (res: any) => {
      if (res) {
        setGroups(res);
        getDesignSkuByGroup(
          res[0].id,
          (resDesign) => setDesignSku(resDesign),
          (err) => console.log(err),
        );
      }
    };

    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: `${err}`,
      });
    };

    getGroupUser(onSuccess, onFail);
  }, []);

  return (
    <div className="p-3 md:p-10">
      {contextHolder}
      <div className="mb-3 text-start flex flex-wrap items-center">
        <div className="flex-1">
          <SectionTitle title="Danh sách Design" />
        </div>
        <Space size="large">
          <div className="cursor-pointer" onClick={() => setOpenSearchModal(true)}>
            <Tooltip title="Tìm kiếm">
              <SearchOutlined
                className="text-[20px]"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </Tooltip>
          </div>
          {hadSearch && (
            <Tooltip title="Xoá kết quả tìm kiếm">
              <DeleteOutlined
                onClick={handleClearSearch}
                className="text-[20px]"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </Tooltip>
          )}
        </Space>
      </div>

      {/* @ts-expect-error konva */}
      <Tabs activeKey={groupIndex} items={items} onChange={onChangeTab} />
      <DesignEdit
        openModal={[openEditModal, setOpenEditModal]}
        initData={recordEdit}
        refreshDesign={handleRefreshDesign}
        groupId={String(groupIndex)}
      />

      <Modal
        title="Tìm kiếm Design Sku"
        centered
        open={openSearchModal}
        onCancel={() => setOpenSearchModal(false)}
        footer={false}
      >
        <Form onFinish={handleSearchDesign} onFinishFailed={() => {}} className="p-3" layout="vertical">
          <Form.Item name="search_query" className="font-bold" label="Design ID, Product name hoặc Variation">
            <Input />
          </Form.Item>
          <Form.Item name="group_id" className="font-bold" label="Chọn nhóm">
            <Select
              // @ts-expect-error initialValues
              initialValues={groups && groups[0]?.id}
              onChange={() => {}}
              options={groups.map((group: any) => ({
                value: group.id,
                label: group.group_name,
              }))}
            />
          </Form.Item>
          <Form.Item className="flex flex-wrap items-center justify-end mt-5">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DesignSku;
