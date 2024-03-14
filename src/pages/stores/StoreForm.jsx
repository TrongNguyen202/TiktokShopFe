import { Button, Col, Form, Input, Row, Select, Spin, message } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useShopsStore } from '../../store/shopsStore';
import { useUsersStore } from '../../store/usersStore';
import { alerts } from '../../utils/alerts';

function StoreForm({ app_key, code, storeSelected, setShowModal }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createStore, loading, updateStore } = useShopsStore();
  const { getShopByUser, shopsByUser } = useUsersStore((state) => state);

  React.useEffect(() => {
    form.setFieldsValue({
      auth_code: code,
    });
    getShopByUser();
  }, []);

  useEffect(() => {
    if (storeSelected?.id) {
      form.setFieldsValue({
        auth_code: storeSelected.auth_code,
        shop_name: storeSelected.shop_name,
        shop_code: storeSelected.shop_code,
        user_id: storeSelected.user_id,
      });
    }
  }, [storeSelected]);

  const convertSellerOptions = (data) => {
    if (!data || !Array.isArray(data) || !data.length) return [];
    return data.map((item) => ({
      label: item.user_name,
      value: item.user_id,
    }));
  };

  const onSubmit = (value) => {
    const onSuccess = (res) => {
      navigate('/shops');
      message.success('thành công');
      setShowModal(false);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    const paramsUpdate = {
      ...value,
      access_token: storeSelected.access_token,
    };

    storeSelected?.id
      ? updateStore(storeSelected.id, paramsUpdate, onSuccess, onFail)
      : createStore(value, onSuccess, onFail);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 24,
      }}
      onFinish={onSubmit}
      autoComplete="off"
      layout="vertical"
      form={form}
    >
      <h3 className="text-xl mb-5">Thông tin cửa hàng</h3>
      <Spin spinning={loading}>
        <Row className="px-1 justify-between">
          <Col span={24}>
            <Form.Item
              label="Auth code"
              name="auth_code"
              labelAlign="left"
              className="font-medium"
              sx={{ width: '100%' }}
              labelCol={{
                span: 24,
              }}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row className=" px-1 justify-between">
          <Col span={24}>
            <Form.Item
              label="Shop name"
              name="shop_name"
              labelAlign="left"
              className="font-medium"
              sx={{ width: '100%' }}
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Shop name',
                },
              ]}
            >
              <Input placeholder="Nhập shop name" />
            </Form.Item>
          </Col>
        </Row>

        <Row className=" px-1 justify-between">
          <Col span={24}>
            <Form.Item
              label="Shop code"
              name="shop_code"
              labelAlign="left"
              className="font-medium"
              sx={{ width: '100%' }}
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Shop code',
                },
              ]}
            >
              <Input placeholder="Nhập shop code" />
            </Form.Item>
          </Col>
        </Row>

        {!storeSelected?.id && (
          <Row className=" px-1 justify-between">
            <Col span={24}>
              <Form.Item
                label="Seller sở hữu"
                name="user_id"
                labelAlign="left"
                className="font-medium"
                sx={{ width: '100%' }}
                labelCol={{
                  span: 24,
                }}
              >
                <Select
                  // mode="multiple"
                  placeholder="Hãy chọn store"
                  // onChange={handleChange}
                  options={convertSellerOptions(shopsByUser.users)}
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
        )}

        <div className="w-full mt-4">
          <Button block type="primary" htmlType="submit">
            {storeSelected?.id ? 'Cập nhật' : 'Thêm cửa hàng'}
          </Button>
        </div>
      </Spin>
    </Form>
  );
}

export default StoreForm;
