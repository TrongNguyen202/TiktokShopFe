import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import React, { useRef, useState } from "react";

let indexOption = 0;

export default function CustomSelect({ optionsSelect, type, onChange }) {
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
        value: valueInput || `${type} ${indexOption}`,
      },
    ]);
    setValueInput("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleChangeSelect = (value) => {
    const convertValue = value && value.length ? value.map((item) => item.key) : []
    onChange(convertValue)
  }

  return (
    <Select
      labelInValue
      filterOption={false}
      mode="multiple"
      className="w-[100%]"
      placeholder={`Chọn ${type}`}
      //   onSearch={debounceFetcher}
      notFoundContent={<div className="text-center">Không có dữ liệu</div>}
      //   {...props}
      onChange={handleChangeSelect}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider
            style={{
              margin: "8px 0",
            }}
          />
          <Space
            style={{
              padding: "0 8px 4px",
            }}
          >
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
