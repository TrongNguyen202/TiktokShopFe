import { Button, Col, Form, Input, Modal, Row, Select, Spin, message } from 'antd';
import { useEffect } from 'react';
import { useShopsStore } from '../../store/shopsStore';
import { useUsersStore } from '../../store/usersStore';

export default function ModalUserForm({ isShowModal, setIsShowModal, userSelected }) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { updateUser, loading, getShopByUser, createUser } = useUsersStore((state) => state);
  const { getAllStores, stores } = useShopsStore((state) => state);

  const storesOption =
    stores?.length &&
    stores?.map((item) => ({
      value: item.id,
      label: item.shop_name,
    }));

  const onFinish = (values) => {
    if (!values?.username) {
      message.warning('');
      return;
    }
    if (!values?.password) {
      message.warning('Password is required');
      return;
    }
    const dataUpdate = {
      ...values,
      user_id: userSelected?.user_id || '',
    };
    console.log('dataUpdate: ', dataUpdate);
    const onSuccess = (res) => {
      getShopByUser();
      if (res) {
        messageApi.open({
          type: 'success',
          content: 'Thành công',
        });
        setIsShowModal(false);
      }
    };

    const onFail = (err) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
    };

    if (userSelected?.user_id) {
      updateUser(dataUpdate, onSuccess, onFail);
    } else {
      createUser(dataUpdate, onSuccess, onFail);
    }
  };

  useEffect(() => {
    getAllStores();
    if (userSelected?.user_id) {
      const newData = {
        ...userSelected,
        username: userSelected?.user_name,
        shops: userSelected?.shops?.map((item) => item.id),
      };
      form.setFieldsValue(newData);
    }
  }, []);

  return (
    <div className="">
      <Modal
        title="Thông tin nhân viên"
        visible={isShowModal}
        // onOk={onFinish}
        okText="Save"
        cancelText="Cancel"
        footer={null}
        onCancel={() => setIsShowModal(false)}
        width="50vw"
      >
        <Spin spinning={loading}>
          <>
            {contextHolder}
            <Form layout="vertical" onFinish={onFinish} form={form}>
              <Row gutter={30}>
                <Col span={12}>
                  <Form.Item label="First Name" name="first_name">
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name" name="last_name">
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="User Name"
                    name="username"
                    rules={[{ required: true, message: 'User name is required' }]}
                  >
                    <Input placeholder="User Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Password is required' }]}
                  >
                    <Input.Password placeholder="password" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="User code"
                    name="user_code"
                    rules={[{ required: true, message: 'User code is required' }]}
                  >
                    <Input placeholder="User code" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Shops" name="shops">
                    <Select
                      mode="multiple"
                      placeholder="Hãy chọn store"
                      // onChange={handleChange}
                      options={storesOption}
                      className="w-full"
                      filterOption={(input, options) => {
                        return (
                          options.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                          options.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item className="mt-10 flex justify-end gap-3">
                <Button onClick={() => setIsShowModal(false)}>Huỷ</Button>
                <Button className="ml-3" type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </>
        </Spin>
      </Modal>
    </div>
  );
}