import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useRef, useState } from 'react';

let indexOption = 0;

const initialOptions = (optionsSelect, selectedDefault) => {
  if (!optionsSelect) return [];
  const options = [...optionsSelect];
  if (selectedDefault && selectedDefault?.length) {
    selectedDefault.forEach((item) => {
      if (!options.find((option) => option.value === item)) {
        options.push({ label: item, value: item });
      }
    });
  }
  return options;
};

export default function CustomSelect({ optionsSelect, type, onChange, selectedDefault }) {
  const [options, setOptions] = useState(initialOptions(optionsSelect, selectedDefault));
  const [valueTextAreas, setValueTextAreas] = useState('');
  const inputRef = useRef(null);

  const onChangeTextArea = (event) => {
    setValueTextAreas(event.target.value);
  };

  const addMultipleItem = (e) => {
    e.preventDefault();
    const value = valueTextAreas.split(', ');
    if (!value || !value.length) return;
    const newOptions = [...options];
    const values = [...selectedDefault];
    value.forEach((item) => {
      if (!newOptions.find((option) => option.value === item)) {
        indexOption += 1;
        values.push(item);
        newOptions.push({
          label: item || `${type} ${indexOption}`,
          value: item || `${type} ${indexOption}`,
        });
      } else if (!values.find((option) => option === item)) {
        values.push({
          value: item,
          label: item,
        });
      }
    });
    onChange(values);
    setOptions(newOptions);
    setValueTextAreas('');
  };

  const handleChangeSelect = (value) => {
    const convertValue = value && value.length ? value.map((item) => item.key) : [];
    onChange(convertValue);
  };

  return (
    <Select
      labelInValue
      filterOption={false}
      defaultValue={selectedDefault}
      value={selectedDefault}
      mode="tags"
      className="w-[100%]"
      placeholder={`Chọn ${type}`}
      //   onSearch={debounceFetcher}
      notFoundContent={<div className="text-center">Không có dữ liệu</div>}
      //   {...props}
      onChange={handleChangeSelect}
      // eslint-disable-next-line react/no-unstable-nested-components
      dropdownRender={(menu) => (
        <div className="w-full">
          {menu}
          <Divider
            style={{
              margin: '8px 0',
            }}
          />
          {/* <Space
            style={{
              padding: "0 8px 4px",
            }}
          >
            <Input
              placeholder={`Thêm 1 ${type}`}
              ref={inputRef}
              value={valueInput}
              onChange={onChangeName}
              onKeyDown={(e) => e.stopPropagation()}
              onPressEnter={addItem}
              className="w-[250px]"
            />
            <Button
              type="primary"
              ghost
              icon={<PlusOutlined />}
              onClick={addItem}
            >
              Thêm
            </Button>
          </Space> */}
          <div className="pl-2 w-full mb-5">
            <p className="text-black ">
              Thêm nhiều<span className="italic text-[12px]"> (Các trường cách nhau bởi dấu phẩy)</span>
            </p>
            <Space className="mt-2 w-full">
              <TextArea
                placeholder={`Thêm nhiều ${type}`}
                ref={inputRef}
                value={valueTextAreas}
                onChange={onChangeTextArea}
                onKeyDown={(e) => e.stopPropagation()}
                onPressEnter={addMultipleItem}
                className="w-[250px]"
                rows={4}
              />
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={addMultipleItem}>
                Thêm
              </Button>
            </Space>
          </div>
        </div>
      )}
      options={options}
    />
  );
}
