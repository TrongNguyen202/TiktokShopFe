import { Button, Form, Input, Popconfirm, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./EditPriceForm.css";
import { data } from "autoprefixer";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} className="w-[100px]">
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

function sortByType(arr) {
  return arr.sort((a, b) => {
    if (a.type > b.type) return 1;
    if (a.type < b.type) return -1;
    return 0;
  });
}

const convertDataTable = (selectedType, selectedSize, selectedColor) => {
  const data = [];
  if (!selectedType || !selectedType.length) return [];

  for (let i = 0; i < selectedSize.length; i++) {
    for (let j = 0; j < selectedType.length; j++) {
      data.push({
        id: `${selectedType[j]}-${selectedSize[i]}`,
        type: selectedType[j],
        size: selectedSize[i],
        quantity: 0,
        price: 0,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
      });
    }
  }
  return sortByType(data);
};

export default function EditPriceForm({
  selectedSize,
  dataPrice,
  onSavePrice,
  setShowModalPrice,
}) {
  const [dataSource, setDataSource] = useState(dataPrice);

  const dataSource2 = useRef(dataPrice);

  const defaultColumns = [
    {
      title: "Type",
      dataIndex: "type",
      width: "25%",
      render: (text, row, index) => {
        if (index % selectedSize.length === 0) {
          return {
            children: text,
            props: {
              rowSpan: selectedSize.length,
            },
          };
        } else {
          return {
            props: {
              rowSpan: 0,
            },
          };
        }
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "25%",
      editable: true,
      render: (text, row, index) => {
        if (index % selectedSize.length === 0) {
          return {
            children: text,
            props: {
              rowSpan: selectedSize.length,
            },
          };
        } else {
          return {
            props: {
              rowSpan: 0,
            },
          };
        }
      },
    },
    {
      title: "Size",
      dataIndex: "size",
      width: "25%",
    },
    {
      title: "Price",
      dataIndex: "price",
      editable: true,
      width: "25%",
    },
  ];

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    useEffect(() => {
      inputRef?.current?.focus();
    }, [dataSource]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    const handleChangeInput = (e, record, dataIndex) => {
      const updatedItems = dataSource2.current.map((item) => {
        if (item.id === record.id) {
          return { ...item, [dataIndex]: e.target.value };
        }
        return item;
      });
      dataSource2.current = updatedItems;
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
            width: "155px",
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
          <Input
            ref={inputRef}
            type="number"
            onChange={(e) => handleChangeInput(e, record, dataIndex)}
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleSaveDataSource = () => {
    setDataSource(dataSource2.current);
    onSavePrice(dataSource2.current);
    setShowModalPrice(false);
  };

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      
      <Button
        onClick={handleSaveDataSource}
        type="primary"
        className="mt-3 w-[300px] mx-auto block"
      >
        Lưu
      </Button>
    </div>
  );
}
