import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import LOGO from '../../assets/images/text_logo_FLN.png';
import { PATH } from '../../constants/paths';
import { useAuthStore } from '../../store/authStore';
import { alerts } from '../../utils/alerts';
import { setToken } from '../../utils/auth';

interface LoginProps {
  username: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore((state) => state);

  const onSubmit = (value: LoginProps) => {
    const onSuccess = (token: string) => {
      setToken('tk-tk', token);
      navigate(PATH.HOME);
      alerts.success('Thành công');
    };
    const onFail = (error: string) => {
      alerts.error(error);
    };

    login(value, onSuccess, onFail);
  };

  return (
    <div className="w-[90%] md:w-[500px] mx-auto border-[1px] border-[#ccc] border-solid p-5 rounded-[6px] mt-[25vh]">
      <Form
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <div className="text-center">
          <img src={LOGO} alt="logo" width={100} height={35} />
        </div>
        <p className="font-bold text-center text-[20px] mb-5">Admin</p>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại!',
            },
          ]}
          sx={{ justifyContent: 'space-between' }}
        >
          <Input placeholder=" Nhập số điện thoại" type="text" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập Mật khẩu!',
            },
          ]}
          sx={{ marginBottom: '10px' }}
        >
          <Input.Password placeholder=" Nhập mật khẩu" autoComplete="false" />
        </Form.Item>

        <Button className="mt-4" block type="primary" htmlType="submit" loading={loading}>
          Đăng nhập
        </Button>
      </Form>
    </div>
  );
}
export default Login;








