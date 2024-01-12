import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'

import { IntlNumberFormat } from '../../utils/index'

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
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
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const AntdTest = ({variationData, listVariation}) => {
    console.log('variationData: ', variationData)
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        setDataSource(variationData)
    }, [variationData])

    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    
    const listVariationColumn = listVariation?.map((item) => (
        {
            name: item.name,
            dataIndex: item.id,
            render: (_, record) => record.variations?.map((value) => value.id === item.id && value.value_name)
        }
    ))
    const converColumn = listVariationColumn&&[
        ...listVariationColumn,
        {
            name: 'Giá',
            dataIndex: 'price',
            align: 'center',
            render: (text) => text,
            editable: true,
        },
        {
            name: 'Số lượng',
            dataIndex: 'stock_infos',
            align: 'center',
            render: (text) => text,
            editable: true,
        },
        {
            name: 'SKU',
            dataIndex: 'seller_sku',
            align: 'center',
            render: (text) => <span>{text}</span>,
        },
        {
            name: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            width: '50px',
            align: 'center',
            render: (_, record) => dataSource.length >= 1 ? (
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                    <DeleteOutlined />
                </Popconfirm>
            ) : null,
        }

    ]

    const defaultColumns = converColumn?.map((item) => (
        {
            title: item.name,
            dataIndex: item.dataIndex,
            render: item.render,
            editable: item.editable,
            width: item.width,
            fixed: item.fixed,
            align: item.align
        }
    ))

  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
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
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns?.map((col) => {
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
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};
export default AntdTest;