import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Form, Input, Select, Spin, message } from 'antd';
import { useUsersStore } from '../../store/usersStore';
import { useShopsStore } from '../../store/shopsStore';
import { getPathByIndex } from '../../utils';
import PageTitle from '../../components/common/PageTitle';

function UserEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shops } = location.state;
  const userId = getPathByIndex(3);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { getUserInfo, updateUser, loading } = useUsersStore((state) => state);
  const { getAllStores, stores } = useShopsStore((state) => state);

  const storesOption =
    stores?.length &&
    stores?.map((item) => ({
      value: item.id,
      label: item.shop_name,
    }));

  const onFinish = (values) => {
    const dataUpdate = {
      ...values,
      user_id: userId,
    };
    const onSuccess = (res) => {
      if (res) {
        messageApi
          .open({
            type: 'success',
            content: 'Cập nhật thông tin thành công',
          })
          .then(() => {
            navigate(`/users`);
          });
      }
    };

    const onFail = (err) => {
      messageApi.open({
        type: 'success',
        content: err,
      });
    };
    updateUser(dataUpdate, onSuccess, onFail);
  };

  const handleCancel = () => {
    navigate(`/users`);
  };

  useEffect(() => {
    const onSuccess = (res) => {
      const dataForm = {
        ...res,
        stores: shops?.map((item) => item.id),
      };

      form.setFieldsValue(dataForm);
    };

    const onFail = () => {};
    getUserInfo(userId, onSuccess, onFail);
    getAllStores();
  }, []);

  return (
    <div className="p-10">
      <Spin spinning={loading}>
        <>
          {contextHolder}
          <PageTitle title="Sửa thông tin nhân viên" showBack nav="" />
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Row gutter={30}>
              <Col span={12}>
                <Form.Item label="First Name" name="first_name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name" name="last_name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="User Name" name="username">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email Address" name="email">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Store được phân quyền" name="stores">
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
            <Form.Item className="mt-10">
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button type="primary" className="ml-3" onClick={handleCancel}>
                Huỷ
              </Button>
            </Form.Item>
          </Form>
        </>
      </Spin>
    </div>
  );
}

export default UserEdit;
