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
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import CustomSelect from "./CustomSelect";
import EditPriceForm from "./EditPriceForm";
import TextArea from "antd/es/input/TextArea";
import { useCategoriesStore } from "../../store/categoriesStore";
import { getPathByIndex } from "../../utils";
import { useWareHousesStore } from "../../store/warehousesStore";

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
}) {
  const { getAllCategoriesIsLeaf, categoriesIsLeaf } = useCategoriesStore();
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore();
  const shopId = getPathByIndex(2);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isShowModalPrice, setShowModalPrice] = useState(false);
  const dataPrice = useRef(null);

  useEffect(() => {
    getAllCategoriesIsLeaf(shopId);
    getWarehousesByShopId(shopId);
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

  const convertDataWarehouse = (data) => {
    const result = [];
    data.forEach((item) => {
      result.push({
        label: item.warehouse_name,
        value: item.warehouse_id,
      });
    });
    return result;
  };

  const onSubmit = (value) => {
    console.log("value: ", value);

    const {
      template,
      colors,
      sizes,
      type,
      description,
      category,
      warehouse,
      is_cod_open,
    } = value;
    const dataSubmit = {
      name: template,
      colors: colors,
      sizes: sizes,
      type: type,
      types: {},
      description: description,
      category_id: category,
      warehouse_id: warehouse,
      is_cod_open: is_cod_open,
      package_height: 1,
      package_length: 1,
      package_weight: 1,
      package_width: 1,
    };

    dataPrice.current.forEach((item) => {
      const { type, size } = item;

      if (!dataSubmit.types[type]) {
        dataSubmit.types[type] = {};
      }

      dataSubmit.types[type][size] = {
        // weight: item.weight || 0,
        // length: item.length || 0,
        // width: item.width || 0,
        // height: item.height || 0,
        price: item.price || 0,
        quantity: item.quantity || 0,
      };

      if (item.quantity) {
        dataSubmit.types[type].quantity = item.quantity;
      }
    });
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
    const data = [];
    if (!selectedType || !selectedType.length) return [];

    for (let i = 0; i < selectedSize.length; i++) {
      for (let j = 0; j < selectedType.length; j++) {
        data.push({
          id: `${selectedType[j]}-${selectedSize[i]}`,
          type: selectedType[j],
          size: selectedSize[i],
          quantity: 0,
          price: 0,
          // weight: 0,
          // length: 0,
          // width: 0,
          // height: 0,
        });
      }
    }
    const dataSave = sortByType(data);
    dataPrice.current = dataSave;
    return dataSave;
  };

  const onSavePrice = (value) => {
    console.log("value: ", value);
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
        <Form.Item
          label="Tên template"
          name="template"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn warehouse!",
            },
          ]}
          sx={{ justifyContent: "space-between" }}
          className="w-full"
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

            <Form.Item
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
            </Form.Item>

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
            >
              <TextArea placeholder="Nhập mô tả" rows={4} />
            </Form.Item>

            <div className="mb-3">
              <Form.Item
                name="weight"
                label="Cân nặng"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập cân nặng!",
                  },
                ]}
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
                      name="width"
                      className="break-words flex-nowrap mb-0"
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
                      name="length"
                      className="break-words flex-nowrap mb-0"
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
                      name="height"
                      className="break-words flex-nowrap mb-0"
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
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả!",
                },
              ]}
              sx={{
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "row",
              }}
              layout="horizontal"
              initialValue={false}
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
            >
              <CustomSelect
                optionsSelect={initColorOptions}
                type={"màu"}
                onChange={setSelectedColor}
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
            >
              <CustomSelect
                optionsSelect={initSizeOptions}
                type={"size"}
                onChange={setSelectedSize}
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
            >
              <CustomSelect
                optionsSelect={[]}
                type={"loại"}
                onChange={setSelectedType}
              />
            </Form.Item>

            <Form.Item label="Bad word" name="bad_word" labelAlign="left">
              <CustomSelect
                optionsSelect={initBadWordOptions}
                type={"bad word"}
                onChange={setSelectedType}
              />
            </Form.Item>

            <Form.Item
              label="Suffix of product title"
              name="suffix_title"
              labelAlign="left"
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
                    convertDataTable(selectedType, selectedSize, selectedColor)
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
            Tạo
          </Button>
        </div>
      </Form>
    </div>
  );
}
