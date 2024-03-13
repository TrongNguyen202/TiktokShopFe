import React, { useState } from "react";
import { Select, Input, Button } from "antd";

const CustomSelect = () => {
  const [limitType, setLimitType] = useState("no_limit");
  const [limitValue, setLimitValue] = useState("");
  const [items, setItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  console.log("isDropdownVisible", isDropdownVisible);

  const handleLimitTypeChange = (label, value) => {
    if (label === "no_limit") {
      console.log("object", label, value);
      setIsDropdownVisible(false);
    }
    setLimitType(label);
    setLimitValue("");
  };

  const handleLimitInputChange = (e) => {
    setLimitValue(e.target.value);
  };

  const handleSetLimit = (e) => {
    if (limitType === "set_limit" && limitValue.trim() !== "") {
      setItems([...items, limitValue.trim()]);
      setLimitValue("");
      setLimitType("no_limit");
    }
    setIsDropdownVisible(false);
  };

  return (
    <Select
      value={limitType}
      //   onSelect={handleLimitTypeChange}
      //   onDropdownVisibleChange={(visible) => setIsDropdownVisible(visible)}
      onClick={(e) => {
        e.preventDefault();
        setIsDropdownVisible(!isDropdownVisible);
      }}
      open={isDropdownVisible}
      style={{ width: 150 }}
      //   onChange={(e) => e.preventDefault()}
      dropdownRender={() => (
        <div
        //   onMouseDown={(e) => {
        //     e.preventDefault();
        //     e.stopPropagation();
        //   }}
        >
          {
            <>
              <p onClick={() => handleLimitTypeChange("no_limit", "no_limit")}>
                No limit
              </p>
              <p
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLimitTypeChange("set_limit", "set_limit");
                }}
              >
                set limit
                {limitType === "set_limit" && (
                  <div style={{ padding: 8 }}>
                    <Input
                      //   value={limitValue}
                      onChange={handleLimitInputChange}
                      style={{ width: 100, marginRight: 8 }}
                    />
                    <Button type="primary" onClick={handleSetLimit}>
                      Set
                    </Button>
                  </div>
                )}
              </p>
            </>
          }
        </div>
      )}
    >
      {/* <Select.Option value="no_limit">No Limit</Select.Option>
      <Select.Option value="set_limit">Set Limit</Select.Option> */}
    </Select>
  );
};

export default CustomSelect;
