import React, { useState } from 'react';
import { Table, Modal, Input, Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useOrdersStore } from "../../store/ordersStore";
import { toast } from 'react-toastify';


const PackagesStatusTable = ({ data, onSaveSuccess, packageSelected, packageStatus }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editedProducts, setEditedProducts] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const { loadingProductPackage,updateProductPackage } = useOrdersStore();
    const [LoadingSave, setLoadingSave] = useState(loadingProductPackage);
    const { updatePackageStatus } = useOrdersStore();

    const handleUpdatePackage = (data) => {
        console.log('handleUpdatePackage: ', data, packageStatus);
        const onSuccess = (res) => {
            if (res) {
                toast.success('Update thành công!');
            }         
        }

        const onFail = (err) => {
            console.log(err);            
        }
        const dataSubmit = {
            status: packageStatus[0]
        }
        console.log('dataSubmit:', dataSubmit);
        
        if (packageStatus?.length > 1) toast.error('Bạn đang chọn nhiều trạng thái khác nhau. Vui lòng chỉ chọn 1!');
        else updatePackageStatus(data, dataSubmit, onSuccess, onFail);
    }
    
    const columns = [
        {
            title: 'SST',
            dataIndex: 'sst',
            key: 'sst',
            render: (_, record, index) => index,
            width: '20px'
        },
        {
            title: 'Order Id',
            dataIndex: 'order_id',
            key: 'order_id'
        },
        {
            title: 'Package Id',
            dataIndex: 'pack_id',
            key: 'pack_id',
            render: (packId, record) => (
                <a onClick={() => record.handlePackageClick(record.products)} style={{ cursor: 'pointer' }}>
                    {packId}
                </a>
            ),
        },
        {
            title: 'Products Mock Up',
            dataIndex: 'products',
            key: 'product_mockup',
            render: (products) => (
                <div>
                    {products.length > 0 && (
                        <>
                            <img
                                src={products[0].mock_up_front_url}
                                alt="Product Mockup"
                                style={{ width: '100px', height: 'auto', marginRight: '10px' }}
                            />
                            <span>{`+${products.length - 1} more`}</span>
                        </>
                    )}
                </div>
            ),
        },
        {
            title: 'Label',
            dataIndex: 'linkLabel',
            key: 'linkLabel',
            width: 200,
            render: (text) => <a className='w-full block' href={text}>{text}</a>
        },
        {
            title: 'Số lượng sản phẩm',
            dataIndex: 'quantity',
            key: 'products',
            align: 'center',
            render: (_, record) => {
                const totalQuantity = record.products.reduce((sum, product) => sum + product.quantity, 0)
                return (
                    <div>{totalQuantity}</div>
                )
            }
        },
        {
            title: 'Shipping information',
            dataIndex: 'linkLabel',
            key: 'linkLabel',
            render: (_, record) => (
                <div>
                    <ul>
                        <li><strong>Buyer name:</strong> <span>{record.buyer_first_name} {record.buyer_last_name}</span></li>
                        <li><strong>Buyer email:</strong> <span>{record.buyer_email}</span></li>
                        <li><strong>Address:</strong> <span>{record.buyer_address1} | {record.buyer_address2}</span></li>
                        <li><strong>City:</strong> <span>{record.buyer_city}</span></li>
                        <li><strong>State:</strong> <span>{record.buyer_province_code}</span></li>
                        <li><strong>Country:</strong> <span>{record.buyer_country_code}</span></li>
                        <li><strong>Zip code:</strong> <span>{record.buyer_zip}</span></li>
                    </ul>
                </div>
            )
        },
        {
            title: 'Action',
            tabIndex: 'action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Tooltip title="Cập nhật theo trạng thái đã chọn ở trên">
                    <Button type='primary' icon={<EditOutlined />} onClick={() => handleUpdatePackage(record.id)}></Button>
                </Tooltip>
            )
        }
    ];

    const handlePackageClick = (products) => {
        setSelectedProducts(products);
        setEditedProducts(products.map(product => ({ ...product }))); // Create a copy for editing
        setIsModalVisible(true);
    };

    const handleInputChange = (index, field, value) => {
        const updatedProducts = [...editedProducts];
        updatedProducts[index][field] = value;
        setEditedProducts(updatedProducts);
    };

    const handleSave = async () => {
        setLoadingSave(true);
        try {
            if (!selectedProducts || selectedProducts.length === 0) {
                throw new Error("No products selected.");
            }
    
            // Tạo các promise để gọi API cho từng product
            const updatePromises = editedProducts.map((product) => {
                
                const productPackageId = product?.id;
                if (!productPackageId) {
                    throw new Error(`Product package ID is missing for product: ${product.name}`);
                }
    
                // Gọi hàm updateProductPackage cho từng product
                return updateProductPackage(
                    productPackageId,
                    {  product }, 
                    () => {
                        console.log(`Update successful for product ID: ${productPackageId}`);
                    },
                    (errorMessage) => {
                        console.error(`Update failed for product ID: ${productPackageId}`, errorMessage);
                    }
                );
            });
    
            // Chờ tất cả các API kết thúc
            await Promise.all(updatePromises);
            
            // Đóng modal sau khi hoàn thành
            setIsModalVisible(false);
            setEditedProducts([]); // Clear the edited products state
            console.log("All updates completed successfully.");
        } catch (error) {
            console.error("Save failed:", error);
            // Hiển thị thông báo lỗi thân thiện nếu cần thiết
        } finally {
            setLoadingSave(false); // Reset loading state
            onSaveSuccess()
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditedProducts([]);
    };

    const dataWithHandlers = data.map((record) => ({
        ...record,
        handlePackageClick: handlePackageClick
    }));

    const onSelectChange = (_, newSelectedRows) => {
        setSelectedRows(newSelectedRows);
        packageSelected(newSelectedRows);
    };

    const rowSelection = {
        selectedRows,
        onChange: onSelectChange,
    };

    return (
        <>
            <Table 
                rowKey="order_id" 
                rowSelection={rowSelection} 
                columns={columns} 
                dataSource={dataWithHandlers} 
                loading={LoadingSave} 
                scroll={{
                x: 'max-content',
            }} 
            />
        </>
    );
};

export default PackagesStatusTable;