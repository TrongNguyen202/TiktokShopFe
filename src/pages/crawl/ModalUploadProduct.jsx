import { Modal, Select, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useProductsStore } from '../../store/productsStore';
import { useShopsStore } from '../../store/shopsStore';
import { useTemplateStore } from '../../store/templateStore';
import { useWareHousesStore } from '../../store/warehousesStore';
import { alerts } from '../../utils/alerts';

export default function ModalUploadProduct({ isShowModalUpload, setShowModalUpload, productList, imagesLimit }) {
  // const shopId = getPathByIndex(2);

  const { getAllTemplate, templates } = useTemplateStore();
  const { stores, getAllStores } = useShopsStore((state) => state);
  const { createProductList, loading } = useProductsStore();
  const { getWarehousesByShopId, warehousesById, loadingWarehouse } = useWareHousesStore();

  // eslint-disable-next-line no-unused-vars
  const [productsJSON, setProductsJSON] = useState(productList);
  console.log('productsJSON: ', productsJSON);
  const [templateJSON, setTemplateJSON] = useState();
  const [warehouseId, setWarehouseId] = useState();
  const [shopId, setShopId] = useState();

  useEffect(() => {
    getAllTemplate();
    // getWarehousesByShopId(shopId);
    getAllStores();
  }, []);

  const convertShopOption = () => {
    const result = [];
    if (!Array.isArray(stores)) return result;
    stores.forEach((item) => {
      const { shop_name, id } = item;
      result.push({
        value: id,
        label: shop_name,
      });
    });
    return result;
  };

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
      .forEach((item) => {
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

  const onSelectShop = (value) => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };
    setShopId(value);
    getWarehousesByShopId(value, onSuccess, onFail);
  };

  const handleCancel = () => {
    setShowModalUpload(false);
  };

  const handleValidateJsonForm = () => {
    const skus = [];
    const titles = [];

    if (!Array.isArray(productsJSON)) {
      message.error('No products found. Please upload excel file.');
      return false;
    }

    for (const item of productsJSON) {
      const { sku, title, images } = item;
      // if (!sku || !title || !warehouse || !images) {
      // if (!title || !image1) {
      //   message.error(
      //     "Excel file is not in the correct format: Missing required field sku, title, warehouse or images"
      //   );
      //   return false;
      // }

      // if (!sku?.trim() || !title?.trim() || !warehouse?.trim()) {
      if (!title?.trim()) {
        message.error('title cannot be empty');
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
    const arr2Length = arr2?.length || 0;

    // Calculate the number of elements to take from imagesLimit
    const numElementsFromArr1 = imagesLimit - arr2Length;

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

  const onSubmit = () => {
    if (!handleValidateJsonForm()) return;
    if (!shopId) {
      message.warning('Please select shop');
      return;
    }
    if (!templateJSON?.id) {
      message.warning('Please select template');
      return;
    }
    if (!warehouseId) {
      message.warning('Please select warehouse');
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
      // types,
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
      const nameShop = stores.find((item) => item.id === shopId)?.shop_name;
      message.success(`Thêm sản phẩm vào shop ${nameShop} thành công`);
      handleCancel();
    };
    const onFail = () => {
      message.error('Thêm sản phẩm thất bại');
    };
    createProductList(shopId, dataSubmit, onSuccess, onFail);
  };

  return (
    <Modal
      open={isShowModalUpload}
      title={`Upload ${productList?.length} Products`}
      okText="Upload"
      onOk={onSubmit}
      loading={loading}
      // footer={null}
      onCancel={handleCancel}
      width={450}
    >
      <Spin spinning={loading}>
        <div className="flex-col flex justify-between mt-10 gap-5">
          <div className="flex-col md:flex-row flex gap-2 md:items-center">
            <p className="font-semibold w-[120px]">Select shop: </p>
            <Select
              showSearch
              style={{
                width: 260,
              }}
              placeholder="Select shop"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={convertShopOption()}
              onChange={(e) => onSelectShop(e)}
            />
          </div>
          <div className="flex-col md:flex-row flex gap-2 md:items-center">
            <p className="font-semibold w-[120px]">Select template: </p>
            <Select
              showSearch
              style={{
                width: 260,
              }}
              placeholder="Select template"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={convertTemplateOption()}
              onChange={onSelectTemplate}
            />
            {/* <Button
            className=""
            type="primary"
            style={{
              width: 200,
            }}
            ghost
            icon={<PlusOutlined />}
            onClick={() => setShowModalAddTemplate(true)}
          >
            Add new template
          </Button> */}
          </div>
          <div className="flex-col md:flex-row flex gap-2 md:items-center">
            <p className="font-semibold w-[120px]">Select warehouse:</p>
            <Select
              showSearch
              style={{
                width: 260,
              }}
              placeholder="Select warehouse"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={convertDataWarehouse(warehousesById.warehouse_list)}
              onChange={(e) => setWarehouseId(e)}
              loading={loadingWarehouse}
            />
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
