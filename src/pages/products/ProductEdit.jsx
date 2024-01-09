import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Radio, Form, Input, InputNumber, Upload, TreeSelect, Modal } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useCategoriesStore } from '../../store/categoriesStore'
import { useProductsStore } from '../../store/productsStore'
import { IntlNumberFormat, getPathByIndex, buildNestedArrays } from '../../utils'

import PageTitle from "../../components/common/PageTitle";

const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
};

const ProductEdit = () => {
    const navigate = useNavigate()
    const shopId = getPathByIndex(2)
    const productId = getPathByIndex(4)
    const [form] = Form.useForm();
    const { SHOW_PARENT } = TreeSelect;
    const [valueCategory, setValueCategory] = useState([]);
    const [valuePackage, setValuePackage] = useState('');
    const [valueDescription, setValueDescription] = useState('');
    const [valuePrice, setValuePrice] = useState('');

    const { getCategoriesById, categoriesById } = useCategoriesStore((state) => state)
    const { productById, getProductsById } = useProductsStore((state) => state)
    const categoryById = categoriesById.category_list
    const treeCategoryData = buildNestedArrays(categoryById&&categoryById, "0")
    const treeCategoryDefault = buildNestedArrays(productById.category_list&&productById.category_list, "0")

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const mediaUpload = productById.images?.map((item) => (
        item.url_list.map((image) => ({
            uid: item.id,
            name: productById.product_name,
            status: 'done',
            url: image
        }))
        ))
    const [mediaList, setMediaList] = useState([])
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setMediaList(newFileList);
    const uploadButton = (
        <button
          style={{
            border: 0,
            background: 'none',
          }}
          type="button"
        >
          <PlusOutlined />
          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </button>
    );

    const onFinish = (values) => {
        console.log('Success:', values);
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
        setValueDescription(productById?.description)
        setValuePackage(productById?.package_dimension_unit)
        setValueCategory(treeCategoryDefault)
        setMediaList(mediaUpload&&mediaUpload[0])

        form.setFieldsValue({
            product_id: productId,
            product_name: productById.product_name,
            package_dimension_unit: valuePackage,
            description: valueDescription,
            category_list: valueCategory,
            price: productById.skus?.length > 1 ? IntlNumberFormat(productById.skus[0].price.currency, 'curency', 3, productById.skus[0].price.original_price) : ''
        });
    }, [])

    return (
        <>
            <div className='p-10'>
                <PageTitle title='Sửa sản phẩm' productTitle={`${productById.product_name}`} showBack />                
            </div>

            <Form
                labelAlign="left"
                labelCol={{span: 2}}
                wrapperCol={{span: 18}} 
                layout="horizontal" 
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                form={form}
            >
                <div className='px-20 pb-5'>
                    <Form.Item label="Tên sản phẩm" name='product_name' rules={[{ required: true, message: 'Tên sản phẩm không được để trống' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Danh mục" name='category_list'>
                        <TreeSelect treeData={treeCategoryData}
                            value={valueCategory}
                            onChange={(newValue) => setValueCategory(newValue)}
                            treeCheckable={true}
                            showCheckedStrategy={SHOW_PARENT}
                            placeholder='Chọn danh mục'
                            filterTreeNode={(input, treeCategoryData) => {
                                return (
                                    treeCategoryData.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                    treeCategoryData.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                );
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="Mô tả" name='description'>
                        <ReactQuill theme="snow" row value={valueDescription} onChange={setValueDescription}/>
                    </Form.Item>
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>

                <div className='px-20 py-10'>
                    <h3 className='text-[16px] mb-5'>Ảnh và video</h3>
                    <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            listType="picture-card"
                            fileList={mediaList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {uploadButton}
                        </Upload>
                        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                            <img
                            alt="example"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                            />
                        </Modal>
                    </Form.Item>
                </div>

                <div className='h-[10px] bg-[#f5f5f5]'/>
                <div className='px-20 py-10'>
                    <h3 className='text-[16px] mb-5'>Thông tin bán hàng</h3>
                    <Form.Item name='price' label="Giá">
                        <Input value={valuePrice}/>
                    </Form.Item>

                    <Form.Item label="Gói" name='package_dimension_unit'>
                        <Radio.Group onChange={(e) => setValuePackage(e.target.value)} value={valuePackage}>
                            <Radio value='metric'>metric</Radio>
                            <Radio value='imperial'>imperial</Radio>
                        </Radio.Group>
                    </Form.Item>
                    
                    <Form.Item label="Số lượng">
                        <InputNumber />
                    </Form.Item>
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