import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, TreeSelect} from 'antd';

import { useCategoriesStore } from '../../store/categoriesStore'
import { useProductsStore } from '../../store/productsStore'
import { getPathByIndex, buildNestedArrays, formatNumber } from '../../utils'

import Loading from '../../components/loading'
import PageTitle from "../../components/common/PageTitle";
import PrductCreateAttributes from '../../components/products/PrductCreateAttributes';
import PrductCreateMedia from '../../components/products/PrductCreateMedia';
import ProductCreateInformation from '../../components/products/ProductCreateInformation';
import ProductCreateSale from '../../components/products/ProductCreateSale';
import ProductCreateVariation from '../../components/products/ProductCreateVariation'
import ProductCreateShipping from '../../components/products/ProductCreateShipping';


const ProductEdit = () => {
    const navigate = useNavigate()
    const shopId = getPathByIndex(2)
    const productId = getPathByIndex(4)
    const [form] = Form.useForm();
    const { getCategoriesById, categoriesById, loading } = useCategoriesStore((state) => state)
    const { productById, getProductsById } = useProductsStore((state) => state)
    
    const treeCategoryDefault = buildNestedArrays(productById.category_list&&productById.category_list, "0")
    const priceDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].price.original_price) : ''
    const availableDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].stock_infos[0].available_stock) : ''
    const skuDataForm = productById?.skus?.length === 1 ? formatNumber(productById?.skus[0].seller_sku) : ''

    const onFinish = (values) => {
        const dataFormSubmit = {
            product_id: productId,
            product_name: values.product_name,
            images: values.images.map((item) => ({
                id: item.id
            })),
            price: values.price,
            is_cod_open: values.is_cod_open,
            package_dimension_unit: values.package_dimension_unit,
            package_height: values.package_height,
            package_length: values.package_length,
            package_weight: values.package_weight,
            package_width: values.package_width,
            category_id: values.category_list.map((item) => (
                item.value
            )),
            description: values.description,
            skus: values.variation
        }

        console.log('values: ', values)
        console.log('dataFormSubmit: ', dataFormSubmit)
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const formData = {
        ...productById,
        category_list: treeCategoryDefault,
        price: priceDataForm,
        available: availableDataForm,
        seller_sku: skuDataForm,
        // product_variation: 
    }

    // console.log('productById: ', productById)

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
        
    }, [productById.product_id])

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
                    <ProductCreateInformation categoriesById={categoriesById} />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <PrductCreateAttributes />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <PrductCreateMedia productData={productById} />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductCreateSale />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductCreateVariation variation={productById?.skus} />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductCreateShipping />
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