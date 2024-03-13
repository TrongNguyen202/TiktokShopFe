import React from 'react'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

import { useShopsStore } from '../../store/shopsStore'
import { alerts } from '../../utils/alerts'
import { constants as c } from '../../constants'
import { useUsersStore } from '../../store/usersStore';

const StoreForm = ({app_key, code}) => {
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const {createStore, loading} = useShopsStore()
  const { getShopByUser, shopsByUser } = useUsersStore((state) => state)

  const app_secret = c.APP_SECRET
  const grant_type  = c.GRANT_TYPE

  React.useEffect(() => {
    form.setFieldsValue({
      auth_code: code
    });
    getShopByUser()
  }, [])

  const convertSellerOptions = (data) => {
    if (!data || !Array.isArray(data) || !data.length) return []
    return data.map(item => ({
      label: item.user_name,
      value: item.user_id
    }))
  }

  const onSubmit = (value) => {
    const onSuccess = (res) => {
      navigate('/shops');
      console.log('res: ', res)
    }
    const onFail = (err) => {
      alerts.error(err)
    }

    createStore(value, onSuccess, onFail)
  }

  return (
    <Form
      name='basic'
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 24,
      }}
      onFinish={onSubmit}
      autoComplete='off'
      layout='vertical'
      form={form}
    >
      <h3 className='text-xl mb-5'>Thông tin cửa hàng</h3>

      <Row className='px-1 justify-between'>
        <Col span={24}>
          <Form.Item
            label='Auth code'
            name='auth_code'
            labelAlign='left'
            className='font-medium'
            sx={{ width: '100%' }}
            labelCol={{
              span: 24,
            }}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row className=' px-1 justify-between'>
        <Col span={24}>
          <Form.Item
            label='Shop name'
            name='shop_name'
            labelAlign='left'
            className='font-medium'
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
          // initialValue={selectedBanner?.action_link}
          >
            <Input placeholder='Nhập shop name' />
          </Form.Item>
        </Col>
      </Row>

      <Row className=' px-1 justify-between'>
        <Col span={24}>
          <Form.Item
            label='Shop code'
            name='shop_code'
            labelAlign='left'
            className='font-medium'
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
            <Input placeholder='Nhập shop code' />
          </Form.Item>
        </Col>
      </Row>

      <Row className=' px-1 justify-between'>
        <Col span={24}>
          <Form.Item
            label='Seller sở hữu'
            name='user_id'
            labelAlign='left'
            className='font-medium'
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
              className='w-full'
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

      <div className='w-full mt-4'>
        <Button block type='primary' htmlType='submit'>Thêm cửa hàng</Button>
      </div>
    </Form>
  )
}

export default StoreForm
