import React from 'react'
import { Form, Row, Tooltip, notification } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useShopsStore } from '../../store/shopsStore'
import { alerts } from '../../utils/alerts'
import { constants as c } from '../../constants'
import { Link } from 'react-router-dom'

const StoreAuthorization = () => {
  const {createStore, loading} = useShopsStore()

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.success({
      message: `Notification`,
      description: `Bạn vừa copy link ${c.LINK_STORE_CODE}`,
      placement,
    });
  };

  const handleCopyLink = () => {
    const copyText = c.LINK_STORE_CODE
    navigator.clipboard.writeText(copyText);
    openNotification('topRight')
  }

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
    <>
      {contextHolder}
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
          <div className='flex flex-wrap items-center'>
            <Link to={c.LINK_STORE_CODE} target='_blank' className='text-lg text-[#1677ff] flex-1'>{c.LINK_STORE_CODE}</Link>
            <Tooltip title='Nhấn chuột trái để copy'>
              <CopyOutlined className='text-[25px] cursor-pointer' onClick={handleCopyLink}/>
            </Tooltip>
          </div>
        </Row>
      </Form>
    </>
  )
}

export default StoreAuthorization