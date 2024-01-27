import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import CustomSelect from "./CustomSelect";
import EditPriceForm from "./EditPriceForm";
import TextArea from "antd/es/input/TextArea";
import { useCategoriesStore } from "../../store/categoriesStore";
import { getPathByIndex } from "../../utils";
import { useWareHousesStore } from "../../store/warehousesStore";
import { useTemplateStore } from "../../store/templateStore";

const initColorOptions = [
  {
    label: "Black",
    value: "Black",
  },
  {
    label: "Red",
    value: "Red",
  },
  {
    label: "Yellow",
    value: "Yellow",
  },
  {
    label: "White",
    value: "White",
  },
  {
    label: "Navy",
    value: "Navy",
  },
  {
    label: "Grey",
    value: "Grey",
  },
  {
    label: "Light Pink",
    value: "Light Pink",
  },
];

const initSizeOptions = [
  {
    label: "S",
    value: "S",
  },
  {
    label: "M",
    value: "M",
  },
  {
    label: "L",
    value: "L",
  },
  {
    label: "XL",
    value: "XL",
  },
  {
    label: "2XL",
    value: "2XL",
  },
  {
    label: "3XL",
    value: "3XL",
  },
  {
    label: "4XL",
    value: "4XL",
  },
  {
    label: "5XL",
    value: "5XL",
  },
];

const initBadWordOptions = [
  {
    label: "Tiktok",
    value: "Tiktok",
  },
  {
    label: "Test",
    value: "Test",
  },
  {
    label: "Demo",
    value: "Demo",
  },
];

export default function TemplateForm({
  onSaveTemplate,
  setShowModalAddTemplate,
  templateJson,
}) {
  const { getAllCategoriesIsLeaf, categoriesIsLeaf } = useCategoriesStore();
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore();
  const { createTemplate, templates, loading, getAllTemplate, updateTemplate } =
    useTemplateStore();
  const shopId = getPathByIndex(2);

  const [selectedColor, setSelectedColor] = useState(
    templateJson?.id ? templateJson.colors : []
  );
  const [selectedSize, setSelectedSize] = useState(
    templateJson?.id ? templateJson.sizes : []
  );
  const [selectedType, setSelectedType] = useState(
    templateJson?.id ? templateJson.type : []
  );
  const [isShowModalPrice, setShowModalPrice] = useState(false);
  const dataPrice = useRef(templateJson?.id ? templateJson.types : null);

  useEffect(() => {
    getAllCategoriesIsLeaf(shopId);
  }, []);

  useEffect(() => {
    dataPrice.current = convertDataTable(
      selectedType,
      selectedSize,
      selectedColor
    );
  }, [selectedSize, selectedType]);

  const convertDataCategory = (data) => {
    const result = [];
    data.forEach((item) => {
      result.push({
        label: item.local_display_name,
        value: item.id,
      });
    });
    return result;
  };

  const onSubmit = (value) => {
    const {
      template,
      colors,
      sizes,
      type,
      description,
      category,
      warehouse,
      is_cod_open,
      package_height,
      package_length,
      package_weight,
      package_width,
      bad_word,
      suffix_title,
    } = value;
    const dataSubmit = {
      name: template,
      colors: colors,
      sizes: sizes,
      type: type,
      types: dataPrice.current,
      description: description,
      category_id: category,
      warehouse_id: warehouse,
      is_cod_open: is_cod_open,
      package_height,
      package_length,
      package_weight,
      package_width,
      badWords: bad_word,
      suffixTitle: suffix_title,
    };

    const onSuccess = () => {
      message.success("Thêm template thành công");
      getAllTemplate(shopId);
    };
    const onFail = (err) => {
      message.error(err);
    };
    templateJson?.id
      ? updateTemplate(templateJson?.id, dataSubmit, onSuccess, onFail)
      : createTemplate(dataSubmit, onSuccess, onFail);
    onSaveTemplate(dataSubmit);
    setShowModalAddTemplate(false);
    console.log("dataSubmit: ", dataSubmit);
  };

  function sortByType(arr) {
    return arr.sort((a, b) => {
      if (a.type > b.type) return 1;
      if (a.type < b.type) return -1;
      return 0;
    });
  }

  const convertDataTable = (selectedType, selectedSize, selectedColor) => {
    let data = [];

    if (templateJson?.id) {
      data = templateJson.types;
    } else {
      if (!selectedType || !selectedType.length) return [];

      for (let i = 0; i < selectedSize.length; i++) {
        for (let j = 0; j < selectedType.length; j++) {
          data.push({
            id: `${selectedType[j]}-${selectedSize[i]}`,
            type: selectedType[j],
            size: selectedSize[i],
            quantity: 0,
            price: 0,
          });
        }
      }
    }
    const dataSave = sortByType(data);
    dataPrice.current = dataSave;
    return dataSave;
  };

  const onSavePrice = (value) => {
    dataPrice.current = value;
  };

  return (
    <div>
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
        className="mt-2"
      >
        <Spin spinning={loading}>
          <Form.Item
            label="Tên template"
            name="template"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên template!",
              },
            ]}
            sx={{ justifyContent: "space-between" }}
            className="w-full"
            initialValue={templateJson?.id ? templateJson.name : ""}
          >
            <Input placeholder="Nhập tên template" />
          </Form.Item>
          <div className="flex gap-20">
            <div className="flex-1">
              <p className="font-semibold text-[#0e2482] text-[16px]">
                1. Các thông số chung
              </p>
              <Form.Item
                label="Category"
                name="category"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn category!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={templateJson?.id ? templateJson.category_id : ""}
              >
                <Select
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  placeholder="Chọn category"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={convertDataCategory(categoriesIsLeaf)}
                />
              </Form.Item>

              {/* <Form.Item
                label="Warehouse"
                name="warehouse"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn warehouse!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                className="w-full"
                initialValue={templateJson?.id ? templateJson.warehouse_id : ""}
              >
                <Select
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  placeholder="Chọn warehouse"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={convertDataWarehouse(warehousesById)}
                />
              </Form.Item> */}

              <Form.Item
                label="Mô tả"
                name="description"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={templateJson?.id ? templateJson.description : ""}
              >
                <TextArea placeholder="Nhập mô tả" rows={4} />
              </Form.Item>

              <div className="mb-3">
                <Form.Item
                  name="package_weight"
                  label="Cân nặng"
                  labelAlign="left"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập cân nặng!",
                    },
                  ]}
                  initialValue={
                    templateJson?.id ? templateJson.package_weight : ""
                  }
                >
                  <Input
                    placeholder="nhập vào(gram)"
                    type="number"
                    className="w-[300px] "
                    suffix={
                      <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-2 my-1">
                        gr
                      </span>
                    }
                  />
                </Form.Item>

                <Row
                  gutter={[15, 15]}
                  className="items-center gap-2 justify-start break-words flex-nowrap"
                >
                  <Col>
                    <div className="flex justify-between items-center h-[30px]">
                      <Form.Item
                        name="package_width"
                        className="break-words flex-nowrap mb-0"
                        initialValue={
                          templateJson?.id ? templateJson.package_width : ""
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập chiều rộng!",
                          },
                        ]}
                      >
                        <Input
                          style={{ height: "30px", width: "150px" }}
                          placeholder="Width"
                          suffix={
                            <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                              cm
                            </span>
                          }
                        />
                      </Form.Item>
                      <p className="mx-2 text-[#ccc]">X</p>
                      <Form.Item
                        name="package_length"
                        className="break-words flex-nowrap mb-0"
                        initialValue={
                          templateJson?.id ? templateJson.package_length : ""
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập chiều dài!",
                          },
                        ]}
                      >
                        <Input
                          style={{ height: "30px", width: "150px" }}
                          placeholder="Length"
                          suffix={
                            <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                              cm
                            </span>
                          }
                        />
                      </Form.Item>
                      <p className="mx-2 text-[#ccc]">X</p>
                      <Form.Item
                        name="package_height"
                        className="break-words flex-nowrap mb-0"
                        initialValue={
                          templateJson?.id ? templateJson.package_height : ""
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập chiều cao!",
                          },
                        ]}
                      >
                        <Input
                          style={{ height: "30px", width: "150px" }}
                          placeholder=""
                          suffix={
                            <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                              cm
                            </span>
                          }
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>

              <Form.Item
                label="Bật COD"
                name="is_cod_open"
                labelAlign="left"
                sx={{
                  justifyContent: "space-between",
                  display: "flex",
                  flexDirection: "row",
                }}
                layout="horizontal"
                initialValue={
                  templateJson?.id ? templateJson.is_cod_open : false
                }
              >
                <Switch
                  // checked={input}
                  checkedChildren="Bật"
                  unCheckedChildren="Tắt"
                  // onChange={() => {
                  //   setInput(!input);
                  // }}
                />
              </Form.Item>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#0e2482] text-[16px]">
                2. Các thông số riêng cho mỗi hàng
              </p>
              <Form.Item
                label="Màu"
                name="colors"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng lựa chọn màu!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={selectedColor}
              >
                <CustomSelect
                  optionsSelect={initColorOptions}
                  type={"màu"}
                  onChange={setSelectedColor}
                  selectedDefault={selectedColor}
                />
              </Form.Item>

              <Form.Item
                label="Size"
                name="sizes"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn size!",
                  },
                ]}
                initialValue={selectedSize}
              >
                <CustomSelect
                  optionsSelect={initSizeOptions}
                  type={"size"}
                  onChange={setSelectedSize}
                  selectedDefault={selectedSize}
                />
              </Form.Item>

              <Form.Item
                label="Loại"
                name="type"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn size!",
                  },
                ]}
                initialValue={selectedType}
              >
                <CustomSelect
                  optionsSelect={[]}
                  type={"loại"}
                  onChange={setSelectedType}
                  selectedDefault={selectedType}
                />
              </Form.Item>

              <Form.Item
                label="Bad word"
                name="bad_word"
                labelAlign="left"
                initialValue={templateJson?.id ? templateJson.badWords : []}
              >
                <CustomSelect
                  optionsSelect={initBadWordOptions}
                  type={"bad word"}
                  selectedDefault={
                    templateJson?.id ? templateJson.badWords : []
                  }
                  // onChange={setSelectedType}
                />
              </Form.Item>

              <Form.Item
                label="Suffix of product title"
                name="suffix_title"
                labelAlign="left"
                initialValue={templateJson?.id ? templateJson.suffixTitle : ""}
              >
                <Input placeholder="Thêm suffix" />
              </Form.Item>

              <Button
                type="primary"
                ghost
                onClick={() => setShowModalPrice(true)}
                icon={<EditOutlined />}
                className="block ml-auto mt-9"
              >
                Chỉnh sửa giá
              </Button>

              {isShowModalPrice && (
                <Modal
                  title="Chỉnh sửa giá"
                  open={isShowModalPrice}
                  // onOk={onRefuse}
                  onCancel={() => {
                    setShowModalPrice(false);
                  }}
                  footer={null}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  width={800}
                  maskClosable={false}
                >
                  <EditPriceForm
                    selectedSize={selectedSize}
                    setShowModalPrice={(value) => setShowModalPrice(value)}
                    onSavePrice={onSavePrice}
                    dataPrice={
                      dataPrice.current ||
                      convertDataTable(
                        selectedType,
                        selectedSize,
                        selectedColor
                      )
                    }
                  />
                </Modal>
              )}
            </div>
          </div>
          <div className="w-[400px] mx-auto">
            <Button
              className="mt-4 w-[200px]"
              block
              type="primary"
              htmlType="submit"
            >
              {templateJson?.id ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </Spin>
      </Form>
    </div>
  );
}
