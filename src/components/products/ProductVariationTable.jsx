import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Table, Tooltip } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ProductCreateAddVariationForm from './ProductCreateAddVariationForm';
import ProductEditAddVariationForm from './ProductEditAddVariationForm';

const EditableContext = React.createContext(null);

function EditableRow({ index, ...props }) {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}

function EditableCell({ title, editable, children, dataIndex, record, handleSave, ...restProps }) {
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
    const values = await form.validateFields();
    toggleEdit();
    handleSave({
      ...record,
      ...values,
    });
  };

  if (editable) {
    children = editing ? (
      <Form.Item name={dataIndex} rules={[{ required: true, message: `${title} không được để trống.` }]}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <Tooltip title={`Nhấn vào để sửa ${title}`}>
        <div
          className="editable-cell-value-wrap min-w-[50px] min-h-[20px] cursor-pointer"
          style={{ paddingRight: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      </Tooltip>
    );
  }
  return <td {...restProps}>{children}</td>;
}

function ProductCreateVariationTable({ variationsData, variationsDataTable, isProductCreate, warehouses }) {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const variationsEdit = variationsData?.map((item) => item.variations);
  const variationsEditSelect = variationsEdit && [].concat(...variationsEdit);

  useEffect(() => {
    if (variationsData && variationsData[0]?.variations[0]?.value_name !== 'Default') {
      setDataSource(variationsData);
    }
  }, [variationsData]);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = (newData) => {
    setDataSource(newData);
    variationsDataTable(newData, ...dataSource);
    setIsModalOpen(false);
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

  // console.log('dataSource: ', dataSource);
  const extraColumns = [
    {
      title: 'Color',
      dataIndex: ['variations', 'Color'],
      render: (_, record) => record?.variations?.map((item) => item.id === '100000' && item.value_name),
    },
    {
      title: 'Size',
      dataIndex: ['variations', 'Size'],
      render: (_, record) => record?.variations?.map((item) => item.value_name),
    },
    {
      title: 'SKU',
      dataIndex: 'seller_sku',
      editable: true,
      width: '250px',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'center',
      editable: true,
      width: '200px',
    },
    {
      title: 'Số lượng',
      dataIndex: ['stock_infos', 'available_stock'],
      align: 'center',
      editable: true,
      width: '200px',
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <DeleteOutlined />
          </Popconfirm>
        ) : null,
    },
  ];

  const columns = extraColumns?.map((col) => {
    if (!col.editable) return col;

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
      {isProductCreate && (
        <Button onClick={() => setIsModalOpen(true)} type="primary" className="mb-3">
          Thêm biến thể
        </Button>
      )}
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        scroll={{ x: true }}
        dataSource={dataSource && dataSource}
        columns={columns}
      />
      <Modal title="Thêm giá trị thuộc tính" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        {isProductCreate ? (
          <ProductCreateAddVariationForm
            handleClose={() => setIsModalOpen(false)}
            handleAdd={handleAdd}
            warehouses={warehouses}
          />
        ) : (
          <ProductEditAddVariationForm
            handleClose={() => setIsModalOpen(false)}
            handleAdd={handleAdd}
            warehouses={warehouses}
            variationsSelect={variationsEditSelect}
          />
        )}
      </Modal>
    </div>
  );
}

export default ProductCreateVariationTable;
