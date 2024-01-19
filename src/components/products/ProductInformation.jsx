import { useState } from 'react';
import { Form, Input, Select } from 'antd'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { buildNestedArrays } from '../../utils'

const ProductInformation = ({categories}) => {
    const [valueDescription, setValueDescription] = useState('');
    
    const options = categories?.category_list?.map((item) => (
        {
            value: item.id,
            label: item.local_display_name
        }
    ))
    console.log('categoriesList: ', options);

    return (
        <>
            <Form.Item label="Tên sản phẩm:" name='product_name' rules={[{ required: true, message: 'Tên sản phẩm không được để trống' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Danh mục:" name='category_id' rules={[{ required: true, message: 'Danh mục không được để trống' }]}>
                <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn 1 danh mục"
                    onChange={() => {}}
                    options={options}
                    filterOption={(input, options) => {
                        return (
                            options.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                            options.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
 
export default ProductInformation;