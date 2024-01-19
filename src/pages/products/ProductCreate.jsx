import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Form} from 'antd';
import axios from 'axios'

import { alerts } from '../../utils/alerts'
import { useCategoriesStore } from '../../store/categoriesStore'
import { useProductsStore } from '../../store/productsStore'
import { getPathByIndex } from '../../utils'

import Loading from '../../components/loading'
import PageTitle from "../../components/common/PageTitle";
import PrductCreateAttributes from '../../components/products/PrductEditAttributes';
import ProductMedia from '../../components/products/ProductMedia';
import ProductInformation from '../../components/products/ProductInformation';
import ProductSale from '../../components/products/ProductSale';
import ProductVariation from '../../components/products/ProductVariation'
import ProductShipping from '../../components/products/ProductShipping';


const ProductCreate = () => {
    const navigate = useNavigate()
    const shopId = getPathByIndex(2)
    const productId = getPathByIndex(4)
    const [form] = Form.useForm();
    const [ skusData, setSkusData ] = useState([])
    const [ imgBase64, setImgBase64 ] = useState([])
    const { categoriesIsLeafType2, getAllCategoriesIsLeafType2, loading } = useCategoriesStore((state) => state)
    const { productById, getProductsById, createOneProduct } = useProductsStore((state) => state)

    const onFinish = async(values) => {
        const dataFormSubmit = {
            product_name: values.product_name,
            description: values.description ? values.description : "",
            category_id: values.category_id ? values.category_id : "",
            images: imgBase64?.map(item => item.thumbUrl.replace('data:image/png;base64,', '')),
            package_dimension_unit: values.package_dimension_unit ? values.package_dimension_unit : 'metric',
            package_height: values.package_height ? values.package_height : "",
            package_length: values.package_length ? values.package_length : "",
            package_weight: values.package_weight ? values.package_weight : "",
            package_width: values.package_width ? values.package_width : "",
            is_cod_open: values.is_cod_open ? values.is_cod_open : false,
            skus: skusData?.map((item) => (
                {
                    sales_attributes: item.variations?.map((attr) => (
                        {
                            attribute_id: attr.id,
                            attribute_name: attr.name,
                            custom_value: attr.value_name
                        }
                    )),
                    original_price: item.price,
                    stock_infos: [
                        item.stock_infos
                    ]
                }
            ))
        }
        console.log('dataFormSubmit: ', dataFormSubmit)
        createOneProduct(shopId, dataFormSubmit, (res) => console.log(res), (err) => alerts.error(err))
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

        getAllCategoriesIsLeafType2(shopId, onSuccess, onFail)
        getProductsById(shopId, productId, onSuccess, onFail)
        
    }, [productById?.product_id])

    const variationsDataTable = (data) => {
        console.log('data: ', data);
        setSkusData(data)
    };

    const handleImgBase64 = async(img) => {
        await setImgBase64(img)
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
                    <ProductInformation categories={categoriesIsLeafType2} />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductMedia shopId={shopId} productData={productById} imgBase64={handleImgBase64} />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductSale />
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductVariation shopId={shopId} variationsDataTable={variationsDataTable} isProductCreate/>
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductShipping />
                </div>  

                <div className='px-20 py-10'>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                        <Button className='ml-3' onClick={() => navigate(-1)}>Huỷ</Button>
                    </Form.Item>
                </div>
            </Form>
        </>
    );
}
 
export default ProductCreate;