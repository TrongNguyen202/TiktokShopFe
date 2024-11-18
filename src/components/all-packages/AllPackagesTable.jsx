import React, { useState } from 'react';
import { Table, Modal, Input, Button } from 'antd';
import { useOrdersStore } from "../../store/ordersStore";

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
        render: (text) => <a href={text}>{text}</a>
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
];

const AllPackagesTable = ({ data,onSaveSuccess }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editedProducts, setEditedProducts] = useState([]);
    const { loadingProductPackage,updateProductPackage } = useOrdersStore();
    const [LoadingSave, setLoadingSave] = useState(loadingProductPackage);

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

    return (
        <>
            <Table columns={columns} dataSource={dataWithHandlers} loading={LoadingSave} />
            <Modal
                title="Edit Products"
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSave}>
                        Save
                    </Button>,
                ]}
            >
                {editedProducts.map((product, index) => (
                    <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                        <img
                            src={product.mock_up_front_url}
                            alt={`Product Mockup ${index + 1}`}
                            style={{ width: '100%', height: 'auto', marginBottom: '5px' }}
                        />
                        <Input
                            placeholder="Product Name"
                            value={product.product_name}
                            onChange={(e) => handleInputChange(index, 'product_name', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Quantity"
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Variant ID"
                            value={product.variant_id}
                            onChange={(e) => handleInputChange(index, 'variant_id', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Color"
                            value={product.color}
                            onChange={(e) => handleInputChange(index, 'color', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Size"
                            value={product.size}
                            onChange={(e) => handleInputChange(index, 'size', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Style"
                            value={product.style}
                            onChange={(e) => handleInputChange(index, 'style', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Mock Up Front URL"
                            value={product.mock_up_front_url}
                            onChange={(e) => handleInputChange(index, 'mock_up_front_url', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Mock Up Back URL"
                            value={product.mock_up_back_url}
                            onChange={(e) => handleInputChange(index, 'mock_up_back_url', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Printer Design Front URL"
                            value={product.printer_design_front_url}
                            onChange={(e) => handleInputChange(index, 'printer_design_front_url', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input
                            placeholder="Printer Design Back URL"
                            value={product.printer_design_back_url}
                            onChange={(e) => handleInputChange(index, 'printer_design_back_url', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <Input.TextArea
                            placeholder="Note"
                            value={product.note}
                            onChange={(e) => handleInputChange(index, 'note', e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                    </div>
                ))}
            </Modal>
        </>
    );
};

export default AllPackagesTable;