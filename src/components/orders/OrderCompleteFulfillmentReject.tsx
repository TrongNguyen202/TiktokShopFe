import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';

function OrderCompleteFulfillmentReject({ rejectOrderNoteData, data }) {
  const onFinish = (values) => {
    const rejectOrderSubmit = {
      orderCode: data.orderCode,
      packageId: data.packageId,
      orderId: data.orderId,
      note: values.note,
    };
    rejectOrderNoteData(rejectOrderSubmit);
  };
  return (
    <>
      <h3 className="mb-3">Confirm Reject Order ({data.orderId})</h3>
      <Form onFinish={onFinish}>
        <Form.Item
          label="Note"
          name="note"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default OrderCompleteFulfillmentReject;
