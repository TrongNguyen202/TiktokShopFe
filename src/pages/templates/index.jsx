import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Layout, Modal, Popconfirm, Space, Table, Tooltip } from "antd";
import Search from "antd/es/transfer/search";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useShopsStore } from "../../store/shopsStore";
import { useTemplateStore } from "../../store/templateStore";
import { alerts } from "../../utils/alerts";
import TemplateForm from "../stores/TemplateForm";

const Template = () => {
  const navigate = useNavigate();
  const { getAllTemplate, templates, loading, deleteTemplate } = useTemplateStore();

  const [templateSelected, setTemplateSelected] = useState(null);
  console.log("templateSelected: ", templateSelected);
  const [isShowModal, setShowModal] = useState(false);

 const handleDeleteTemplate = (id) => {
    const onSuccess = (res) => {
        alerts.success("Xoá template thành công");
        getAllTemplate();
        };
        const onFail = (err) => {
        alerts.error(err);
        };
        deleteTemplate(id, onSuccess, onFail);
    };


  const storesTable = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      sorter: (store1, store2) => +store1.id - +store2.id,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name, store) => (
        <p
          className="text-[#0e2482] font-medium cursor-pointer"
          onClick={() => {
            navigate(`/shops/${store.id}`, { state: { store } });
          }}
        >
          {name}
        </p>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      //   render: (code, seller) => (
      //     <p
      //       className='text-[#0e2482] font-medium cursor-pointer'
      //     >
      //       {code}
      //     </p>
      //   ),
    },
    {
      title: "Cân nặng",
      dataIndex: "package_weight",
      key: "package_weight",
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      align: "center",
      render: (banner) => {
        return (
          <Space size="middle">
            <Tooltip title="Sửa" color="blue">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setShowModal(true);
                  setTemplateSelected(banner);
                  //   setSelectedBanner(banner)
                  //   setImage(banner.image_url)
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
                  icon={<DeleteOutlined />}
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

  useEffect(() => {
    const onSuccess = (res) => {
      console.log("res: ", res);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    getAllTemplate(onSuccess, onFail);
  }, []);

  const toggleModal = (value) => {
    setShowModal(value);
  };

  return (
    <Layout.Content className="mt-4 px-5">
      <p className="my-5 font-semibold text-[20px]">Danh sách template</p>
      <div className="mb-4 flex justify-between">
        <div className="w-[400px]">
          <Search placeholder="Tìm kiếm..." name="search" />
        </div>
        <Button type="primary" onClick={() => {
            setShowModal(true)
            setTemplateSelected(null)
        }}>
          Thêm template
        </Button>
      </div>

      <Table
        columns={storesTable}
        scroll={{ x: true }}
        size="middle"
        bordered
        dataSource={templates && templates.length ? templates : []}
        loading={loading}
      />
      {isShowModal && (
        <Modal
          open={isShowModal}
          onCancel={() => {
            setShowModal(false);
          }}
          centered
          footer={null}
          width={1000}
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
};

export default Template;
