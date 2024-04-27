import React, { useContext, useEffect, useRef, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Table, Tooltip } from 'antd';

import { SkuProductForm } from '../../types';

import ProductCreateAddVariationForm from './ProductCreateAddVariationForm';
import ProductEditAddVariationForm from './ProductEditAddVariationForm';

const EditableContext = React.createContext(null);

interface ProductCreateVariationTableProps {
  variationsData: any;
  variationsDataTable: any;
  isProductCreate?: boolean;
  warehouses: any;
}

interface Item {
  key: string;
  Color: string;
  seller_sku: string;
  available_stock: string;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

function EditableRow({ ...props }) {
  const [form]: any = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}

function EditableCell({ title, editable, children, dataIndex, record, handleSave, ...restProps }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const form: any = useContext(EditableContext);

  useEffect(() => {
    if (editing && inputRef.current) {
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

function ProductCreateVariationTable({
  variationsData,
  variationsDataTable,
  isProductCreate,
  warehouses,
}: ProductCreateVariationTableProps) {
  const [dataSource, setDataSource] = useState<SkuProductForm[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const variationsEdit = variationsData?.map((item: any) => item.variations);
  const variationsEditSelect = variationsEdit && [].concat(...variationsEdit);

  useEffect(() => {
    if (variationsData && variationsData[0]?.variations[0]?.value_name !== 'Default') {
      setDataSource(variationsData);
    }
  }, [variationsData]);

  const handleDelete = (key: string) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = (newData: SkuProductForm[]) => {
    console.log('newData: ', newData);
    const newDataConvert: SkuProductForm[] = newData.map((item) => ({
      ...item,
      stock_infos: item.stock_infos,
    }));
    setDataSource(newDataConvert);
    variationsDataTable(newData, ...dataSource);
    setIsModalOpen(false);
  };

  const handleSave = (row: SkuProductForm) => {
    console.log('row: ', row);
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item: any = newData[index];

    newData.splice(index, 1, {
      ...row,
      stock_infos: {
        available_stock: Array.isArray(row.stock_infos)
          ? Number(row.stock_infos[0].available_stock)
          : Number(row.stock_infos.available_stock),
        warehouse_id: item.stock_infos[0].warehouse_id,
      },
    });
    variationsDataTable(newData);
    setDataSource(newData);
  };

  // console.log('setDataSource: ', dataSource);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const extraColumns = [
    {
      title: 'Color',
      dataIndex: ['variations', 'Color'],
      render: (_: any, record: SkuProductForm) =>
        record?.variations?.map((item) => item.id === '100000' && item.value_name),
    },
    {
      title: 'Size',
      dataIndex: ['variations', 'Size'],
      render: (_: any, record: SkuProductForm) => record?.variations?.map((item) => item.value_name),
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
      render: (_: any, record: SkuProductForm) => record.stock_infos[0]?.available_stock,
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      align: 'center',
      render: (_: any, record: SkuProductForm) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <DeleteOutlined />
          </Popconfirm>
        ) : null,
    },
  ];

  const columns: any = extraColumns?.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => {
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        };
      },
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
