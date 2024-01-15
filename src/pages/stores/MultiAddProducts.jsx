import { CloudUploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Select } from "antd";
import Dragger from "antd/es/upload/Dragger.js";
import { useNavigate } from "react-router-dom";

import * as xlsx from "xlsx";
import ContentHeader from "../../components/content-header/index.jsx";
import { constants as c } from "../../constants";
import { alerts } from "../../utils/alerts.js";
import { getToken } from "../../utils/auth.js";
import { useState } from "react";
import { message, Upload } from "antd";
import TemplateForm from "./TemplateForm.jsx";
import { useProductsStore } from "../../store/productsStore.js";
import { getPathByIndex } from "../../utils/index.js";

const MultiAddProducts = () => {
  const navigate = useNavigate;
  const customerTokenKey = getToken();
  const shopId = getPathByIndex(2)

  const { createProductList } = useProductsStore();

  const [productsJSON, setProductsJSON] = useState();
  const [templateJSON, setTemplateJSON] = useState();
  const [isShowModalAddTemplate, setShowModalAddTemplate] = useState(false);

  const readUploadFile = (files) => {
    console.log("files: ", files);
    if (files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        let convertJson = [];
        if (Array.isArray(jsonData) && jsonData.length) {
          convertJson = jsonData.map((item) => {
            const {
              sku,
              title,
              warehouse,
              image1,
              image2,
              image3,
              image4,
              image5,
              image6,
              image7,
              image8,
              image9,
            } = item;
            return {
              sku: sku || null,
              title: title || null,
              warehouse: warehouse || null,
              images: {
                image1: image1 || null,
                image2: image2 || null,
                image3: image3 || null,
                image4: image4 || null,
                image5: image5 || null,
                image6: image6 || null,
                image7: image7 || null,
                image8: image8 || null,
                image9: image9 || null,
              },
            };
          });
        }
        setProductsJSON(convertJson);
      };
      reader.readAsArrayBuffer(files);
    }
  };

  const handleBeforeUpload = (file) => {
    const maxSize = 5 * 1024 * 1024; // Kích thước tối đa cho phép (5MB)

    if (file.size > maxSize) {
      alerts.error(
        "Kích thước tệp quá lớn. Vui lòng chọn một tệp có dung lượng dưới 5MB."
      );
      return false;
    }

    const extension = file.name.split(".").pop();

    if (extension !== "xlsx") {
      message.error("Chỉ được upload file excel(xlsx)");
      return false;
    }

    return true;
  };

  const convertDataSku = () => {
    const { category_id, colors, sizes, types, type, warehouse_id } =
      templateJSON ?? {};
    const result = [];
    type.forEach((type) => {
      // colors.forEach((color) => {
      Object.keys(types[type]).forEach((size) => {
        let obj = {
          sales_attributes: [
            {
              attribute_id: "100000",
              attribute_name: "Type",
              custom_value: type,
            },
            {
              attribute_id: "7322572932260136746",
              attribute_name: "Size",
              custom_value: size,
            },
          ],
          original_price: types[type][size].price,
          stock_infos: [
            {
              warehouse_id: warehouse_id,
              available_stock: 100000,
            },
          ],
        };
        result.push(obj);
        // });
      });
    });
    return result;
  };

  function handleValidateJsonForm() {
    const skus = [];
    const titles = [];

    let errorMessages = [];

    if (!Array.isArray(productsJSON)) {
      message.error("No products found!");
      return false;
    }

    productsJSON.forEach((item) => {
      const { sku, title, warehouse, images } = item;
      if (!sku || !title || !warehouse || !images) {
        message.error("Missing required field sku, title, warehouse or images");
        return false;
      }

      if (!sku?.trim() || !title?.trim() || !warehouse?.trim()) {
        message.error("sku, title or warehouse cannot be empty");
        return false;
      }

      if (
        !images.image1 &&
        !images.image2 &&
        !images.image3 &&
        !images.image4 &&
        !images.image5 &&
        !images.image6 &&
        !images.image7 &&
        !images.image8 &&
        !images.image9
      ) {
        message.error(`${sku}: Images must have at least one image url`);
        return false;
      }

      skus.push(sku);
      titles.push(title);
    });

    const duplicateTitles = titles.filter((title, index) => {
      return titles.indexOf(title) !== index;
    });

    if (duplicateTitles.length > 0) {
      message.error("Duplicate titles found: " + duplicateTitles.join("; "));
      return false;
    }
  }

  const onSubmit = () => {
    // if (!handleValidateJsonForm()) return;
    const {
      category_id,
      is_cod_open,
      warehouse_id,
      package_height,
      package_length,
      package_weight,
      package_width,
      description
    } = templateJSON ?? {};
    const dataSubmit = {
      excel: productsJSON,
      category_id,
      warehouse_id,
      package_height,
      package_length,
      package_weight,
      package_width,
      is_cod_open,
      skus: convertDataSku(),
      description
    };
    const onSuccess = () => {
      message.success("Thêm sản phẩm thành công");
      navigate("/stores/products");
    };
    const onFail = () => {
      message.error("Thêm sản phẩm thất bại");
    };
    createProductList(shopId, dataSubmit, onSuccess, onFail);
  };

  const props = {
    name: "excel",
    maxCount: 1,
    accept: ".xlsx, .xls",
    // action: `${c.API_URL}/store/v1/products/import_excel`,
    action: `https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188`,
    headers: { "customer-token": customerTokenKey },
    method: "POST",
    beforeUpload: handleBeforeUpload,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        readUploadFile(info.file.originFileObj);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="w-[90%] mx-auto">
      <Row className="block">
        <Row>
          <Col>
            <ContentHeader title="Thêm hàng loạt" />
          </Col>
        </Row>

        <Row className="mt-[15px]">
          <Col span={24}>
            <p className="pb-4">
              Sau khi hoàn thành chỉnh sửa, vui lòng đăng tập tin Excel lên.
            </p>
            {/* drag and dropped area */}
            <Dragger
              {...props}
              className="mt-[100px] mr-4 inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f5f5f5] border w-full h-[180px]"
            >
              <p className="ant-upload-drag-icon ">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Chọn hoặc kéo file excel vào đây{" "}
              </p>
              <p className="text-[#c4c4c4]">Kích thước file tối đa: 10MB</p>
              <p className="text-[#e34e4e]">
                Lưu ý file tải lên phải theo định dạng là file excel (xlsx) !
              </p>
            </Dragger>
          </Col>
        </Row>
      </Row>
      <div className="mt-20 flex gap-3 items-center">
        <p className="font-semibold">Chọn template: </p>
        <Select
          showSearch
          style={{
            width: 200,
          }}
          placeholder="Chọn template"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={[
            {
              value: "1",
              label: "Not Identified",
            },
            {
              value: "2",
              label: "Closed",
            },
            {
              value: "3",
              label: "Communicated",
            },
            {
              value: "4",
              label: "Identified",
            },
            {
              value: "5",
              label: "Resolved",
            },
            {
              value: "6",
              label: "Cancelled",
            },
          ]}
        />
        <Button
          className=""
          type="primary"
          ghost
          icon={<PlusOutlined />}
          onClick={() => setShowModalAddTemplate(true)}
        >
          Thêm mới template
        </Button>
      </div>
      <div className="text-end pr-20">
        <Button type="primary" className="mt-20" onClick={onSubmit}>
          Thêm sản phẩm
        </Button>
      </div>

      {isShowModalAddTemplate && (
        <Modal
          title="Tạo template"
          open={isShowModalAddTemplate}
          // onOk={onRefuse}
          onCancel={() => {
            setShowModalAddTemplate(false);
          }}
          centered
          footer={null}
          okText="Đồng ý"
          cancelText="Hủy"
          maskClosable={false}
          width={1000}
        >
          <TemplateForm
            onSaveTemplate={setTemplateJSON}
            setShowModalAddTemplate={setShowModalAddTemplate}
          />
        </Modal>
      )}
    </div>
  );
};

export default MultiAddProducts;
