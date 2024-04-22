import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';
import React, { useState } from 'react';
import { variationsOption } from '../../constants';
import { flatMapArray } from '../../utils';
import CustomSelect from '../../pages/stores/CustomSelect';
import ProductVariationsPrice from './ProductVariationsPrice';

function ProductCreateAddVariationForm({ handleAdd, handleClose, warehouses }) {
  const [form] = Form.useForm();
  const [showModalPrice, setShowModalPrice] = useState(false);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [variationsData, setVariationsData] = useState([]);
  const initColorOptions = [
    {
      label: 'Black',
      value: 'Black',
    },
    {
      label: 'White',
      value: 'White',
    },
  ];
  const initSizeOptions = [
    {
      label: 'S',
      value: 'S',
    },
    {
      label: 'M',
      value: 'M',
    },
  ];

  const warehouseOptions = warehouses?.warehouse_list?.map((item) => ({
    value: item.warehouse_id,
    label: item.warehouse_name,
  }));

  const selectedSelector = flatMapArray(selectedColor, selectedSize);

  console.log('selectedSize: ', selectedSize);

  const handAddVariations = () => {
    handleAdd(variationsData);
  };

  const handleAddData = (data) => {
    const newData = data?.map((item) => ({
      ...item,
      variations: item.variations?.map((item, index) => ({
        id: index === 0 ? variationsOption[0].value : variationsOption[1].value,
        name: index === 0 ? variationsOption[0].label : variationsOption[1].label,
        ...item,
      })),
    }));
    setVariationsData(newData);
    setShowModalPrice(false);
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item name={['variations', 'Size']} label="Size" required tooltip="This is a required field">
        <CustomSelect optionsSelect={initSizeOptions} selectedDefault={selectedSize} type="kích cỡ" onChange={setSelectedSize} />
      </Form.Item>
      <Form.Item name={['variations', 'Color']} label="Màu" required tooltip="This is a required field">
        <CustomSelect optionsSelect={initColorOptions} selectedDefault={selectedColor} type="màu" onChange={setSelectedColor} />
      </Form.Item>
      {selectedSelector?.length > 0 && (
        <Button
          type="primary"
          ghost
          onClick={() => setShowModalPrice(true)}
          icon={<EditOutlined />}
          className="block ml-auto mt-9"
        >
          Chỉnh sửa giá
        </Button>
      )}

      {showModalPrice && (
        <Modal
          title="Chỉnh sửa giá"
          open={showModalPrice}
          onCancel={() => {
            setShowModalPrice(false);
          }}
          footer={null}
          okText="Đồng ý"
          cancelText="Hủy"
          width={1200}
          maskClosable={false}
        >
          <ProductVariationsPrice
            selectedSelector={selectedSelector}
            warehouseOptions={warehouseOptions}
            handleAddData={handleAddData}
          />
        </Modal>
      )}

      <Form.Item>
        <Button type="primary" htmlType="button" onClick={handleClose} className="mr-3">
          Huỷ
        </Button>
        <Button type="primary" htmlType="submit" onClick={handAddVariations}>
          Thêm biến thể
        </Button>
      </Form.Item>
    </Form>
  );
}
export default ProductCreateAddVariationForm;
