import { Table, Button, Form, Input, Divider, message } from 'antd';

import React from 'react';
import { ColumnType } from 'antd/es/table';
import { useGoogleStore } from '../../store/googleSheets';
import { signInWithGoogle } from '../../Firebase';

type Column = ColumnType<Record<string, any>>;

function OrdersAddNewDesignData({ dataColumns }: { dataColumns: any }) {
  const { AddRowToSheet } = useGoogleStore();
  const [messageApi, contextHolder] = message.useMessage();
  const columns: Column[] = [
    {
      title: 'SKU',
      dataIndex: 'SKU',
      key: 'SKU',
      width: '210px',
      align: 'center',
      render: (_: any, record: any, index: number) => (
        <Form.Item name={[index, 'SKU']} initialValue={record[0]}>
          <Input disabled className="border-none hover:border-none !bg-transparent !text-[#000000E0]" />
        </Form.Item>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'Product Name',
      key: 'Product Name',
      render: (_: any, record: any) => record[1],
    },
    {
      title: 'Variation',
      dataIndex: 'Variation',
      key: 'Variation',
      render: (_: any, record: any) => record[2],
    },
    {
      title: 'Image 1 (front)',
      dataIndex: 'Image 1 (front)',
      key: 'Image 1 (front)',
      render: (text: any, _: any, index: number) => (
        <Form.Item name={[index, 'Image 1 (front)']}>
          <Input />
        </Form.Item>
      ),
    },
    {
      title: 'Image 2 (back)',
      dataIndex: 'Image 2 (back)',
      key: 'Image 2 (back)',
      render: (text: any, _: any, index: number) => (
        <Form.Item name={[index, 'Image 2 (back)']}>
          <Input />
        </Form.Item>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    const valuesSubmit = Object.keys(values).map((key) => values[key]);
    // eslint-disable-next-line array-callback-return, consistent-return
    const newDesignData = dataColumns.map((item: any) => {
      const matchingItem = valuesSubmit.find((value) => item[0] === value.SKU);
      if (matchingItem) {
        return [item[0], item[1], item[2], matchingItem['Image 1 (front)'], matchingItem['Image 2 (back)'], item[5]];
      }
    });

    let oauthAccessToken = localStorage.getItem('oauthAccessToken');
    if (!oauthAccessToken) {
      const response = (await signInWithGoogle()) as Record<string, any>;
      localStorage.setItem('oauthAccessToken', response._tokenResponse.oauthAccessToken);
      oauthAccessToken = response._tokenResponse.oauthAccessToken;
    }
    const dataAddRowToSheet = {
      values: newDesignData,
    };

    if (oauthAccessToken) {
      const onSuccess = (res: any) => {
        if (res) {
          messageApi.open({
            type: 'success',
            content: 'Đã thêm mẫu mới vào Google Sheet',
          });
        }
      };
      const onFail = () => {
        messageApi.open({
          type: 'error',
          content: 'Thêm mẫu mới vào Google Sheet thất bại',
        });
      };
      AddRowToSheet('Team Truong', dataAddRowToSheet, oauthAccessToken, onSuccess, onFail);
    }
  };

  return (
    <>
      {contextHolder}
      <Divider>Hoặc </Divider>
      <Form onFinish={onFinish}>
        <Table scroll={{ x: true }} columns={columns} dataSource={dataColumns} bordered pagination={false} />
        <Form.Item className="mt-3 text-center">
          <Button type="primary" htmlType="submit">
            Thêm mẫu
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default OrdersAddNewDesignData;
