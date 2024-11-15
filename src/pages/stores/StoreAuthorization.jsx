import { Button, Col, Form, Input, Row } from 'antd'
import React from 'react'
import { useShopsStore } from '../../store/shopsStore'
import { alerts } from '../../utils/alerts'
import { constants as c } from '../../constants'

const StoreAuthorization = () => {
  const {createStore, loading} = useShopsStore()

  const onSubmit = (value) => {
    const params = {
      ...value,
      auth_code: value.auth_code.split("code=")[1]
    }
    const onSuccess = (res) => {
      console.log('res: ', res)
    }
    const onFail = (err) => {
      alerts.error(err)
    }
    createStore(params, onSuccess, onFail)
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
    >
      <Row className='p-5 text-center justify-center text-[15px]'>
        <h3 className='text-xl mb-5'>Uỷ quyền cho ứng dụng</h3>
        <p className='mb-1'>Copy link sau và chạy trên trình duyệt (stealthfox, dophin anty,...) để tiến hành uỷ quyền và thêm của hàng</p>
        <span className='text-lg text-[#1677ff]'>{c.LINK_STORE_CODE}</span>
      </Row>
    </Form>
  )
}

export default StoreAuthorization