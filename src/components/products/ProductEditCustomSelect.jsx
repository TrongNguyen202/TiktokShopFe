import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import React, { useRef, useState } from "react";

let indexOption = 0;

const ProductEditCustomSelect = ({ optionsSelect, type, onChange, selectedDefault }) => {
  const [options, setOptions] = useState(optionsSelect);
  const [valueInput, setValueInput] = useState("");
  const inputRef = useRef(null);

  const onChangeName = (event) => {
    setValueInput(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    indexOption = indexOption + 1;
    setOptions([
      ...options,
      {
        label: valueInput || `${type} ${indexOption}`,
        value: `${Math.floor(Math.random() * 10000000000000000000)}`,
      },
    ]);
    setValueInput("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleChangeSelect = (value) => {
    const selectedOption = value?.map((item) => (
      options.find(option => option.value === item)
    ))
    onChange(selectedOption)
  }

  return (
    <Select
      defaultValue={selectedDefault}
      mode="multiple"
      className="w-[100%]"
      placeholder={`Chọn ${type}`}
      notFoundContent={<div className="text-center">Không có dữ liệu</div>}
      onChange={handleChangeSelect}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider className="mx-[8px]"/>
          <Space className="px-[8px] pb-[4px]">
            <Input
              placeholder={`Thêm ${type}`}
              ref={inputRef}
              value={valueInput}
              onChange={onChangeName}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button
              type="primary"
              ghost
              icon={<PlusOutlined />}
              onClick={addItem}
            >
              Thêm
            </Button>
          </Space>
        </>
      )}
      options={options}
    />
  );
}

export default ProductEditCustomSelect