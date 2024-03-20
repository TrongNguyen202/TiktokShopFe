import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Select, Spin, message } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import * as xlsx from 'xlsx';
import ContentHeader from '../../components/content-header/index';
import { useProductsStore } from '../../store/productsStore';
import { useTemplateStore } from '../../store/templateStore';
import { useWareHousesStore } from '../../store/warehousesStore';
import { alerts } from '../../utils/alerts';
import { getToken } from '../../utils/auth';
import { getPathByIndex } from '../../utils/index';
import TemplateForm from './TemplateForm';

function MultiAddProducts() {
  const navigate = useNavigate();
  const customerTokenKey = getToken();
  const shopId = getPathByIndex(2);

  const { getAllTemplate, templates } = useTemplateStore();
  const { createProductList, loading } = useProductsStore();
  const { getWarehousesByShopId, warehousesById } = useWareHousesStore();

  const [productsJSON, setProductsJSON] = useState();
  const [templateJSON, setTemplateJSON] = useState();
  const [isShowModalAddTemplate, setShowModalAddTemplate] = useState(false);
  const [warehouseId, setWarehouseId] = useState();

  useEffect(() => {
    getAllTemplate();
    getWarehousesByShopId(shopId);
  }, []);

  const convertTemplateOption = () => {
    const result = [];
    if (!Array.isArray(templates)) return result;
    templates.forEach((item) => {
      const { name, id } = item;
      result.push({
        value: id,
        label: name,
      });
    });
    return result;
  };

  const convertDataWarehouse = (data) => {
    if (!data || !Array.isArray(data) || !data.length) return [];
    const result = [];
    data
      ?.filter((item) => item.warehouse_type === 1)
      ?.forEach((item) => {
        result.push({
          label: item.warehouse_name,
          value: item.warehouse_id,
        });
      });
    return result;
  };

  const onSelectTemplate = (value) => {
    const template = templates.find((item) => item.id === value);
    setTemplateJSON(template);
  };

  const readUploadFile = (files) => {
    if (files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        let convertJson = [];
        if (Array.isArray(jsonData) && jsonData.length) {
          convertJson = jsonData.map((item) => {
            const { sku, title, warehouse, image1, image2, image3, image4, image5, image6, image7, image8, image9 } =
              item;
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
        convertJson = convertJson.map((item) => {
          const { images } = item;
          const newImages = Object.keys(images).reduce((acc, key) => {
            if (images[key]) {
              acc[key] = images[key];
            }
            return acc;
          }, {});
          return {
            ...item,
            images: newImages,
          };
        });
        setProductsJSON(convertJson);
      };
      reader.readAsArrayBuffer(files);
    }
  };

  const handleBeforeUpload = (file) => {
    const maxSize = 5 * 1024 * 1024; // Kích thước tối đa cho phép (5MB)

    if (file.size > maxSize) {
      alerts.error('Kích thước tệp quá lớn. Vui lòng chọn một tệp có dung lượng dưới 5MB.');
      return false;
    }

    const extension = file.name.split('.').pop();

    if (extension !== 'xlsx') {
      message.error('Chỉ được upload file excel(xlsx)');
      return false;
    }

    return true;
  };

  const convertDataSku = () => {
    const { types } = templateJSON ?? {};
    const result = [];
    templateJSON.colors.forEach((color) => {
      types.forEach((item) => {
        const obj = {};
        obj.sales_attributes = [
          {
            attribute_name: 'Color',
            custom_value: color,
            attribute_id: '100000',
          },
          {
            attribute_name: 'Size',
            custom_value: item.id,
            attribute_id: '7322572932260136746',
          },
        ];
        obj.original_price = item.price;
        obj.stock_infos = [{ warehouse_id: warehouseId, available_stock: item.quantity }];
        obj.seller_sku = productsJSON.sku || '';
        result.push(obj);
      });
    });

    return result;
  };

  const handleValidateJsonForm = () => {
    const skus = [];
    const titles = [];

    if (!Array.isArray(productsJSON)) {
      message.error('No products found. Please upload excel file.');
      return false;
    }

    for (const item of productsJSON) {
      const { sku, title, warehouse, images } = item;
      // if (!sku || !title || !warehouse || !images) {
      if (!title || !images) {
        message.error(
          'Excel file is not in the correct format: Missing required field sku, title, warehouse or images',
        );
        return false;
      }

      // if (!sku?.trim() || !title?.trim() || !warehouse?.trim()) {
      if (!title?.trim()) {
        message.error('sku, title or warehouse cannot be empty');
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
    }

    const duplicateTitles = titles.filter((title, index) => {
      return titles.indexOf(title) !== index;
    });

    if (duplicateTitles.length > 0) {
      message.error(`Duplicate titles found: ${duplicateTitles.join('; ')}`);
      return false;
    }
    return true;
  };

  function mergeArrays(obj1, arr2) {
    // Convert object to array
    const arr1 = Object.values(obj1);
    const arr1Length = arr1.length || 0;
    const arr2Length = arr2?.length || 0;

    // Calculate the number of elements to take from arr1
    const numElementsFromArr1 = 9 - arr2Length;

    // Take the first numElementsFromArr1 elements from arr1
    const elementsFromArr1 = arr1.slice(0, numElementsFromArr1);

    // Concatenate elementsFromArr1 and arr2
    const mergedArray = elementsFromArr1.concat(arr2);

    // Convert array back to object
    const result = mergedArray.reduce((obj, value, index) => {
      obj[`image${index + 1}`] = value;
      return obj;
    }, {});

    const result2 = Object.keys(result).reduce((obj, key) => {
      if (result[key]) {
        obj[key] = result[key];
      }
      return obj;
    }, {});

    return result2;
  }

  const sanitizeTitles = (documents) => {
    const { badWords, suffixTitle } = templateJSON ?? {};
    return documents.map((doc) => {
      let { title } = doc;

      if (badWords && badWords.length > 0) {
        badWords.forEach((word) => {
          const regex = new RegExp(word, 'gi');
          title = title.replace(regex, '');
        });
      }
      if (suffixTitle) {
        title += ` ${suffixTitle}`;
      }
      doc.title = title.trim();
      doc.images = mergeArrays(doc.images, templateJSON.fixed_images);
      return doc;
    });
  };

  const onSubmit = () => {
    if (!handleValidateJsonForm()) return;
    if (!templateJSON?.id) {
      message.error('Please select template');
      return;
    }
    if (!warehouseId) {
      message.error('Please select warehouse');
      return;
    }
    const {
      category_id,
      is_cod_open,
      warehouse_id,
      package_height,
      package_length,
      package_weight,
      package_width,
      description,
      types,
      size_chart,
    } = templateJSON ?? {};
    const dataSubmit = {
      excel: sanitizeTitles(productsJSON),
      category_id: String(category_id[category_id.length - 1]),
      warehouse_id,
      package_height,
      package_length,
      package_weight,
      package_width,
      is_cod_open,
      skus: convertDataSku(),
      description,
      size_chart,
    };
    console.log('dataSubmit: ', dataSubmit);
    const onSuccess = () => {
      message.success('Thêm sản phẩm thành công');
      navigate(`/shops/${shopId}/products`);
    };
    const onFail = () => {
      message.error('Thêm sản phẩm thất bại');
    };
    createProductList(shopId, dataSubmit, onSuccess, onFail);
  };

  const props = {
    name: 'excel',
    maxCount: 1,
    accept: '.xlsx, .xls',
    action: `https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188`,
    headers: { 'customer-token': customerTokenKey },
    method: 'POST',
    beforeUpload: handleBeforeUpload,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        readUploadFile(info.file.originFileObj);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className="w-[90%] mx-auto">
      <Spin spinning={loading}>
        <Row className="block">
          <Row>
            <Col>
              <ContentHeader title="Thêm hàng loạt" />
            </Col>
          </Row>

          <Row className="mt-[15px]">
            <Col span={24}>
              <p className="pb-4">Sau khi hoàn thành chỉnh sửa, vui lòng đăng tập tin Excel lên.</p>
              {/* drag and dropped area */}
              <Dragger
                {...props}
                className="mt-[100px] mr-4 inset-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f5f5f5] border w-full h-[180px]"
              >
                <p className="ant-upload-drag-icon ">
                  <CloudUploadOutlined />
                </p>
                <p className="ant-upload-text">Chọn hoặc kéo file excel vào đây </p>
                <p className="text-[#c4c4c4]">Kích thước file tối đa: 10MB</p>
                <p className="text-[#e34e4e]">Lưu ý file tải lên phải theo định dạng là file excel (xlsx) !</p>
              </Dragger>
            </Col>
          </Row>
        </Row>
        <div className="flex-col md:flex-row flex justify-between mt-20 gap-5">
          <div className="flex-col md:flex-row flex gap-3 md:items-center">
            <p className="font-semibold">Chọn template: </p>
            <Select
              showSearch
              style={{
                width: 200,
              }}
              placeholder="Chọn template"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={convertTemplateOption()}
              onChange={onSelectTemplate}
            />
            <Button
              className=""
              type="primary"
              style={{
                width: 200,
              }}
              ghost
              icon={<PlusOutlined />}
              onClick={() => setShowModalAddTemplate(true)}
            >
              Thêm mới template
            </Button>
          </div>
          <div className="flex-col md:flex-row flex gap-2 md:items-center">
            <p className="font-semibold">Chọn warehouse:</p>
            <Select
              showSearch
              style={{
                width: 260,
              }}
              placeholder="Chọn warehouse"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={convertDataWarehouse(warehousesById.warehouse_list)}
              onChange={(e) => setWarehouseId(e)}
            />
          </div>
        </div>
        <div className="text-end pr-20">
          <Button type="primary" className="mt-20" onClick={onSubmit}>
            Thêm sản phẩm
          </Button>
        </div>
      </Spin>

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
          <TemplateForm onSaveTemplate={setTemplateJSON} setShowModalAddTemplate={setShowModalAddTemplate} />
        </Modal>
      )}
    </div>
  );
}

export default MultiAddProducts;
