import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spin, message } from "antd";

import { useCategoriesStore } from "../../store/categoriesStore";
import { useProductsStore } from "../../store/productsStore";
import { useWareHousesStore } from "../../store/warehousesStore";
import { useShopsBrand } from "../../store/brandStore";
import { getPathByIndex, ConvertProductAttribute } from "../../utils";

import Loading from "../../components/loading";
import PageTitle from "../../components/common/PageTitle";
import ProductMedia from "../../components/products/ProductMedia";
import ProductInformation from "../../components/products/ProductInformation";
import ProductSale from "../../components/products/ProductSale";
import ProductVariation from "../../components/products/ProductVariation";
import ProductShipping from "../../components/products/ProductShipping";

const ProductCreate = () => {
  const navigate = useNavigate();
  const shopId = getPathByIndex(2);
  const [form] = Form.useForm();
  const [skusData, setSkusData] = useState([]);
  const [imgBase64, setImgBase64] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const { getAllCategoriesIsLeaf, categoriesIsLeaf } = useCategoriesStore(
    (state) => state
  );
  const { productById, createOneProduct, createOneProductDraff, loading } =
    useProductsStore((state) => state);
  const { warehousesById, getWarehousesByShopId } = useWareHousesStore(
    (state) => state
  );
  const { getAllBrand, brands } = useShopsBrand((state) => state);

  const onFinish = async (values) => {
    const category_id = values?.category_id[values?.category_id.length - 1];
    const product_attributes = ConvertProductAttribute(
      values.product_attributes,
      attributeValues
    );

    const dataFormSubmit = {
      product_name: values.product_name,
      description: values.description ? values.description : "",
      category_id: category_id ? category_id : "",
      images: imgBase64?.map((item) =>
        item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
      ),
      package_dimension_unit: "metric",
      package_height: values.package_height ? values.package_height : "",
      package_length: values.package_length ? values.package_length : "",
      package_weight: values.package_weight ? values.package_weight : "",
      package_width: values.package_width ? values.package_width : "",
      is_cod_open: false,
      brand_id: values.brand_id ? values.brand_id : "",
      skus: skusData.length
        ? skusData?.map((item) => ({
          sales_attributes: item.variations?.map((attr) => ({
            attribute_id: attr.id,
            attribute_name: attr.name,
            custom_value: attr.value_name,
          })),
          original_price: item.price,
          stock_infos: [item.stock_infos],
          seller_sku: item?.seller_sku || "",
        }))
        : [
          {
            sales_attributes: [],
            original_price: values.price,
            stock_infos: [values.stock_infos],
            seller_sku: values?.seller_sku || "",
          },
        ],
      product_attributes: product_attributes ? product_attributes : [],
    };

    console.log("dataFormSubmit: ", dataFormSubmit);
    const CreateSuccess = (res) => {
      if (res.message === "Success") {
        messageApi.open({
          type: "success",
          content: "Đã thêm sản phẩm thành công!",
        });
        form.resetFields();
        navigate(`/shops/${shopId}/products`);
      }
    };

    const CreateFail = (err) => {
      messageApi.open({
        type: "error",
        content: err,
      });
    };

    createOneProduct(shopId, dataFormSubmit, CreateSuccess, CreateFail);
  };

  const onFinishFailed = (errorInfo) => { };

  useEffect(() => {
    const onSuccess = (res) => { };
    const onFail = (err) => {
      messageApi.open({
        type: "error",
        content: err,
      });
    };

    getAllCategoriesIsLeaf();
    getWarehousesByShopId(shopId, onSuccess, onFail);
    getAllBrand(shopId, onSuccess, onFail);
  }, [productById?.product_id]);

  const variationsDataTable = (data) => {
    setSkusData(data);
  };

  const handleImgBase64 = async (img) => {
    await setImgBase64(img);
  };

  const getAttributesByCategory = (data) => {
    setAttributeValues(data);
  };

  // if (loading) return <Loading/>
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
        >
          <div className="p-3 md:px-20 pb-5">
            <ProductInformation
              shopId={shopId}
              categories={categoriesIsLeaf}
              brands={brands}
              getAttributeValues={getAttributesByCategory}
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
            />
          </div>

          <div className="h-[10px] bg-[#f5f5f5]" />
          <div className="px-3 md:px-20 p-3 md:py-10">
            <ProductSale warehouses={warehousesById.warehouse_list} />
          </div>

          <div className="h-[10px] bg-[#f5f5f5]" />
          <div className="px-3 md:px-20 p-3 md:py-10">
            <ProductVariation
              shopId={shopId}
              variationsDataTable={variationsDataTable}
              isProductCreate
            />
          </div>

          <div className="h-[10px] bg-[#f5f5f5]" />
          <div className="px-3 md:px-20 p-3 md:py-10">
            <ProductShipping isProductCreate />
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
                      const product_attributes = ConvertProductAttribute(
                        values.product_attributes,
                        attributeValues
                      );
                      const categoryId =
                        values?.category_id[values?.category_id?.length - 1];
                      const dataSend = {
                        ...values,
                        category_id: String(categoryId),
                        images: imgBase64?.map((item) =>
                          item.thumbUrl.replace(
                            /^data:image\/(png|jpg|jpeg);base64,/,
                            ""
                          )
                        ),
                        product_attributes: product_attributes,
                        is_cod_open: values?.is_cod_open
                          ? values?.is_cod_open
                          : "false",
                        skus: skusData.length
                          ? skusData?.map((item) => ({
                            sales_attributes: item.variations?.map(
                              (attr) => ({
                                attribute_id: attr.id,
                                attribute_name: attr.name,
                                custom_value: attr.value_name,
                              })
                            ),
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

                      const CreateProductDraffSuccess = (res) => {
                        if (res) {
                          messageApi.open({
                            type: "success",
                            content: "Đã thêm sản phẩm nháp!",
                          });
                          navigate(`/shops/${shopId}/products`);
                        }
                      };
                      createOneProductDraff(
                        shopId,
                        dataSend,
                        CreateProductDraffSuccess,
                        (err) => console.log(err)
                      );
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
};

export default ProductCreate;
