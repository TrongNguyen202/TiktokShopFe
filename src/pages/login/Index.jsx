import { Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import LOGO from '../../assets/images/logo.svg'
import { PATH } from '../../constants/paths'
import { useAuthStore } from '../../store/authStore'
import { alerts } from '../../utils/alerts'
import { setToken } from '../../utils/auth'
import GoogleIcon from '../../assets/icons/GoogleIcon'
import { signInWithGoogle } from '../../Firebase'
import { useGoogleStore } from '../../store/googleSheets'

const Login = () => {

  const { getAllSheetInfo, AddRowToSheet } = useGoogleStore()
  const navigate = useNavigate()
  const { login, loading } = useAuthStore((state) => state)

  const onSubmit = (value) => {
    const onSuccess = (token) => {
      console.log('token: ', token)
      setToken(token)
      navigate(PATH.HOME)
      alerts.success('Thành công')
    }
    const onFail = (error) => {
      alerts.error(error)
    }

    login(value, onSuccess, onFail)
  }

  const onLoginWithGoogle = async () => {
    try {
      const response = await signInWithGoogle();
      console.log('response: ', response);
      const { user, providerId } = response;
      const { displayName, email, photoURL, uid, phoneNumber } = user;
      const params = {
        name: displayName,
        email,
        avatar: photoURL,
        social_id: uid,
        type_from: providerId,
        phone_number: phoneNumber,
      };
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetInfoSheet = () => {
    getAllSheetInfo('Team Dang')
  }

  const handleAddRow = async () => {
    let oauthAccessToken = localStorage.getItem('oauthAccessToken')
    if (!oauthAccessToken) {
      const response = await signInWithGoogle();
      localStorage.setItem('oauthAccessToken', response._tokenResponse.oauthAccessToken)
      oauthAccessToken = response._tokenResponse.oauthAccessToken
    }
    const data = {
      "values": [
        [
          "11111111111111",
          "222222222222",
          "32333333333",
          "444444444444444"
        ]
      ]
    }
    AddRowToSheet('Team Dang', data, oauthAccessToken)
  }

  return (
    <div className='w-[500px] mx-auto border-[1px] border-[#ccc] border-solid p-5 rounded-[6px] mt-[25vh]'>
      <Form
        name='basic'
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 20,
        }}
        onFinish={onSubmit}
        autoComplete='off'
      >
        <div className='text-center'>
          <img src={LOGO} alt='logo' width={100} height={35} />
        </div>
        <p className='font-bold text-center text-[20px] mb-5'>Admin</p>
        <Form.Item
          label='Tên đăng nhập'
          name='username'
          labelAlign='left'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại!',
            },
          ]}
          sx={{ justifyContent: 'space-between' }}
        >
          <Input placeholder=' Nhập số điện thoại' type='text' />
        </Form.Item>

        <Form.Item
          label='Mật khẩu'
          name='password'
          labelAlign='left'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập Mật khẩu!',
            },
          ]}
          sx={{ marginBottom: '10px' }}
        >
          <Input.Password placeholder=' Nhập mật khẩu' autoComplete='false' />
        </Form.Item>

        <Button className='mt-4' block type='primary' htmlType='submit' loading={loading}>Đăng nhập</Button>
      </Form>
      <div className='flex gap-2 mt-3'>
        <Button type='primary' onClick={handleGetInfoSheet}>Get sheet</Button>
        <Button type='primary' onClick={handleAddRow}>Add row</Button>
      </div>
    </div>
  )
}
export default Login
