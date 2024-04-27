import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Spin, message } from 'antd';

import { useCategoriesStore } from '../../store/categoriesStore';
import { useProductsStore } from '../../store/productsStore';
import { useWareHousesStore } from '../../store/warehousesStore';
import { useShopsBrand } from '../../store/brandStore';
import { getPathByIndex, ConvertProductAttribute } from '../../utils';
import { AttributeProduct, productNew, SkuProductForm, SkuProductNew } from '../../types';

import PageTitle from '../../components/common/PageTitle';
import ProductMedia from '../../components/products/ProductMedia';
import ProductInformation from '../../components/products/ProductInformation';
import ProductSale from '../../components/products/ProductSale';
import ProductVariation from '../../components/products/ProductVariation';
import ProductShipping from '../../components/products/ProductShipping';

interface ProductAttribute {
  attribute_type: number;
  id: string;
  input_type: {
    is_customized: boolean;
    is_mandatory: boolean;
    is_multiple_selected: boolean;
  };
  name: string;
  values: {
    id: string;
    name: string;
  }[];
}

function ProductCreate() {
  const navigate = useNavigate();
  const shopId = getPathByIndex(2);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [form] = Form.useForm();
  const [skusData, setSkusData] = useState<SkuProductForm[]>([]);
  const [imgBase64, setImgBase64] = useState<any>([]);
  const [attributeValues, setAttributeValues] = useState<ProductAttribute[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [sizeChart, setSizeChart] = useState<any>([]);
  const { getAllCategoriesIsLeaf, categoriesIsLeaf, recommendCategory } = useCategoriesStore((state) => state);
  const { productById, createOneProduct, createOneProductDraff, loading } = useProductsStore((state) => state);
  const { warehousesById, getWarehousesByShopId } = useWareHousesStore((state) => state);
  const { getAllBrand, brands } = useShopsBrand((state) => state);

  const onFinish = async (values: any) => {
    const category_id: number = Number(values?.category_id[values.category_id.length - 1]);
    const product_attributes = ConvertProductAttribute(values.product_attributes as unknown as AttributeProduct);
    let productSku: SkuProductNew[] = [];
    if (skusData.length) {
      productSku = skusData?.map((item: SkuProductForm) => ({
        original_price: item.price,
        sales_attributes: item.variations?.map((attr) => ({
          attribute_id: attr.id,
          attribute_name: attr.name,
          custom_value: attr.value_name,
        })),
        seller_sku: item?.seller_sku || '',
        stock_infos: [item.stock_infos],
      }));
    } else {
      productSku = [
        {
          sales_attributes: [],
          original_price: values.price,
          stock_infos: [values.stock_infos],
          seller_sku: values?.seller_sku || '',
        },
      ];
    }

    const dataFormSubmit: productNew = {
      brand_id: values.brand_id ? values.brand_id : '',
      category_id: Number(category_id),
      description: values.description ? values.description : '',
      images: imgBase64?.map((item: any) => item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')),
      is_cod_open: false,
      package_dimension_unit: 'imperial',
      package_height: values.package_height ? values.package_height : '',
      package_length: values.package_length ? values.package_length : '',
      package_weight: values.package_weight ? values.package_weight : '',
      package_width: values.package_width ? values.package_width : '',
      product_attributes: product_attributes,
      product_name: values.product_name,
      size_chart: {
        img_id: sizeChart.length ? sizeChart[0].thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, '') : '',
      },
      skus: productSku,
    };
    // console.log('dataFormSubmit: ', dataFormSubmit);

    const CreateSuccess = (res: any) => {
      if (res.message === 'Success') {
        messageApi.open({
          type: 'success',
          content: 'Đã thêm sản phẩm thành công!',
        });
        form.resetFields();
        navigate(`/shops/${shopId}/products`);
      }
    };

    const CreateFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
    };

    if (shopId) createOneProduct(shopId, dataFormSubmit, CreateSuccess, CreateFail);
  };

  const onFinishFailed = () => {};

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
    };

    getAllCategoriesIsLeaf();
    if (shopId) {
      getWarehousesByShopId(shopId, onSuccess, onFail);
      getAllBrand(shopId, onSuccess, onFail);
    }
  }, [productById?.product_id]);

  const variationsDataTable = (data: SkuProductForm[]) => {
    setSkusData(data);
  };

  const handleImgBase64 = async (img: any) => {
    await setImgBase64(img);
  };

  const getAttributesByCategory = (data: ProductAttribute[]) => {
    setAttributeValues(data);
  };

  const onValuesChange = (changedValues: { [key: string]: { value: string; label: string }[] | string }) => {
    if ('product_name' in changedValues) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const onSuccess = (res: any) => {
          const categories = res.category.data.categories;
          if (categories && categories.length) {
            form.setFieldsValue({
              category_id: categories.map((item: any) => item.id),
            });
          }
        };
        if (changedValues.product_name && shopId)
          recommendCategory(shopId, { product_name: changedValues.product_name }, onSuccess);
      }, 500);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="p-3 md:p-10">
        <PageTitle title="Thêm sản phẩm mới" showBack />
      </div>
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
          onValuesChange={onValuesChange}
        >
          <div className="p-3 md:px-20 pb-5">
            <ProductInformation
              shopId={shopId}
              categories={categoriesIsLeaf}
              brands={brands}
              getAttributeValues={getAttributesByCategory}
              // form={form}
            />
          </div>

          <div className="h-[10px] bg-[#f5f5f5]" />
          <div className="px-3 md:px-20 p-3 md:py-10">
            <ProductMedia
              productData={{ images: [] }}
              imgBase64={handleImgBase64}
              isProductCreate
              setFileList={setFileList}
              fileList={fileList}
              sizeChart={sizeChart}
              setSizeChart={setSizeChart}
            />
          </div>

          <div className="h-[10px] bg-[#f5f5f5]" />
          <div className="px-3 md:px-20 p-3 md:py-10">
            <ProductSale warehouses={warehousesById.warehouse_list} />
          </div>

          {shopId && (
            <>
              <div className="h-[10px] bg-[#f5f5f5]" />
              <div className="px-3 md:px-20 p-3 md:py-10">
                <ProductVariation shopId={shopId} variationsDataTable={variationsDataTable} isProductCreate />
              </div>
            </>
          )}

          <div className="h-[10px] bg-[#f5f5f5]" />
          <div className="px-3 md:px-20 p-3 md:py-10">
            <ProductShipping />
          </div>

          <div className="px-3 md:px-20 p-3 md:py-10">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button
                type="primary"
                className="ml-3"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      const product_attributes = ConvertProductAttribute(values.product_attributes, attributeValues);
                      const categoryId = values?.category_id[values.category_id.length - 1];
                      const dataSend = {
                        ...values,
                        category_id: String(categoryId),
                        images: imgBase64?.map((item: any) =>
                          item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
                        ),
                        product_attributes,
                        is_cod_open: values?.is_cod_open ? values?.is_cod_open : 'false',
                        skus: skusData.length
                          ? skusData?.map((item) => ({
                              sales_attributes: item.variations?.map((attr) => ({
                                attribute_id: attr.id,
                                attribute_name: attr.name,
                                custom_value: attr.value_name,
                              })),
                              original_price: item.price,
                              stock_infos: [item.stock_infos],
                            }))
                          : [
                              {
                                sales_attributes: [],
                                original_price: values.price,
                                stock_infos: [values.stock_infos],
                              },
                            ],
                      };

                      const CreateProductDraffSuccess = (res: any) => {
                        if (res) {
                          messageApi.open({
                            type: 'success',
                            content: 'Đã thêm sản phẩm nháp!',
                          });
                          navigate(`/shops/${shopId}/products`);
                        }
                      };
                      if (shopId) createOneProductDraff(shopId, dataSend, CreateProductDraffSuccess, (err) => console.log(err));
                    })
                    .catch((info) => {
                      console.log(info);
                    });
                }}
              >
                Lưu bản nháp
              </Button>
              <Button className="ml-3" onClick={() => navigate(-1)}>
                Huỷ
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </>
  );
}

export default ProductCreate;