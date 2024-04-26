import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Space, Table, Tooltip, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { ColumnType } from 'antd/es/table';
import { useShopsOrder } from '../../store/ordersStore';

import SectionTitle from '../common/SectionTitle';

type OrderCheckDesignProps = {
  toShipInfoData: Record<string, any>[];
  changeNextStep: (value: boolean) => void;
};

function OrderCheckDesign({ toShipInfoData }: OrderCheckDesignProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [openNewDesignModal, setOpenNewDesignModal] = useState(false);
  const [newDesignSku, setNewDesignSku] = useState([]);
  const [openEditDesignModal, setOpenEditDesignModal] = useState(false);
  const [designSku, setDesignSku] = useState([] as any);
  const [initialDesignSkuUpdated, setInitialDesignSkuUpdated] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const { getDesignSku, getDesignSkuSize, postDesignSku, putDesignSku, deleteDesignSku, loading } = useShopsOrder(
    (state) => state,
  );
  const formItemLayout = {
    labelCol: {
      span: 4,
    },
  };

  const handleCheckDesign = (data: any) => {
    const dataCheck = data
      .map((order: Record<string, unknown>) => {
        const productList = (order as { order_list: any[] })?.order_list
          .map((item, index) => {
            const productItem = item.item_list
              .map((product: Record<string, unknown>) => ({
                ...product,
                order_id: (order as { order_list: any[] }).order_list[index].order_id,
              }))
              .flat();
            return productItem;
          })
          .flat();

        return productList.map((item) => ({
          order_id: item.order_id,
          label: order.label,
          sku_id: item.sku_id,
          quantity: item.quantity,
          product_name: item.product_name,
          variation: item.sku_name,
          product_id: item.product_id,
        }));
      })
      .flat();

    const dataCheckSet = new Set();
    const dataCheckResult = dataCheck
      .map((item: Record<string, unknown>) => {
        if (!dataCheckSet.has(item.sku_id)) {
          dataCheckSet.add(item.sku_id);
          return item;
        }
        return null;
      })
      .filter((item: Record<string, unknown>) => item !== null);

    const dataDesignSku = dataCheckResult.filter((checkItem: Record<string, unknown>) => {
      return !designSku?.some((designItem: Record<string, unknown>) => designItem?.sku_id === checkItem.sku_id);
    });

    if (dataDesignSku.length) {
      setOpenNewDesignModal(true);
      setNewDesignSku(dataDesignSku);
    } else {
      messageApi.open({
        type: 'info',
        content: 'Tất cả design đều đã tồn tại. Vui lòng kiểm tra lại bằng chức tìm kiếm',
      });
    }
  };

  const handleAddNewDesign = (values: Record<string, unknown>) => {
    const newData = Object.values(values);
    const onSuccess = (res: any) => {
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Thêm thiết kế thành công',
        });

        getDesignSku(
          (newRes) => setDesignSku(newRes.results),
          (err) => console.log('Error when fetching design SKU: ', err),
        );

        setOpenNewDesignModal(false);
      }
    };

    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
      setOpenNewDesignModal(false);
    };
    postDesignSku(newData, onSuccess, onFail);
  };

  const handleEditDesign = (index: number) => {
    form.setFieldsValue(designSku[index]);
    setOpenEditDesignModal(true);
  };

  const handleUpdateDesign = (values: Record<string, unknown>) => {
    const updateItem = {
      image_front: values.image_front,
      image_back: values.image_back,
    };

    console.log('updateItem: ', updateItem);

    const onSuccess = (res: any) => {
      console.log(res);
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Cập nhật design thành công',
        });
        getDesignSku(
          (newRes) => setDesignSku(newRes.results),
          (err) => console.log('Error when fetching design SKU: ', err),
        );
        setOpenEditDesignModal(false);
      }
    };

    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
      setOpenEditDesignModal(false);
    };

    putDesignSku(updateItem, String(values.id), onSuccess, onFail);
  };

  const handleDeleteDesign = (index: number) => {
    const onSuccess = (res: any) => {
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Xoá design thành công',
        });

        getDesignSku(
          (newRes) => setDesignSku(newRes.results),
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

    deleteDesignSku(String(designSku[index]?.id), onSuccess, onFail);
  };

  const handleChangePagePagination = (page: number) => {
    const onSuccess = (res: any) => {
      if (res) {
        setPageIndex(page);
        setDesignSku(res.results);
      }
    };
    const onFail = () => {
      return null;
    };
    getDesignSkuSize(String(page), onSuccess, onFail);
  };

  const generateColumns = (showActionsColumn: boolean) => {
    const columns = [
      {
        title: 'STT',
        dataIndex: 'stt',
        align: 'center',
        render: (_: any, record: any, index: number) => index + 1,
      },
      {
        title: 'Sku ID',
        dataIndex: 'sku_id',
        align: 'center',
        width: '200px',
        render: (_: any, record: any, index: any) => (
          <>
            {record.order_id ? (
              <Form.Item name={[index, 'sku_id']} initialValue={record.sku_id}>
                <Input className="pointer-events-none border-none bg-transparent" />
              </Form.Item>
            ) : (
              record.sku_id
            )}
          </>
        ),
      },
      {
        title: 'Product name',
        dataIndex: 'product_name',
        width: '200px',
        render: (_: any, record: any, index: any) => (
          <>
            {record.order_id ? (
              <Tooltip title={record.product_name}>
                <Form.Item name={[index, 'product_name']} initialValue={record.product_name}>
                  <Input className="w-full block pointer-events-none border-none bg-transparent text-ellipsis overflow-hidden whitespace-normal" />
                </Form.Item>
              </Tooltip>
            ) : (
              <p>{record.product_name}</p>
            )}
          </>
        ),
      },
      {
        title: 'Variation',
        dataIndex: 'variation',
        render: (_: any, record: any, index: any) => (
          <>
            {record.order_id ? (
              <Form.Item name={[index, 'variation']} initialValue={record.variation}>
                <Input className="pointer-events-none border-none bg-transparent" />
              </Form.Item>
            ) : (
              record.variation
            )}
          </>
        ),
      },
      {
        title: 'Design front image',
        dataIndex: 'image_front',
        render: (_: any, record: any, index: any) => (
          <>
            {record.order_id ? (
              <Form.Item name={[index, 'image_front']}>
                <Input />
              </Form.Item>
            ) : (
              <p>{record.image_front}</p>
            )}
          </>
        ),
      },
      {
        title: 'Design back image',
        dataIndex: 'image_back',
        render: (_: any, record: any, index: any) => (
          <>
            {record.order_id ? (
              <Form.Item name={[index, 'image_back']}>
                <Input />
              </Form.Item>
            ) : (
              <p>{record.image_back}</p>
            )}
          </>
        ),
      },
    ];

    if (showActionsColumn) {
      columns.push({
        title: 'Actions',
        dataIndex: 'actions',
        align: 'center',
        width: '200px',
        render: (_, record, index) => (
          <>
            {!record.order_id && (
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
            )}
          </>
        ),
      });
    }

    return columns;
  };

  useEffect(() => {
    const onSuccess = (res: any) => {
      if (res) {
        setDesignSku(res.results);
        if (!initialDesignSkuUpdated) {
          setInitialDesignSkuUpdated(true);
        }
      }
    };
    getDesignSku(onSuccess, (err) => console.log('Design Sku: ', err));
  }, [toShipInfoData]);

  useEffect(() => {
    if (initialDesignSkuUpdated) handleCheckDesign(toShipInfoData);
  }, [initialDesignSkuUpdated, toShipInfoData]);

  return (
    <div className="p-3 md:p-10">
      <SectionTitle title="Danh sách Design" />
      <div className="text-right">
        <Table
          rowKey="order_id"
          scroll={{ x: true }}
          columns={generateColumns(true) as ColumnType<any>[]}
          dataSource={designSku}
          pagination={{
            current: pageIndex,
            pageSize: 100,
            total: designSku.count,
            onChange: handleChangePagePagination,
          }}
          bordered
          loading={loading}
        />
      </div>
      <Modal
        title={`Thêm ${newDesignSku.length} design mới`}
        centered
        open={openNewDesignModal}
        onCancel={() => setOpenNewDesignModal(false)}
        footer={false}
        width={1000}
      >
        <Form name="basic" onFinish={handleAddNewDesign}>
          <Table
            columns={generateColumns(false) as ColumnType<any>[]}
            dataSource={newDesignSku}
            pagination={false}
            bordered
            className="mt-5"
          />
          <Form.Item className="flex flex-wrap items-center justify-end mt-5">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Sửa Design SKU"
        centered
        open={openEditDesignModal}
        onCancel={() => setOpenEditDesignModal(false)}
        footer={false}
        width={1000}
      >
        <Form name="basic" onFinish={handleUpdateDesign} layout="horizontal" {...formItemLayout} form={form}>
          <Form.Item name="id" label="Design ID:" className="mb-0 font-bold hidden">
            <Input className="border-none bg-transparent p-0" />
          </Form.Item>
          <Form.Item name="sku_id" label="Sku ID:" className="mb-0 font-bold">
            <Input className="border-none bg-transparent p-0" />
          </Form.Item>
          <Form.Item name="product_name" label="Product name:" className="mb-0 font-bold">
            <Input className="border-none bg-transparent p-0" />
          </Form.Item>
          <Form.Item name="variation" label="Product variation:" className="font-bold">
            <Input className="border-none bg-transparent p-0" />
          </Form.Item>
          <Form.Item name="image_front" label="Image front:" className="font-bold">
            <Input />
          </Form.Item>
          <Form.Item name="image_back" label="Image back:" className="font-bold">
            <Input />
          </Form.Item>
          <Form.Item className="flex flex-wrap items-center justify-end mt-5">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </div>
  );
}

export default OrderCheckDesign;
