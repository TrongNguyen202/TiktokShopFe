import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';

let indexOption = 0;

function ProductEditCustomSelect({ optionsSelect, type, onChange, selectedDefault }: any) {
  const [options, setOptions] = useState(optionsSelect);
  const [valueInput, setValueInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChangeName = (event: any) => {
    setValueInput(event.target.value);
  };

  const addItem = (e: any) => {
    e.preventDefault();
    indexOption += 1;
    setOptions([
      ...options,
      {
        label: valueInput || `${type} ${indexOption}`,
        value: `${Math.floor(Math.random() * 10000000000000000000)}`,
      },
    ]);
    setValueInput('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current?.focus();
      }
    }, 0);
  };

  const handleChangeSelect = (value: any) => {
    const selectedOption = value?.map((item: any) => options.find((option: any) => option.value === item));
    onChange(selectedOption);
  };

  return (
    <Select
      defaultValue={selectedDefault}
      mode="multiple"
      className="w-[100%]"
      placeholder={`Chọn ${type}`}
      notFoundContent={<div className="text-center">Không có dữ liệu</div>}
      onChange={handleChangeSelect}
      // eslint-disable-next-line react/no-unstable-nested-components
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider className="mx-[8px]" />
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
              icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
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

export default ProductEditCustomSelect;
