import React, { useState } from 'react';
import { Select, Input, Button } from 'antd';

function CustomSelect() {
  const [limitType, setLimitType] = useState('no_limit');
  const [limitValue, setLimitValue] = useState('No Limit');
  const [items, setItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleLimitTypeChange = (label, value) => {
    if (label === 'no_limit') {
      setIsDropdownVisible(false);
      setLimitValue('No Limit');
    } else {
      setLimitType(label);
      setLimitValue(value);
    }
  };

  const handleLimitInputChange = (e) => {
    setLimitValue(e.target.value);
  };

  const handleSetLimit = () => {
    if (limitType === 'set_limit' && limitValue.trim() !== '') {
      setItems([...items, limitValue.trim()]);
      setLimitValue(limitValue);
      setIsDropdownVisible(true);
    }
    setIsDropdownVisible(false);
  };

  return (
    <Select
      placeholder="No Limit"
      value={limitValue}
      onClick={(e) => {
        e.preventDefault();
        setIsDropdownVisible(!isDropdownVisible);
      }}
      open={isDropdownVisible}
      style={{ width: 150, textAlign: 'center' }}
      // eslint-disable-next-line react/no-unstable-nested-components
      dropdownRender={() => (
        <div>
          <>
            <p
              className="text-center text-black p-2 hover:bg-[#f5f5f5] cursor-pointer rounded-sm font-semibold"
              onClick={() => handleLimitTypeChange('no_limit', 'no_limit')}
            >
              No limit
            </p>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLimitTypeChange('set_limit', limitValue);
              }}
            >
              <p className="text-center text-black p-2 hover:bg-[#f5f5f5] cursor-pointer rounded-sm font-semibold">
                Set limit
              </p>
              {limitType === 'set_limit' && (
                <div className="p-2 flex">
                  <Input onChange={handleLimitInputChange} style={{ width: 100, marginRight: 8 }} />
                  <Button type="primary" onClick={handleSetLimit}>
                    Set
                  </Button>
                </div>
              )}
            </div>
          </>
        </div>
      )}
    />
  );
}

export default CustomSelect;
