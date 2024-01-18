import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Button, Form, Input, Popconfirm, Table, Modal, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'

import { removeDuplicates } from '../../utils'
import { variationsOption } from '../../constants'
import ProductCreateAddVariationForm from './ProductCreateAddVariationForm';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    // console.log('edit table row')
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({title, editable, children, dataIndex, record, handleSave, ...restProps}) => {
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
            console.log('edit table cell')
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

    if (editable) {
        children = editing ? (
            <Form.Item name={dataIndex} rules={[ { required: true, message: `${title} không được để trống.`, }]}>
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
            ) : (
            <Tooltip title={`Nhấn vào để sửa ${title}`}>
                <div className="editable-cell-value-wrap min-w-[50px] min-h-[20px] cursor-pointer" tyle={{ paddingRight: 24, }} onClick={toggleEdit} >
                    {children}
                </div>
            </Tooltip>
        );
    }
    return <td {...restProps}>{children}</td>;
};

const ProductCreateVariationTable = ({variationsData, listVariation, variationsDataTable}) => {
    const [dataSource, setDataSource] = useState([]);
    const [dataColumns, setDataColumns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const warehouseData = dataSource?.map((item) => (
        {
            key: item?.key,
            warehouse_id: item?.stock_infos?.warehouse_id
        }
    ))
    const warehouseId = removeDuplicates(warehouseData, 'warehouse_id')
    
    useEffect(() => {
        if(variationsData && variationsData[0]?.variations[0]?.value_name !== "Default") {
            setDataSource(variationsData)
            setDataColumns(listVariation)
        }
    }, [variationsData, listVariation]);

    // console.log('variationsData: ', variationsData)
    // console.log('dataColumns: ', dataColumns)
    
    

    useMemo(() => {
        variationsDataTable(dataSource)
    }, [])

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const handleAdd = (newData) => {
        const newDataConvert = {
            price: newData.price,
            seller_sku: newData.seller_sku,
            stock_infos: {
                available_stock: newData.stock_infos.available_stock,
            },
            variations: [
                {
                    id: newData.id,
                    name: variationsOption.find(item => item.value === newData.id)?.label,
                    value_id: newData.value_id,
                    value_name: newData.value_name
                }
            ]
        }
        
        const dataVariation = dataSource.map((item) => (
            item?.variations
        ))
        console.log('dataVariation: ', dataVariation);
        const daVariationConvert = dataVariation&&[].concat(...dataVariation);
        const dataVariationGroup = daVariationConvert.filter((item) => item.id !== newData.id)
        const dataVariationsConvert = dataVariationGroup.map((item) => (
            {
                variations: [
                    item,
                    newData
                ]
            }
        ))
        const newDataVariations = dataVariationsConvert?.map((item) => (
            {
                key: `${Math.floor(Math.random() * 1000000000000000000)}`,
                price: item.price,
                seller_sku: item.seller_sku,
                stock_infos: {
                    available_stock: item.stock_infos.available_stock,
                    warehouse_id: warehouseId?.length > 1 ? '' : warehouseId[0]?.warehouse_id
                },
                variations: item.variations
            }
        ))
        console.log('dataVariationsConvert: ', dataVariationsConvert);
        console.log('newDataVariations: ', newDataVariations);
        setDataSource([newDataConvert, ...newDataVariations]);
        setDataColumns([newDataConvert, ...newDataVariations])
        setIsModalOpen(false)
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

    const defaultColumns = dataColumns&&dataColumns?.map((item) => (
        {
            title: item.name,
            dataIndex: item.id,
            render: (_, record) => (
                record?.variations?.map((variation) => (
                    variation.id === item.id && variation.value_name
                ))
            )
        }
    ))

    console.log('dataSource: ', dataSource);
    const extraColumns = defaultColumns&&[
        {
            title: 'Color',
            dataIndex: ['variations', 'Color'],
            render: (_, record) => (
                record?.variations?.map((item) => item.id === "100000" && item.value_name)
            )
        },
        {
            title: 'Size',
            dataIndex: ['variations', 'Size'],
            render: (_, record) => (
                record?.variations?.map((item) => item.id === "100007" && item.value_name)
            )
        },
        {
            title: 'SKU',
            dataIndex: 'seller_sku',
            editable: true
        },
        {
            title: 'Price',
            dataIndex: 'price',
            align: 'center',
            editable: true
        },
        {
            title: 'Số lượng',
            dataIndex: ['stock_infos', 'available_stock'],
            align: 'center',
            editable: true
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
        }
    ]

    // console.log('dataSource: ', dataSource)

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
            <Button onClick={() => setIsModalOpen(true)} type="primary" className='mb-3'>Thêm biến thể</Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource&&dataSource}
                columns={columns}
            />
            <Modal title="Thêm giá trị thuộc tính" open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)}>
                <ProductCreateAddVariationForm handleClose={() => setIsModalOpen(false)} handleAdd={handleAdd} />
            </Modal>
        </div>
    );
};

export default ProductCreateVariationTable;