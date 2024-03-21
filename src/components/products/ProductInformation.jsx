import { useEffect, useState } from 'react';
import { Form, Input, Select, Row, Col, Cascader, message, Spin } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { buildNestedArraysMenu } from '../../utils';

import { useCategoriesStore } from '../../store/categoriesStore';
import ProductSectionTitle from './ProuctSectionTitle';
import CustomSelect from '../../pages/stores/CustomSelect';
import { useProductsStore } from '../../store/productsStore';
import ProductEditCustomSelect from './ProductEditCustomSelect';

function ProductInformation({ shopId, categories, brands, getAttributeValues }) {
  const [valueDescription, setValueDescription] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const { getAttributeByCategory, attributes, attributeLoading } = useCategoriesStore((state) => state);
  const { productById } = useProductsStore((state) => state);
  const categoriesData = buildNestedArraysMenu(categories, 0);

  useEffect(() => {
    if (productById?.create_time) {
      const categories = productById?.category_list;
      const categoryId = categories[categories.length - 1].id;
      const onSuccess = (res) => {
        getAttributeValues(res.data.attributes);
      };

      const onFail = (err) => {
        messageApi.open({
          type: 'error',
          content: err,
        });
      };
      getAttributeByCategory(shopId, categoryId, onSuccess, onFail);
    }
  }, [productById]);

  const convertBrand = brands?.brand_list?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const optionsBranch = convertBrand && [
    {
      value: '',
      label: 'No brand',
    },
    ...convertBrand,
  ];

  const handleChangeCategories = (e) => {
    const categoryId = e[e.length - 1];
    const onSuccess = (res) => {
      getAttributeValues(res.data.attributes);
    };

    const onFail = (err) => {
      messageApi.open({
        type: 'error',
        content: err,
      });
    };
    getAttributeByCategory(shopId, categoryId, onSuccess, onFail);
  };

  return (
    <>
      {contextHolder}
      <Form.Item
        label="Tên sản phẩm:"
        name="product_name"
        rules={[{ required: true, message: 'Tên sản phẩm không được để trống' }]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item
        label="Danh mục:"
        name="category_id"
        rules={[{ required: true, message: 'Danh mục không được để trống' }]}
      >
        <Cascader
          options={categoriesData}
          onChange={handleChangeCategories}
          placeholder="Please select"
          showSearch={(input, options) => {
            return (
              options.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              options.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          }}
        />
      </Form.Item>

      <Form.Item label="Thương hiệu:" name="brand_id">
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Chọn 1 thương hiệu"
          // onChange={() => { }}
          options={optionsBranch}
          filterOption={(input, options) => {
            return (
              options.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              options.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          }}
        />
      </Form.Item>

      <Form.Item
        label="Mô tả:"
        name="description"
        rules={[{ required: true, message: 'Mô tả sản phẩm không được để trống' }]}
      >
        <ReactQuill theme="snow" row value={valueDescription} onChange={setValueDescription} />
      </Form.Item>

      {attributes?.attributes?.length && (
        <Spin spinning={attributeLoading}>
          <div className="w-full mt-10">
            <ProductSectionTitle title="Thuộc tính:" />
          </div>
          <Row gutter={['30', '20']}>
            {attributes?.attributes?.map((item) => {
              const optionAttribute = item?.values?.map((attr) => ({
                value: attr.id,
                label: attr.name,
              }));

              const itemAttributeSelect = ['101395', '101400', '100110', '100108'];

              const getDefaultSelected = (id) => {
                const categories = productById?.product_attributes;
                if (!categories || !Array.isArray(categories)) return [];
                const category = categories.find((item) => item.id === id);
                if (category) {
                  return category.values.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }));
                }

                return [];
              };

              return (
                <Col span={8}>
                  <Form.Item label={item.name} name={['product_attributes', item.id]}>
                    {itemAttributeSelect.includes(item.id) ? (
                      <Select style={{ width: '100%' }} options={optionAttribute} />
                    ) : (
                        <ProductEditCustomSelect
                        optionsSelect={optionAttribute}
                        type={item.name}
                        selectedDefault={getDefaultSelected(item.id) || []}
                          onChange={(value) => {
                            console.log(value);
                          }}
                      />
                    )}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Spin>
      )}
    </>
  );
}

export default ProductInformation;
