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
import PrductCreateAttributes from '../../components/products/PrductCreateAttributes';
import PrductCreateMedia from '../../components/products/PorductCreateMedia';
import ProductCreateInformation from '../../components/products/ProductCreateInformation';
import ProductCreateSale from '../../components/products/ProductCreateSale';
import ProductCreateVariation from '../../components/products/ProductCreateVariation'
import ProductCreateShipping from '../../components/products/ProductCreateShipping';


const ProductCreate = () => {
    const navigate = useNavigate()
    const shopId = getPathByIndex(2)
    const productId = getPathByIndex(4)
    const [form] = Form.useForm();
    const [ skusData, setSkusData ] = useState([])
    const [ imgBase64, setImgBase64 ] = useState([])
    const { getCategoriesById, categoriesById, loading } = useCategoriesStore((state) => state)
    const { productById, getProductsById, createProduct } = useProductsStore((state) => state)

    const onFinish = async(values) => {
        const dataFormSubmit = {
            product_id: productId,
            product_name: values.product_name,
            images: values.images.map((item) => ({
                id: item.id
            })),
            imgBase64: imgBase64,
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
        // editProduct(shopId, productId, dataFormSubmit, (res) => console.log(res), (err) => alerts.error(err))
        createProduct()
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        const onSuccess = (res) => {
            console.log(res)
        }
        const onFail = (err) => {
          alerts.error(err)
        }

        getCategoriesById(shopId, onSuccess, onFail)
        getProductsById(shopId, productId, onSuccess, onFail)
        
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
                <PageTitle title='Thêm sản phẩm mới' showBack />                
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
                    <PrductCreateMedia productData={productById} imgBase64={handleImgBase64} />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductCreateSale />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductCreateVariation variations={productById?.skus} variationsDataTable={variationsDataTable}/>
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
 
export default ProductCreate;