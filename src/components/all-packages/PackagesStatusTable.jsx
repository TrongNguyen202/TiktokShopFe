import React, { useState } from 'react';
import { Table, Modal, Input, Button, Tooltip, Menu, Tag, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useOrdersStore } from "../../store/ordersStore";
import { toast } from 'react-toastify';
import Dropdown from 'antd/es/dropdown/dropdown';
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { saveAs } from "file-saver";

const PackagesStatusTable = ({ data, onSaveSuccess, packageSelected, packageStatus }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editedProducts, setEditedProducts] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const { loadingProductPackage,updateProductPackage,loadingAllPackages } = useOrdersStore();
    const [LoadingSave, setLoadingSave] = useState(loadingProductPackage);
    const { updatePackageStatus } = useOrdersStore();
    const [statusFilter, setStatusFilter] = useState([]);

    const statuses = [
        { value: 'init', label: 'Đã tiếp nhận' },
        { value: 'no_design', label: 'Chưa có design' },
        { value: 'has_design', label: 'Đã có design' },
        { value: 'print_pending', label: 'Đang in pet' },
        { value: 'printed', label: 'Đã in xong pet' },
        { value: 'in_production', label: 'Đang sản xuất' },
        { value: 'production_done', label: 'Đã sản xuất xong' },
        { value: 'shipping_to_us', label: 'Đang giao đến US' },
        { value: 'shipped_to_us', label: 'Đã giao đến US' },
        { value: 'shipping_within_us', label: 'Đang giao trong US' },
        { value: 'delivered_to_customer', label: 'Đã giao đến khách hàng' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'can_not_produce', label: 'Không thể sản xuất' },
        { value: 'lack_of_pet', label: 'Thiếu pet' },
        { value: 'wrong_design', label: 'Sai design' },
        { value: 'wrong_mockkup', label: 'Sai mockup' },
        { value: 'forwarded_to_supify', label: 'Chuyển tiếp đến xưởng Supify' },
        { value: 'sent_to_onos', label: 'Đã giao cho Onos' },
        { value: 'fullfilled', label: 'Đã xuất đơn Fulfilled' },
        { value: 'reforwarded_to_hall', label: 'Chuyển về sảnh fullfill cũ' }
    ];
    
    
    const handleUpdatePackage = (id, selectedStatus) => {
        console.log('handleUpdatePackage: ', id, selectedStatus);
    
        const onSuccess = (res) => {
            if (res) {
                toast.success('Update thành công!');
            }
        };
    
        const onFail = (err) => {
            console.log(err);
        };
    
        if (!selectedStatus) {
            toast.error('Bạn chưa chọn trạng thái!');
            return;
        }
    
        const dataSubmit = {
            status: selectedStatus
        };
        console.log('dataSubmit:', dataSubmit);
    
        updatePackageStatus(id, dataSubmit, onSuccess, onFail);
    };
    
    const columns = [
        // {
        //     title: 'SST',
        //     dataIndex: 'sst',
        //     key: 'sst',
        //     render: (_, record, index) => index,
        //     width: '20px'
        // },
        {
            title: 'STT Supify',
            dataIndex: 'number_sort',
            key: 'number_sort',
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
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusColors = {
                    init:'lightgray',
                    no_design: 'red',
                    has_design: 'orange',
                    print_pending: 'blue',
                    printed: 'green',
                    in_production: 'purple',
                    production_done: 'cyan',
                    shipping_to_us: 'lime',
                    shipped_to_us: 'gold',
                    shipping_within_us: 'magenta',
                    delivered_to_customer: 'green',
                    cancelled: 'gray',
                    can_not_produce: 'darkred',
                    lack_of_pet: 'pink',
                    wrong_design: 'darkorange',
                    wrong_mockkup: 'brown',
                    forwarded_to_supify: 'lightblue',
                    sent_to_onos: 'teal',
                    fullfilled: 'darkgreen',
                    reforwarded_to_hall: 'slategray'
                };
        
                const statusLabels ={'init': 'Đã tiếp nhận',
                    'no_design': 'Chưa có design',
                    'has_design': 'Đã có design',
                    'print_pending': 'Đang in pet',
                    'printed': 'Đã in xong pet',
                    'in_production': 'Đang sản xuất',
                    'production_done': 'Đã sản xuất xong',
                    'shipping_to_us': 'Đang giao đến US',
                    'shipped_to_us': 'Đã giao đến US',
                    'shipping_within_us': 'Đang giao trong US',
                    'delivered_to_customer': 'Đã giao đến khách hàng',
                    'cancelled': 'Cancelled',
                    'can_not_produce': 'Không thể sản xuất',
                    'lack_of_pet': 'Thiếu pet',
                    'wrong_design': 'Sai design',
                    'wrong_mockkup': 'Sai mockup',
                    'forwarded_to_supify': 'Chuyển tiếp đến xưởng Supify',
                    'sent_to_onos': 'Đã giao cho Onos',
                    'fullfilled': 'Đã xuất đơn Fulfilled',
                    'reforwarded_to_hall': 'Chuyển về sảnh fullfill cũ'};
                return (
                    <Tag color={statusColors[status] || 'default'}>
                        {statusLabels[status] || 'Unknown'}
                    </Tag>
                );
            },
        },
        {
            title:'supify_create_time',
            dataIndex: 'supify_create_time',
            key: 'supify_create_time',
            render: (text) => <p href={text}>{text}</p>
        },
        
        {
            title:'fulfillment_name',
            dataIndex: 'fulfillment_name',
            key: 'fulfillment_name',
            render: (text) => <p href={text}>{text}</p>
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
            title: 'Missing Design',
            dataIndex: 'isMissingDesign',
            key: 'isMissingDesign',
            render: (isMissingDesign) => (
                <span style={{ color: isMissingDesign ? 'red' : 'green' }}>
                    {isMissingDesign ? 'Missing' : 'Complete'}
                </span>
            ),
        },
        {
            title:'seller_note',
            dataIndex: 'seller_note',
            key: 'seller_note',
            render: (text) => <p href={text}>{text}</p>
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
            title: 'Label',
            dataIndex: 'linkLabel',
            key: 'linkLabel',
            width: 200,
            render: (text) => <a className='w-full block' href={text}>{text}</a>
        },
       
        {
            title: 'Action',
            tabIndex: 'action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Tooltip title="Cập nhật trạng thái">
                    <Dropdown
                        overlay={
                            <Menu
                                onClick={({ key }) => handleUpdatePackage(record.id, key)}
                                items={statuses.map(status => ({ key: status.value, label: status.label }))}
                            />
                        }
                        trigger={['click']}
                    >
                        <Button type='primary' icon={<EditOutlined />}></Button>
                    </Dropdown>
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

    const filteredData = data.filter((record) =>
        !statusFilter.length || statusFilter.includes(record.status)
    );
    
    const dataWithHandlers = filteredData.map((record) => ({
        ...record,
        handlePackageClick: handlePackageClick,
    }));

    const onSelectChange = (_, newSelectedRows) => {
        setSelectedRows(newSelectedRows);
        packageSelected(newSelectedRows);
    };

    const rowSelection = {
        selectedRows,
        onChange: onSelectChange,
    };
   const handleSaveProduct = async () => {
    console.log("hello")
        // setLoadingSave(true);
        // try {
        //     if (!selectedProducts || selectedProducts.length === 0) {
        //         throw new Error("No products selected.");
        //     }
    
        //     // Tạo các promise để gọi API cho từng product
        //     const updatePromises = editedProducts.map((product) => {
                
        //         const productPackageId = product?.id;
        //         if (!productPackageId) {
        //             throw new Error(`Product package ID is missing for product: ${product.name}`);
        //         }
    
        //         // Gọi hàm updateProductPackage cho từng product
        //         return updateProductPackage(
        //             productPackageId,
        //             {  product }, 
        //             () => {
        //                 console.log(`Update successful for product ID: ${productPackageId}`);
        //             },
        //             (errorMessage) => {
        //                 console.error(`Update failed for product ID: ${productPackageId}`, errorMessage);
        //             }
        //         );
        //     });
    
        //     // Chờ tất cả các API kết thúc
        //     await Promise.all(updatePromises);
            
        //     // Đóng modal sau khi hoàn thành
        //     setIsModalVisible(false);
        //     setEditedProducts([]); // Clear the edited products state
        //     console.log("All updates completed successfully.");
        // } catch (error) {
        //     console.error("Save failed:", error);
        //     // Hiển thị thông báo lỗi thân thiện nếu cần thiết
        // } finally {
        //     setLoadingSave(false); // Reset loading state
        //     onSaveSuccess()
        // }
    };

    return (
        <>
        <div style={{ marginBottom: '16px' }}>
                <div type="primary">
                    Số hàng đã chọn: {selectedRows.length}
                </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <span>Filter by Status: </span>
                <Select
                    mode="multiple"
                    style={{ minWidth: '200px' }}
                    placeholder="Select status"
                    options={statuses.map((status) => ({ value: status.value, label: status.label }))}
                    onChange={(selectedStatus) => setStatusFilter(selectedStatus)}
                />
            </div>

            <Table 
                rowKey="order_id" 
                rowSelection={rowSelection} 
                columns={columns} 
                dataSource={dataWithHandlers}
                loading={loadingAllPackages} 
                scroll={{
                x: 'max-content',
                
            }} 
            pagination={{ pageSize: 2000 }}
            />
             <Modal
                title="Edit Products"
                visible={isModalVisible}
                onOk={handleSaveProduct}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSaveProduct}>
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

export default PackagesStatusTable;