import { Modal, Select, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useProductsStore } from '../../store/productsStore';
import { useShopsStore } from '../../store/shopsStore';
import { useTemplateStore } from '../../store/templateStore';
import { useWareHousesStore } from '../../store/warehousesStore';
import { ProductItemCrawl } from '../../types/productItem';
import { TemplateItem, TypesItem } from '../../types/templateItem';
import { alerts } from '../../utils/alerts';

type SelectOption = {
  value: string;
  label: string;
};

type WarehouseById = {
  warehouse_type: number;
  warehouse_name: string;
  warehouse_id: string;
  warehouse_list: any[];
};

type DetailMessage = {
  message: string;
  data: any;
};

type ErrorItem = {
  status: string;
  title: string;
  order_in_excel: string;
  detail: DetailMessage;
};

export default function ModalUploadProduct({
  isShowModalUpload,
  setShowModalUpload,
  productList,
  imagesLimit = 9,
  setModalErrorInfo,
}: {
  isShowModalUpload: boolean;
  setShowModalUpload: (value: React.SetStateAction<boolean>) => void;
  productList?: ProductItemCrawl[];
  imagesLimit?: number;
  setModalErrorInfo?: (value: React.SetStateAction<any>) => void;
}) {
  // const shopId = getPathByIndex(2);

  const { getAllTemplate, templates } = useTemplateStore();
  const { stores, getAllStores } = useShopsStore((state) => state);
  const { createProductList, loading } = useProductsStore();
  const { getWarehousesByShopId, warehousesById, loadingWarehouse } = useWareHousesStore();
  const [templateJSON, setTemplateJSON] = useState<TemplateItem>();
  const [warehouseId, setWarehouseId] = useState();
  const [shopId, setShopId] = useState<string>();
  const productsJSON = productList;

  useEffect(() => {
    getAllTemplate();
    // getWarehousesByShopId(shopId);
    getAllStores();
  }, []);

  const convertShopOption = () => {
    const result: SelectOption[] = [];
    if (!Array.isArray(stores)) return result;
    stores.forEach((item) => {
      const { shop_name: shopName, id } = item;
      result.push({
        value: String(id),
        label: String(shopName),
      });
    });
    return result;
  };

  const convertTemplateOption = () => {
    const result: SelectOption[] = [];
    if (!Array.isArray(templates)) return result;
    templates.forEach((item) => {
      const { name, id } = item;
      result.push({
        value: String(id),
        label: String(name),
      });
    });
    return result;
  };

  const convertDataWarehouse = (data: WarehouseById[]) => {
    if (!data || !Array.isArray(data) || !data.length) return [];
    const result: SelectOption[] = [];
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

  const onSelectTemplate = (value: string) => {
    const template = templates.find((item) => item.id === Number(value));
    setTemplateJSON(template);
  };

  const onSelectShop = (value: number) => {
    const onSuccess = () => {};
    const onFail = (err: string) => {
      alerts.error(err);
    };
    setShopId(String(value));
    getWarehousesByShopId(String(value), onSuccess, onFail);
  };

  const handleCancel = () => {
    setShowModalUpload(false);
  };

  const handleValidateJsonForm = () => {
    const skus = [];
    const titles: string[] = [];

    if (!Array.isArray(productsJSON)) {
      message.error('No products found. Please upload excel file.');
      return false;
    }

    for (const item of productsJSON) {
      const { sku, title } = item;
      if (!title?.trim()) {
        message.error('title cannot be empty');
        return false;
      }

      // if (
      //   !images?.image1 &&
      //   !images?.image2 &&
      //   !images?.image3 &&
      //   !images?.image4 &&
      //   !images?.image5 &&
      //   !images?.image6 &&
      //   !images?.image7 &&
      //   !images?.image8 &&
      //   !images?.image9
      // ) {
      //   message.error(`${sku}: Images must have at least one image url`);
      //   return false;
      // }

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

  function mergeArrays(obj1: any, arr2: any) {
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
    const result = mergedArray.reduce((obj: Record<string, string>, value: any, index) => {
      obj[`image${index + 1}`] = value?.replace('data:image/png;base64,', '');
      return obj;
    }, {});

    const result2 = Object.keys(result).reduce((obj: any, key: any) => {
      if (result[key]) {
        obj[key] = result[key];
      }
      return obj;
    }, {});

    return result2;
  }

  const sanitizeTitles = (documents: ProductItemCrawl[]) => {
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
      doc.images = mergeArrays(doc.images, templateJSON?.fixed_images);
      return doc;
    });
  };

  const convertDataSku = () => {
    const { types } = templateJSON ?? {};
    const result: any[] = [];
    templateJSON?.colors.forEach((color) => {
      types?.forEach((item: TypesItem) => {
        const obj: TypesItem = {};
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
        obj.seller_sku = '';
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
      category_id: categoryId,
      is_cod_open: isCodOpen,
      warehouse_id: warehouseIdd,
      package_height: packageHeight,
      package_length: packageLength,
      package_weight: packageWeight,
      package_width: packageWidth,
      description,
      // types,
      size_chart: sizeChart,
    } = templateJSON ?? {};
    const dataSubmit = {
      excel: sanitizeTitles(productsJSON || []),
      category_id: String(categoryId[categoryId.length - 1]),
      warehouse_id: warehouseIdd,
      package_height: packageHeight,
      package_length: packageLength,
      package_weight: packageWeight,
      package_width: packageWidth,
      is_cod_open: isCodOpen,
      skus: convertDataSku(),
      description,
      size_chart: sizeChart,
    };
    console.log('dataSubmit: ', dataSubmit);
    const onSuccess = (res: any) => {
      handleResponse(res);
    };
    const onFail = () => {
      message.error('Thêm sản phẩm thất bại');
    };
    createProductList(shopId, dataSubmit, onSuccess, onFail);
  };

  const handleResponse = (res: any) => {
    const countProductSuccess = res.filter((item: ErrorItem) => item.status === 'success').length;
    const countProductFail = res.filter((item: ErrorItem) => item.status === 'error').length;
    if (countProductSuccess === productsJSON?.length) {
      message.success(`Upload products successfully ${countProductSuccess}/${countProductSuccess}`);
      handleCancel();
      return;
    }
    if (productsJSON && countProductSuccess < productsJSON?.length && countProductSuccess > 0) {
      message.success(
        `Upload products successfully ${productsJSON?.length || 0 - countProductFail}/${productsJSON?.length}`,
      );
      if (setModalErrorInfo)
        setModalErrorInfo({
          isShow: true,
          data: res,
          title: `Upload failed ${countProductFail} products`,
        });
      handleCancel();
      return;
    }
    if (countProductSuccess === 0) {
      message.error('Upload failed all products');
      if (setModalErrorInfo)
        setModalErrorInfo({
          isShow: true,
          data: res,
          title: 'Upload failed all products',
        });
    }
  };

  return (
    <Modal
      open={isShowModalUpload}
      title={`Upload ${productList?.length} Products`}
      okText="Upload"
      onOk={onSubmit}
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
