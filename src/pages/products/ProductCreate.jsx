import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, message } from 'antd'

import { useCategoriesStore } from '../../store/categoriesStore'
import { useProductsStore } from '../../store/productsStore'
import { useWareHousesStore } from '../../store/warehousesStore'
import { useShopsBrand } from '../../store/brandStore'
import { getPathByIndex } from '../../utils'

import Loading from '../../components/loading'
import PageTitle from "../../components/common/PageTitle"
import ProductMedia from '../../components/products/ProductMedia'
import ProductInformation from '../../components/products/ProductInformation'
import ProductSale from '../../components/products/ProductSale'
import ProductVariation from '../../components/products/ProductVariation'
import ProductShipping from '../../components/products/ProductShipping'

const ProductCreate = () => {
    const navigate = useNavigate()
    const shopId = getPathByIndex(2)
    const [form] = Form.useForm();
    const [ skusData, setSkusData ] = useState([])
    const [ imgBase64, setImgBase64 ] = useState([])
    const [ attributeValues, setAttributeValues ] = useState([])
    const [messageApi, contextHolder] = message.useMessage()
    const { getAllCategoriesIsLeaf, categoriesIsLeaf, loading } = useCategoriesStore((state) => state)
    const { productById, createOneProduct } = useProductsStore((state) => state)
    const { warehousesById, getWarehousesByShopId} = useWareHousesStore((state) => state)
    const { getAllBrand, brands} = useShopsBrand((state) => state)

    const onFinish = async(values) => {
        const category_id = values?.category_id[values?.category_id.length - 1]
        const newAttributes = Object.entries(values.product_attributes).map(([id, values]) => ({
            id,
            values
        }))
        const convertAttributeData = newAttributes?.map(item => {
            const attributeFilter = attributeValues?.find(attr => attr.id === item.id)
            
            if (attributeFilter) {
                const attribute_id = item.id
                let valuesAttr =  []
                let attribute_values = []
                if (typeof item?.values === 'string') {
                    attribute_values = [
                        {
                            value_id: valuesAttr?.id,
                            value_name: valuesAttr?.name
                        }
                    ]
                } else {
                    valuesAttr = item?.values?.map(value => (
                        attributeFilter?.values?.find(attrValue => attrValue.id === value)
                    ))

                    attribute_values = valuesAttr?.map(attr => (
                        {
                            value_id: attr?.id,
                            value_name: attr?.name
                        }
                    ))
                }

                if (!attribute_values) return null
                
                return {
                    attribute_id: attribute_id,
                    attribute_values: attribute_values
                }
            }
        })

        const productAttribute = convertAttributeData.filter(item => item?.value?.length > 0)

        const dataFormSubmit = {
            product_name: values.product_name,
            description: values.description ? values.description : "",
            category_id: category_id ? category_id : "",
            images: imgBase64?.map(item => item.thumbUrl.replace('data:image/png;base64,', '').replace('data:image/jpg;base64,', '').replace('data:image/jpeg;base64,', '')),
            package_dimension_unit: 'metric',
            package_height: values.package_height ? values.package_height : "",
            package_length: values.package_length ? values.package_length : "",
            package_weight: values.package_weight ? values.package_weight : "",
            package_width: values.package_width ? values.package_width : "",
            is_cod_open: values.is_cod_open ? values.is_cod_open : false,
            brand_id: values.brand_id ? values.brand_id : "",
            skus: skusData.length ? skusData?.map((item) => (
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
            :   [
                {
                    sales_attributes: [],
                    original_price: values.price,
                    stock_infos: [values.stock_infos]
                }
            ],
            product_attributes: productAttribute ? productAttribute : []
        }

        console.log('dataFormSubmit: ', dataFormSubmit);
        const CreateSuccess = (res) => {
            if (res.status === "success") {
                messageApi.open({
                    type: 'success',
                    content: 'Đã thêm sản phẩm thành công!',
                })
                form.resetFields();
                navigate(`/shops/${shopId}/products`)
            }
        }

        const CreateFail = (err) => {
            messageApi.open({
                type: 'error',
                content: err,
            });
        }

        createOneProduct(shopId, dataFormSubmit, CreateSuccess, CreateFail)
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        const onSuccess = (res) => {
            console.log(res)
        }
        const onFail = (err) => {
            messageApi.open({
                type: 'error',
                content: err,
            });
        }

        getAllCategoriesIsLeaf(onSuccess, onFail)
        getWarehousesByShopId(shopId, onSuccess, onFail)
        getAllBrand(shopId, onSuccess, onFail)
        
    }, [productById?.product_id])

    const variationsDataTable = (data) => {
        setSkusData(data)
    };

    const handleImgBase64 = async(img) => {
        await setImgBase64(img)
    }

    const getAttributesByCategory = (data) => {
        setAttributeValues(data)
    }

    if (loading) return <Loading/>
    return (
        <>
            {contextHolder}
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
                    <ProductInformation shopId={shopId} categories={categoriesIsLeaf} brands={brands} getAttributeValues={getAttributesByCategory} />
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
                    <ProductVariation shopId={shopId} variationsDataTable={variationsDataTable} isProductCreate/>
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <ProductShipping isProductCreate/>
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