import { Button, Form, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopsBrand } from '../../store/brandStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useProductsStore } from '../../store/productsStore';
import { useWareHousesStore } from '../../store/warehousesStore';
import { ConvertProductAttribute, formatNumber, getPathByIndex } from '../../utils';
import PageTitle from '../../components/common/PageTitle';
import ProductInformation from '../../components/products/ProductInformation';
import ProductMedia from '../../components/products/ProductMedia';
import ProductSale from '../../components/products/ProductSale';
import ProductShipping from '../../components/products/ProductShipping';
import ProductVariation from '../../components/products/ProductVariation';

function ProductEdit() {
  const navigate = useNavigate();
  const shopId = getPathByIndex(2);
  const productId = getPathByIndex(4);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [skusData, setSkusData] = useState([]);
  const [imgBase64, setImgBase64] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [sizeChart, setSizeChart] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const { getAllCategoriesIsLeaf, categoriesIsLeaf } = useCategoriesStore((state) => state);
  const { productById, getProductsById, editProduct, loading } = useProductsStore((state) => state);
  const { warehousesById, getWarehousesByShopId } = useWareHousesStore((state) => state);
  const { getAllBrand, brands } = useShopsBrand((state) => state);

  const priceDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].price.original_price) : '';
  const availableDataForm =
    productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].stock_infos[0].available_stock) : '';
  const skuDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].seller_sku) : '';
  const warehouse_id = productById?.skus?.length === 1 ? productById?.skus[0].stock_infos[0].warehouse_id : '';
  const available_stock = productById?.skus?.length === 1 ? productById?.skus[0].stock_infos[0].available_stock : '';
  // const imgBase64List = imgBase64?.filter((item) => item.thumbUrl);
  // const imgBase64Data = imgBase64List?.map((item) => item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));

  const getImageBase64 = () => {
    const imgBase64List = imgBase64?.filter((item) => item.thumbUrl);
    const imgBase64Data = imgBase64List?.map((item) =>
      item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
    );
    return imgBase64Data;
  };

  const formData = {
    ...productById,
    category_id: productById?.category_list?.map((item) => parseInt(item.id)),
    price: priceDataForm,
    available: availableDataForm,
    seller_sku: skuDataForm,
    brand_id: {
      value: productById?.brand?.id || '',
      label: productById?.brand?.name || 'No brand',
    },
    stock_infos: {
      warehouse_id,
      available_stock,
    },
    product_attributes: productById?.product_attributes,
    is_cod_open: productById?.is_cod_open,
  };

  const variationsDataTable = (data) => {
    console.log('data: ', data);
    setSkusData(data);
  };

  const handleImgBase64 = (img) => {
    setImgBase64(img);
  };

  const onFinish = async (values) => {
    const category_id = values?.category_id[values.category_id.length - 1];
    const product_attributes = ConvertProductAttribute(values.product_attributes, attributeValues);

    const dataFormSubmit = {
      product_id: productId,
      product_name: values.product_name,
      images: fileList
        ?.filter((item) => item.status === 'done')
        .map((item) => ({
          id: item.uid,
        })),
      size_chart: sizeChart ? { id: sizeChart.uid } : null,
      imgBase64: getImageBase64(imgBase64),
      price: values.price,
      is_cod_open: false,
      package_dimension_unit: 'imperial',
      package_height: values.package_height,
      package_length: values.package_length,
      package_weight: values.package_weight,
      package_width: values.package_width,
      category_id: category_id || '',
      description: values.description,
      skus: skusData?.map((item) => ({
        sales_attributes: item.variations?.map((attr) => ({
          value_id: attr.value_id ? attr.value_id : item.key,
          attribute_id: attr.id,
          attribute_name: attr.name,
          value_name: attr.value_name,
        })),
        original_price: item.price || 3,
        stock_infos: item.stock_infos,
        seller_sku: values?.seller_sku || '',
      })),
      brand_id: values.brand_id ? values.brand_id.value : '',
      product_attributes: product_attributes || [],
    };

    console.log('dataFormSubmit: ', dataFormSubmit);
    const UpdateSuccess = (res) => {
      if (res.message === 'Success') {
        messageApi.open({
          type: 'success',
          content: 'Cập nhật sản phẩm thành công!',
        });
        form.resetFields();
        navigate(`/shops/${shopId}/products`);
      }
    };

    const UpdateFail = (err) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
    };
    editProduct(shopId, productId, dataFormSubmit, UpdateSuccess, UpdateFail);
  };

  const getAttributesByCategory = (data) => {
    setAttributeValues(data);
  };

  useEffect(() => {
    getAllCategoriesIsLeaf();
    getProductsById(shopId, productId);
    getWarehousesByShopId(shopId);
    getAllBrand(shopId);

    form.setFieldsValue(formData);
    const skuProduct = productById?.skus?.map((item) => ({
      key: item.id,
      price: item?.price?.original_price,
      variations: item.sales_attributes,
      seller_sku: item.seller_sku,
      stock_infos: item.stock_infos,
    }));
    if (skuProduct) {
      setSkusData(skuProduct);
    }
  }, [productById?.product_id]);

  // console.log('skusData: ', skusData);
  return (
    <Spin spinning={loading}>
      {contextHolder}
      <div className="p-3 md:p-10">
        <PageTitle title="Sửa sản phẩm" showBack />
      </div>

      <Form layout="vertical" onFinish={onFinish} form={form}>
        <div className="px-3 md:px-20 pb-5">
          <ProductInformation
            shopId={shopId}
            categories={categoriesIsLeaf}
            brands={brands}
            getAttributeValues={getAttributesByCategory}
          />
        </div>

        <div className="h-[10px] bg-[#f5f5f5]" />
        <div className="px-3 md:px-20 py-10">
          <ProductMedia
            productData={productById}
            imgBase64={handleImgBase64}
            setFileList={setFileList}
            fileList={fileList}
            sizeChart={sizeChart}
            setSizeChart={setSizeChart}
          />
        </div>

        <div className="h-[10px] bg-[#f5f5f5]" />
        <div className="px-3 md:px-20 py-10">
          <ProductSale warehouses={warehousesById.warehouse_list} />
        </div>

        <div className="h-[10px] bg-[#f5f5f5]" />
        <div className="px-3 md:px-20 py-10">
          <ProductVariation shopId={shopId} variations={skusData} variationsDataTable={variationsDataTable} />
        </div>

        <div className="h-[10px] bg-[#f5f5f5]" />
        <div className="px-3 md:px-20 py-10">
          <ProductShipping />
        </div>

        <div className="px-3 md:px-20 py-10">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
            <Button className="ml-3" onClick={() => navigate(-1)}>
              Huỷ
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Spin>
  );
}

export default ProductEdit;
