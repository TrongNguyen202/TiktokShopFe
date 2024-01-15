import { useState } from 'react';
import { Form, Input, TreeSelect } from 'antd'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { buildNestedArrays } from '../../utils'

const ProductCreateInformation = ({categoriesById}) => {
    const [valueDescription, setValueDescription] = useState('');
    const [valueCategory, setValueCategory] = useState([]);
    const { SHOW_PARENT } = TreeSelect;

    const categoryById = categoriesById?.category_list
    const treeCategoryData = buildNestedArrays(categoryById&&categoryById, "0")

    return (
        <>
            <Form.Item label="Tên sản phẩm:" name='product_name' rules={[{ required: true, message: 'Tên sản phẩm không được để trống' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Danh mục:" name='category_list' rules={[{ required: true, message: 'Danh mục không được để trống' }]}>
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

            <Form.Item label="Mô tả:" name='description'>
                <ReactQuill theme="snow" row value={valueDescription} onChange={setValueDescription}/>
            </Form.Item>
        </>
    );
}
 
export default ProductCreateInformation;