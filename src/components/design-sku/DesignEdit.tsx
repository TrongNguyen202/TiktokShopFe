import { useEffect } from 'react';
import { Button, Input, Form, message, Modal } from 'antd';
import React from 'react';

import { useShopsOrder } from '../../store/ordersStore';

type DesignEditProps = {
  openModal: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  initData: any;
  refreshDesign: () => void;
  groupId: string;
};
}
function DesignEdit({ openModal, initData, refreshDesign, groupId }: DesignEditProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [openEditModal, setOpenEditModal] = openModal;

  const { getDesignSkuByGroup, getDesignSku, putDesignSku } = useShopsOrder((state) => state);

  const handleUpdateDesign = (values) => {
    const updateItem = {
      image_front: values.image_front,
      image_back: values.image_back,
    };

    if (values.image_front === null && values.image_back === null) {
      messageApi.open({
        type: 'error',
        content: 'Một trong 2 trường Image không được trống',
      });
    } else {
      const onSuccess = (res) => {
        if (res) {
          messageApi.open({
            type: 'success',
            content: 'Cập nhật design thành công',
          });

          if (groupId) {
            getDesignSkuByGroup(
              groupId,
              (newRes) => refreshDesign(newRes),
              (err) => console.log('Error when fetching design SKU: ', err),
            );
          } else {
            getDesignSku(
              (newRes) => refreshDesign(newRes),
              (err) => console.log('Error when fetching design SKU: ', err),
            );
          }
          setOpenEditModal(false);
        }
      };

      const onFail = (err) => {
        messageApi.open({
          type: 'error',
          content: `cập nhật sữ liệu: ${err}`,
        });
        setOpenEditModal(false);
      };

      putDesignSku(updateItem, values.id, onSuccess, onFail);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initData);
  }, [initData]);

  return (
    <Modal
      title="Sửa Design SKU"
      centered
      open={openEditModal}
      onCancel={() => setOpenEditModal(false)}
      footer={false}
      width={1000}
    >
      <Form name="basic" onFinish={handleUpdateDesign} onFinishFailed={() => {}} layout="horizontal" form={form}>
        <Form.Item name="id" label="Design ID:" className="mb-0 font-bold hidden">
          <Input className="border-none bg-transparent p-0" />
        </Form.Item>
        <div className="mb-3 flex flex-wrap">
          <span className="font-bold mr-2 text-right min-w-[106px]">Sku ID:</span>
          <p className="flex-1">{initData.sku_id}</p>
        </div>

        <div className="mb-3 flex flex-wrap">
          <span className="font-bold mr-2 text-right min-w-[106px]">Product name:</span>
          <p className="flex-1">{initData.product_name}</p>
        </div>

        <div className="mb-3 flex flex-wrap">
          <span className="font-bold mr-2 text-right min-w-[106px]">Variation:</span>
          <p className="flex-1">{initData.variation}</p>
        </div>

        <Form.Item
          name="image_front"
          className="font-bold"
          label={<label style={{ minWidth: '100px' }}>Image front</label>}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image_back"
          className="font-bold"
          label={<label style={{ minWidth: '100px' }}>Image back</label>}
        >
          <Input />
        </Form.Item>

        <Form.Item className="flex flex-wrap items-center justify-end mt-5">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </Modal>
  );
}

export default DesignEdit;
