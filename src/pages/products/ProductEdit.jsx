import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Form} from 'antd';
import axios from 'axios'

import { alerts } from '../../utils/alerts'
import { useCategoriesStore } from '../../store/categoriesStore'
import { useProductsStore } from '../../store/productsStore'
import { getPathByIndex, buildNestedArrays, formatNumber } from '../../utils'

import Loading from '../../components/loading'
import PageTitle from "../../components/common/PageTitle";
// import PrductEditAttributes from '../../components/products/PrductEditAttributes';
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
    const [ skusData, setSkusData ] = useState([])
    const [ imgBase64, setImgBase64 ] = useState([])
    const { getCategoriesById, categoriesById, loading } = useCategoriesStore((state) => state)
    const { productById, getProductsById, editProduct } = useProductsStore((state) => state)
    
    const treeCategoryDefault = buildNestedArrays(productById?.category_list&&productById?.category_list, "0")
    const priceDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].price.original_price) : ''
    const availableDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].stock_infos[0].available_stock) : ''
    const skuDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].seller_sku) : ''
    const imgBase64List = imgBase64?.filter(item => item.thumbUrl)

    const onFinish = async(values) => {
        console.log('values: ', values);
        const dataFormSubmit = {
            product_id: productId,
            product_name: values.product_name,
            images: values?.images?.map((item) => ({
                id: item.id
            })),
            imgBase64: imgBase64List?.map(item => item.thumbUrl.replace('data:image/png;base64,', '')),
            price: values.price,
            is_cod_open: values.is_cod_open,
            package_dimension_unit: values.package_dimension_unit,
            package_height: values.package_height,
            package_length: values.package_length,
            package_weight: values.package_weight,
            package_width: values.package_width,
            category_id: values.category_list?.map((item) => (
                item.value
            )),
            description: values.description,
            skus: skusData?.map((item) => (
                {
                    original_price: item?.price?.original_price,
                    sales_attributes: item?.sales_attributes?.map((attr) => (
                        {
                            attribute_id: attr?.id,
                            attribute_name: attr?.name,
                            value_id: attr?.value_id,
                            value_name: attr?.value_name
                        }
                    )),
                    stock_infos: item?.stock_infos
                }
            ))
        }
        console.log('dataFormSubmit: ', dataFormSubmit)
        editProduct(shopId, productId, dataFormSubmit, (res) => console.log(res), (err) => alerts.error(err))
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const formData = {
        ...productById,
        category_list: treeCategoryDefault,
        price: priceDataForm,
        available: availableDataForm,
        seller_sku: skuDataForm
    }

    useEffect(() => {
        const onSuccess = (res) => {
            console.log(res)
        }
        const onFail = (err) => {
          alerts.error(err)
        }

        getCategoriesById(shopId, onSuccess, onFail)
        getProductsById(shopId, productId, onSuccess, onFail)

        form.setFieldsValue(formData);
        setSkusData(productById?.skus)
        
    }, [productById?.product_id])

    const variationsDataTable = (data) => {
        setSkusData(data)
    };

    const handleImgBase64 = (img) => {
        setImgBase64(img)
    }

    if (loading) return <Loading/>
    return (
        <>
            <div className='p-10'>
                <PageTitle title='Sửa sản phẩm' showBack />                
            </div>

            <Form
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                form={form}
            >
                <div className='px-20 pb-5'>
                    <ProductInformation categoriesById={categoriesById} />
                </div>

                {/* <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <PrductCreateAttributes />
                </div> */}

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductMedia productData={productById} imgBase64={handleImgBase64} />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductSale />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductVariation variations={productById?.skus} variationsDataTable={variationsDataTable}/>
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