import { useState } from 'react';
import { Button, Input, Form, message, Card } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { useShopsOrder } from '../../store/ordersStore';
import { constants as c } from '../../constants';

import LoadingButton from '../../components/common/LoadingButton';
import PageTitle from '../../components/common/PageTitle';

function OrderCheckBoughtLabel() {
  const [labelSearch, setLabelSearch] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { loading, pdfLabelSearch, pdfLabelDownload } = useShopsOrder((state) => state);

  const onSearch = (values) => {
    const onSuccess = (res) => {
      if (res) {
        if (res.length === 0) {
          messageApi.open({
            type: 'success',
            content: 'Không tìm thấy kết quả',
          });
        }
        setLabelSearch(res);
      }
    };
    pdfLabelSearch(values.package_id, onSuccess, () => {});
  };

  const handleDownloadFile = (fileName) => {
    const onSuccess = (res) => {
      if (res) {
        const url = `${c.API_URL}/pdf-download/?filename=${fileName}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
      }
    };

    pdfLabelDownload(fileName, onSuccess, (err) => console.log('pdfLabelDownload: ', err));
  };

  return (
    <div className="p-10">
      {contextHolder}
      <PageTitle title="Kiểm tra Label đã mua theo Package ID" showBack />
      <Form
        onFinish={onSearch}
        onFinishFailed={() => {}}
        className="md:w-[400px] relative border-[1px] border-solid border-[#d9d9d9] rounded-[6px] pr-[90px]"
      >
        <Form.Item name="package_id" className="mb-0">
          <Input
            placeholder="Tìm kiếm theo Package ID..."
            className="!border-none focus:shadow-none bg-transparent rounded-none"
          />
        </Form.Item>
        <Form.Item className="absolute top-[-1px] right-[-1px] bottom-[-1px] mb-0">
          <Button type="primary" htmlType="submit" className="h-[34px]">
            Tìm kiếm
            <LoadingButton loading={loading} />
          </Button>
        </Form.Item>
      </Form>

      {labelSearch.length > 0 && (
        <div className="mt-5">
          {labelSearch.map((label) => (
            <Card
              title={`Thông tin tìm kiếm  cho [ ${label.replace('.pdf', '')} ]`}
              className="mb-3"
              extra={
                <DownloadOutlined onClick={() => handleDownloadFile(label)} className="text-[20px] cursor-pointer" />
              }
            >
              <p>
                <span className="min-w-[70px] inline-block font-semibold">Package ID:</span> {label.replace('.pdf', '')}
              </p>
              <p>
                <span className="min-w-[70px] inline-block font-semibold">Label file:</span>
                {label}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderCheckBoughtLabel;
