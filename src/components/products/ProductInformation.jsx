import {  useState } from 'react';
import { Form, Input, Select, Row, Col, Cascader, message, Spin } from 'antd'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { buildNestedArraysMenu } from '../../utils'

import { useCategoriesStore } from '../../store/categoriesStore'
import ProductSectionTitle from './ProuctSectionTitle';
import CustomSelect from '../../pages/stores/CustomSelect';

const ProductInformation = ({shopId, categories, brands, getAttributeValues}) => {
    const [valueDescription, setValueDescription] = useState('');
    const [messageApi, contextHolder] = message.useMessage()
    const {getAttributeByCategory, attributes, attributeLoading} = useCategoriesStore((state) => state)
    const categoriesData = buildNestedArraysMenu(categories, 0)

    const convertBrand = brands?.brand_list?.map((item) => (
        {
            value: item.id,
            label: item.name
        }
    ))

    const optionsBranch = convertBrand&&[
        {
            value: "",
            label: 'No brand'
        },
        ...convertBrand
    ]

    const handleChangeCategories = (e) => {
        const categoryId = e[e.length - 1]
        const onSuccess = (res) => {
            getAttributeValues(res.data.attributes)
        }

        const onFail = (err) => {
            messageApi.open({
                type: 'error',
                content: err,
            });
        }
        getAttributeByCategory(shopId, categoryId, onSuccess, onFail)
    }

    console.log('categoriesData: ', categoriesData);
    
    return (
        <>
            {contextHolder}
            <Form.Item label="Tên sản phẩm:" name='product_name' rules={[{ required: true, message: 'Tên sản phẩm không được để trống' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Danh mục:" name='category_id' rules={[{ required: true, message: 'Danh mục không được để trống' }]}>
                <Cascader 
                    options={categoriesData}
                    onChange={handleChangeCategories} 
                    placeholder="Please select"
                    // showSearch={(input, options) => {
                    //     return (
                    //         options.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    //         options.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    //     )
                    // }}
                />
            </Form.Item>

            <Form.Item label="Thương hiệu:" name='brand_id'>
                <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn 1 thương hiệu"
                    onChange={() => {}}
                    options={optionsBranch}
                    filterOption={(input, options) => {
                        return (
                            options.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            options.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                    }}
                />
            </Form.Item>

            <Form.Item label="Mô tả:" name='description' rules={[{ required: true, message: 'Mô tả sản phẩm không được để trống' }]}>
                <ReactQuill theme="snow" row value={valueDescription} onChange={setValueDescription}/>
            </Form.Item>

            {attributes?.attributes?.length && 
                <>
                    <div className='w-full mt-10'><ProductSectionTitle title='Thuộc tính:'/></div>
                    {attributeLoading && <Spin/>}
                    {!attributeLoading && 
                        <Row gutter={['30', '20']}>
                            
                            {attributes?.attributes?.map(item => {
                                const optionAttribute = item?.values?.map (attr => (
                                    {
                                        value: attr.id,
                                        label: attr.name
                                    }
                                ))

                                const itemAttributeSelect = ["101395", "101400", "100110", "100108"]
                                return (
                                    <Col span={8}>
                                        <Form.Item label={item.name} name={['product_attributes', item.id ]}>
                                            {itemAttributeSelect.includes(item.id) ?
                                                <Select
                                                    style={{ width: '100%' }}
                                                    options={optionAttribute}
                                                />
                                            :
                                                
                                                <CustomSelect
                                                    optionsSelect={optionAttribute}
                                                    type={item.name}
                                                    // onChange={setSelectedSize}
                                                />
                                            }                           
                                        </Form.Item>
                                    </Col>
                                )
                            })}
                        </Row>
                    }
                </>
            }            
        </>
    );
}
 
export default ProductInformation;