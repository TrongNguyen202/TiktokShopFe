import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Form, message} from 'antd';

import { alerts } from '../../utils/alerts'
import { useCategoriesStore } from '../../store/categoriesStore'
import { useProductsStore } from '../../store/productsStore'
import { useWareHousesStore } from '../../store/warehousesStore';
import { useShopsBrand } from '../../store/brandStore';
import { getPathByIndex, formatNumber, ConvertProductAttribute } from '../../utils'

import Loading from '../../components/loading'
import PageTitle from "../../components/common/PageTitle";
import ProductMedia from '../../components/products/ProductMedia';
import ProductInformation from '../../components/products/ProductInformation';
import ProductSale from '../../components/products/ProductSale';
import ProductVariation from '../../components/products/ProductVariation'
import ProductShipping from '../../components/products/ProductShipping';


const ProductEdit = () => {
    const navigate = useNavigate()
    const shopId = getPathByIndex(2)
    const productId = getPathByIndex(4)
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [ skusData, setSkusData ] = useState([])
    const [ imgBase64, setImgBase64 ] = useState([])
    const [ attributeValues, setAttributeValues ] = useState([])
    const { getAllCategoriesIsLeaf, categoriesIsLeaf, loading } = useCategoriesStore((state) => state)
    const { productById, getProductsById, editProduct } = useProductsStore((state) => state)
    const { warehousesById, getWarehousesByShopId} = useWareHousesStore((state) => state)
    const { getAllBrand, brands} = useShopsBrand((state) => state)
    
    const priceDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].price.original_price) : ''
    const availableDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].stock_infos[0].available_stock) : ''
    const skuDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].seller_sku) : ''
    const imgBase64List = imgBase64?.filter(item => item.thumbUrl)
    const imgBase64Data = imgBase64List?.map(item => item.thumbUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))

    const formData = {
        ...productById,
        category_id: productById?.category_list?.map(item => parseInt(item.id)),
        price: priceDataForm,
        available: availableDataForm,
        seller_sku: skuDataForm
    }

    useEffect(() => {
        getAllCategoriesIsLeaf()
        getProductsById(shopId, productId)
        getWarehousesByShopId(shopId)
        getAllBrand(shopId)

        form.setFieldsValue(formData);
        setSkusData(productById?.skus?.map((item) => (
            {
                key: item.id,
                price: item.price.original_price,
                variations: item.sales_attributes,
                seller_sku: item.seller_sku,
                stock_infos: item.stock_infos
            }
        )))
        
    }, [productById?.product_id])

    const variationsDataTable = (data) => {
        setSkusData([data])
    };

    const handleImgBase64 = (img) => {
        setImgBase64(img)
    }

    const onFinish = async(values) => {
        const category_id = values?.category_id[values?.category_id.length - 1]
        const product_attributes = ConvertProductAttribute(values.product_attributes, attributeValues)

        const dataFormSubmit = {
            product_id: productId,
            product_name: values.product_name,
            images: values?.images?.map((item) => ({
                id: item.id
            })),
            imgBase64: imgBase64Data,
            price: values.price,
            is_cod_open: values.is_cod_open,
            package_dimension_unit: 'metric',
            package_height: values.package_height,
            package_length: values.package_length,
            package_weight: values.package_weight,
            package_width: values.package_width,
            category_id: category_id ? category_id : "",
            description: values.description,
            skus: skusData?.map((item) => (
                {
                    sales_attributes: item.variations?.map((attr) => (
                        {
                            value_id: attr.value_id ? attr.value_id : item.key,
                            attribute_id: attr.id,
                            attribute_name: attr.name,
                            value_name: attr.value_name
                        }
                    )),
                    original_price: item.price,
                    stock_infos: item.stock_infos
                }
            )),
            brand_id: values.brand_id ? values.brand_id : "",
            product_attributes: product_attributes ? product_attributes : [],
        }

        // console.log('dataFormSubmit: ', dataFormSubmit);

        const UpdateSuccess = (res) => {
            if (res.status === "success") {
                messageApi.open({
                    type: 'success',
                    content: 'Cập nhật sản phẩm thành công!',
                });
                navigate(`/shops/${shopId}/products`)
            }
        }

        const UpdateFail = (err) => {
            messageApi.open({
                type: 'error',
                content: err,
            });
        }
        editProduct(shopId, productId, dataFormSubmit, UpdateSuccess, UpdateFail)
    }

    const getAttributesByCategory = (data) => {
        setAttributeValues(data)
    }

    if (loading) return <Loading/>
    return (
        <>
            {contextHolder}
            <div className='p-10'>
                <PageTitle title='Sửa sản phẩm' showBack />                
            </div>

            <Form
                layout="vertical"
                onFinish={onFinish}
                form={form}
            >
                <div className='px-20 pb-5'>
                    <ProductInformation shopId={shopId} categories={categoriesIsLeaf} brands={brands} getAttributeValues={getAttributesByCategory}/>
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductMedia productData={productById} imgBase64={handleImgBase64} />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductSale warehouses={warehousesById.warehouse_list}/>
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductVariation shopId={shopId} variations={productById?.skus} variationsDataTable={variationsDataTable}/>
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductShipping />
                </div>  

                <div className='px-20 py-10'>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
                        <Button className='ml-3' onClick={() => navigate(-1)}>Huỷ</Button>
                    </Form.Item>
                </div>
            </Form>
        </>
    );
}
 
export default ProductEdit;