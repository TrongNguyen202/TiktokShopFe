import { DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Popconfirm, Space, Table, Tooltip, Upload } from 'antd';
import Search from 'antd/es/transfer/search';
import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useTemplateStore } from '../../store/templateStore';
import { alerts } from '../../utils/alerts';
import TemplateForm from '../stores/TemplateForm';
import { TemplateItem } from '../../types/templateItem';

function Template() {
  const { getAllTemplate, templates, loading, deleteTemplate } = useTemplateStore();

  const [templateSelected, setTemplateSelected] = useState<TemplateItem | null>();
  const [isShowModal, setShowModal] = useState(false);
  const [templatesData, setTemplateData] = useState<TemplateItem[]>([]);

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err: string) => {
      alerts.error(err);
    };
    getAllTemplate(onSuccess, onFail);
  }, []);

  useEffect(() => {
    setTemplateData(templates);
  }, [JSON.stringify(templates)]);

  const handleDeleteTemplate = (id: number) => {
    const onSuccess = () => {
      alerts.success('Xoá template thành công');
      getAllTemplate();
    };
    const onFail = (err: string) => {
      alerts.error(err);
    };
    deleteTemplate(String(id), onSuccess, onFail);
  };

  const handleDownload = (template: TemplateItem) => {
    // Thêm trường để đánh dấu là file download
    const dataTemplate = { ...template, isFromFile: true };
    const json = JSON.stringify(dataTemplate);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'template.json';
    link.href = url;
    link.click();
  };

  const handleFileUpload = (file: any) => {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const data = JSON.parse(event.target.result);
      setTemplateSelected(data);
      setShowModal(true);
    };

    reader.readAsText(file);
    return false;
  };

  const storesTable: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (store1: TemplateItem, store2: TemplateItem) => +store1.id - +store2.id,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, store: TemplateItem) => (
        <p
          className="text-[#0e2482] font-medium cursor-pointer"
          onClick={() => {
            setShowModal(true);
            setTemplateSelected(store);
          }}
        >
          {name}
        </p>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <div>
          <div dangerouslySetInnerHTML={{ __html: description }} className="line-clamp-4" />
        </div>
      ),
    },
    // {
    //   title: "Cân nặng",
    //   dataIndex: "package_weight",
    //   key: "package_weight",
    // },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (banner: TemplateItem) => {
        return (
          <Space size="middle">
            <Tooltip title="Download" color="blue">
              <Button
                size="small"
                icon={<DownloadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                onClick={() => {
                  handleDownload(banner);
                }}
              />
            </Tooltip>
            <Tooltip title="Sửa" color="blue">
              <Button
                size="small"
                icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                onClick={() => {
                  setShowModal(true);
                  setTemplateSelected(banner);
                }}
              />
            </Tooltip>
            <Popconfirm
              placement="topRight"
              title="Bạn có thực sự muốn xoá template này?"
              onConfirm={() => handleDeleteTemplate(banner.id)}
            >
              <Tooltip title="Xóa" color="red">
                <Button
                  size="small"
                  icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  danger
                  //   onClick={() => handleDeleteBanner(banner.id)}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const toggleModal = (value: boolean) => {
    setShowModal(value);
  };

  const onSearch = (e: any) => {
    const storesFilter = templates?.filter((item) => {
      return item.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setTemplateData(storesFilter);
  };

  return (
    <Layout.Content className="mt-4 px-5">
      <p className="my-5 font-semibold text-[20px]">Danh sách template</p>
      <div className="mb-4 flex justify-between">
        <div className="w-[400px]">
          <Search placeholder="Tìm kiếm..." onChange={onSearch} />
        </div>
        <div className="flex gap-2">
          <Tooltip title="Upload" color="blue">
            <Upload accept=".json" beforeUpload={handleFileUpload} multiple={false}>
              <Button icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
                Thêm bằng file
              </Button>
            </Upload>
          </Tooltip>
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
              setTemplateSelected(null);
            }}
          >
            Thêm template
          </Button>
        </div>
      </div>

      <Table
        columns={storesTable}
        scroll={{ x: true }}
        size="middle"
        bordered
        dataSource={templatesData && templatesData.length ? templatesData : []}
        loading={loading}
        pagination={{
          pageSize: 20,
        }}
      />
      {isShowModal && (
        <Modal
          open={isShowModal}
          onCancel={() => {
            setShowModal(false);
            setTemplateSelected(null);
          }}
          centered
          footer={null}
          width={1000}
          maskClosable={false}
        >
          <TemplateForm
            onSaveTemplate={() => {}}
            setShowModalAddTemplate={toggleModal}
            templateJson={templateSelected}
          />
        </Modal>
      )}
    </Layout.Content>
  );
}

export default Template;
