import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  Spin,
  message,
  Modal,
} from "antd";

import { useUsersStore } from "../../store/usersStore";
import { useShopsStore } from "../../store/shopsStore";
import { getPathByIndex } from "../../utils";

import PageTitle from "../../components/common/PageTitle";

export default function ModalUserForm({
  isShowModal,
  setIsShowModal,
  userSelected,
}) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { getUserInfor, updateUser, loading, getShopByUser, createUser } = useUsersStore((state) => state);
  const { getAllStores, stores } = useShopsStore((state) => state);

  const storesOption =
    stores?.length &&
    stores?.map((item) => ({
      value: item.id,
      label: item.shop_name,
    }));

  const onFinish = (values) => {
    console.log('values: ', values);
    const dataUpdate = {
      ...values,
      user_id: userSelected?.user_id || "",
    };
    const onSuccess = (res) => {
      getShopByUser();
      if (res) {
        messageApi
          .open({
            type: "success",
            content: "Thành công",
          })
        setIsShowModal(false);
      }
    };

    const onFail = (err) => {
      messageApi.open({
        type: "error",
        content: err,
      });
    };
    userSelected?.user_id ? updateUser(dataUpdate, onSuccess, onFail) : createUser(dataUpdate, onSuccess, onFail);
  };

  useEffect(() => {
    getAllStores();
    if (userSelected?.user_id) {
      const newData = {
        ...userSelected,
        username: userSelected?.user_name,
        shops: userSelected?.shops?.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      };
      form.setFieldsValue(newData);
    }
  }, []);

  return (
    <div className="">
      <Modal
        title={"Chỉnh sửa thông tin nhân viên"}
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
                  <Form.Item label="User Name" name="username">
                    <Input placeholder="User Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Password" name="password">
                    <Input.Password placeholder="password" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email Address" name="email">
                    <Input placeholder="Email Address" />
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
                          options.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0 ||
                          options.value
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item className='mt-10 flex justify-end gap-3'>
                <Button onClick={() => setIsShowModal(false)}>Huỷ</Button>
                <Button className='ml-3' type="primary" htmlType="submit">Lưu</Button>
              </Form.Item>
            </Form>
          </>
        </Spin>
      </Modal>
    </div>
  );
}
