import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';

import { useCategoriesStore } from '../../store/categoriesStore'
import PageTitle from "../../components/common/PageTitle";

const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
};

const ProductCreate = () => {
    const location = useLocation();
    const store = location.state.store;
    const [selectedItems, setSelectedItems] = useState([]);
    const { getCategoriesById, categoriesById } = useCategoriesStore((state) => state)
    const {category_list} = categoriesById
    const OPTIONS = [
        {id: '123fd', title: 'Apples' },
        {id: 'dd23fd2', title: 'Nails'},
        {id: '1433fd5', title: 'Bananas' },
        {id: '1rifjkd', title: 'Helicopters'}
    ];

    useEffect(() => {
        const onSuccess = (res) => {
          console.log(res)
        }
        const onFail = (err) => {
          alerts.error(err)
        }

        getCategoriesById(store.id, onSuccess, onFail)
    }, [])

    return (
        <div className="p-10">
            <PageTitle title='Thêm sản phẩm' showBack />

        <Form labelCol={{span: 3}} wrapperCol={{span: 18}} layout="horizontal" >
            <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
                <Checkbox>Checkbox</Checkbox>
            </Form.Item>

            <Form.Item label="Tên sản phẩm">
                <Input />
            </Form.Item>

            <Form.Item label="Danh mục">
            <Select
                mode="multiple"
                placeholder="Inserted are removed"
                value={selectedItems}
                onChange={setSelectedItems}
                style={{
                    width: '100%',
                }}
                options={category_list.map((item) => ({
                    value: item.id,
                    label: item.local_display_name,
                }))}
            />
            </Form.Item>

            <Form.Item label="Mô tả">
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Select">
            
            </Form.Item>
            <Form.Item label="TreeSelect">
            <TreeSelect
                treeData={[
                {
                    title: 'Light',
                    value: 'light',
                    children: [
                    {
                        title: 'Bamboo',
                        value: 'bamboo',
                    },
                    ],
                },
                ]}
            />
            </Form.Item>
            <Form.Item label="Cascader">
            <Cascader
                options={[
                {
                    value: 'zhejiang',
                    label: 'Zhejiang',
                    children: [
                    {
                        value: 'hangzhou',
                        label: 'Hangzhou',
                    },
                    ],
                },
                ]}
            />
            </Form.Item>
            <Form.Item label="DatePicker">
            <DatePicker />
            </Form.Item>
            <Form.Item label="InputNumber">
            <InputNumber />
            </Form.Item>
            
            <Form.Item label="Switch" valuePropName="checked">
            <Switch />
            </Form.Item>
            <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload action="/upload.do" listType="picture-card">
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
            </Upload>
            </Form.Item>
            <Form.Item label="Button">
            <Button>Button</Button>
            </Form.Item>
            <Form.Item label="Slider">
            <Slider />
            </Form.Item>
        </Form>
        </div>
    );
}
 
export default ProductCreate;