import React, { useEffect, useState } from "react";
import { Button, Radio, Form, Input, Select, Tooltip } from 'antd';
import { ReloadOutlined, CloudDownloadOutlined, SearchOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';

import { useOrdersStore } from "../../store/ordersStore";
import AllPackagesTable from "../../components/all-packages/AllPackagesTable";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const optionSort = [
    { value: 'desc', label: 'Mới nhất'},
    { value: 'asc', label: 'Cũ nhất'},
];
const status = [
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


const defaultValues = {
    sort: optionSort[0].value,
    user: [],
    shop: [],
    fulfillment_name: [],
    create_time_gte: '',
    create_time_lt: '',
    limit: 1000,
    offset: 0,
    status: [status[0].value]
};


const AllPackages = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [shops, setShops] = useState([]);
    const [packageSelected, setPackageSelected] = useState([]);
    const [packages, setPackages] = useState([]);
    const { getUserGroup, getAllPackages, loadingAllPackages, updateFulfillmentName,updatePackageStatus,getUserShops,getUserInfor } = useOrdersStore();
    
    // console.log("package", packages)
    function markPacksWithEmptyDesigns(packs) {
        return packs.map(pack => {
          const hasMissingDesign = pack.products.some(product =>
            !product.printer_design_front_url && !product.printer_design_back_url
          );
          return { ...pack, isMissingDesign: hasMissingDesign };
        });
      }

      const filterPackages = (packages, filters) => {
        const { filterSize, filterColor, filterStyle } = filters;
        console.log("filter", filters);
        
        return packages.filter((pkg) =>
            pkg.products.some((product) => {
                const matchesStyle = filterStyle
                    ? product.style?.toLowerCase().includes(filterStyle.toLowerCase()) // Sử dụng includes cho style
                    : true;
                const matchesColor = filterColor
                    ? product.color?.toLowerCase() === filterColor.toLowerCase() // So sánh chính xác cho color
                    : true;
                const matchesSize = filterSize
                    ? product.size?.toLowerCase() === filterSize.toLowerCase() // So sánh chính xác cho size
                    : true;
    
                return matchesStyle && matchesColor && matchesSize;
            })
        );
    };
    
      
    const handleChangeUser = (selectedUserIds) => {
        // Lọc ra các user được chọn dựa trên IDs
        const selectedUsers = users.filter(user => selectedUserIds.includes(user.value));
    
        // Tổng hợp tất cả các cửa hàng từ các user đã chọn
        const allShops = selectedUsers.flatMap(user => user.shops);
    
        // Loại bỏ các cửa hàng trùng lặp
        const uniqueShops = Array.from(new Map(allShops.map(shop => [shop.id, shop])).values());
    
        // Chuyển đổi định dạng phù hợp cho Select
        const shopOptions = uniqueShops.map(shop => ({
            value: shop.id,
            label: `${shop.id} - ${shop.name}`
        }));
    
        // Cập nhật danh sách cửa hàng
        setShops(shopOptions);
    
        // Cập nhật giá trị của trường `shop` trong form
        form.setFieldsValue({ shop: shopOptions.map(shop => shop.value) });
    
        console.log("Updated shops:", shopOptions); // Debug để kiểm tra danh sách shops
    };
    
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const onUserInforSuccess = (userInforRes) => {
                    console.log("User Info:", userInforRes);
    
                    if (userInforRes?.role[0] === 1) {
                        // Nếu role = 1, gọi API getUserGroup
                        console.log("Role is 1, fetching user group...");
                        getUserGroup((groupRes) => {
                            if (groupRes) {
                                console.log("User Group Response:", groupRes);
    
                                const dataResConvert = groupRes.users?.map((user) => ({
                                    value: user.user_id,
                                    label: user.user_name,
                                    shops: user.shops, // Bao gồm danh sách shops của user
                                }));
                                setUsers(dataResConvert);
                                setIsUserLoaded(true); // Đánh dấu dữ liệu đã load xong
                            }
                        });
                    } else {
                        // Nếu role khác 1, gọi API getUserShops
                        console.log("Role is not 1, fetching user shops...");
                        getUserShops((shopRes) => {
                            if (shopRes) {
                                console.log("User Shops Response:", shopRes);
    
                                // Chuyển đổi dữ liệu tương tự dataResConvert
                                const shopData = [
                                    {
                                        value: userInforRes.id,
                                        label: userInforRes.username,
                                        shops: shopRes.map((shop) => ({
                                            id: shop.id,
                                            name: shop.shop_name,
                                        })), // Tạo danh sách shops theo định dạng tương tự
                                    },
                                ];
                                setUsers(shopData); // Cập nhật danh sách user
                                setShops(
                                    shopRes.map((shop) => ({
                                        value: shop.id,
                                        label: shop.shop_name,
                                    }))
                                ); // Cập nhật danh sách shop nếu cần riêng biệt
                                setIsUserLoaded(true); // Đánh dấu dữ liệu đã load xong
                            }
                        });
                    }
                };
    
                // Gọi API getUserInfor để kiểm tra role
                getUserInfor(onUserInforSuccess);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);
    
    
    
    useEffect(() => {
        if (isUserLoaded) { // Chỉ chạy khi users đã load xong
            const userSelected = users;
            // console.log("user selected", userSelected);
            const allShops = userSelected.flatMap(item => item.shops);
            const uniqueShops = Array.from(
                new Map(allShops.map(shop => [shop.id, shop])).values()
            );
    
            const shopByUser = uniqueShops?.map((shop) => ({
                value: shop.id,
                label: `${shop.id} - ${shop.name}`
            }));
    
            // console.log("shop by user", shopByUser);
            setShops(shopByUser);
            form.setFieldsValue({ shop: shopByUser });
        }
    }, [isUserLoaded, users, form]); // Chỉ chạy khi `isUserLoaded` thay đổi
    
    
    
    const handleQuery = (state) => {
        let query = ``;
    
        if (state?.limit) {
            query += `&limit=${state.limit}`;
        }
    
        if (state?.offset) {
            query += `&offset=${state.offset}`;
        }
    
        if (state?.sort) {
            query += `&sort[created_at]=${state.sort}`;
        }
    
        if (state?.shop && Array.isArray(state.shop)) {
            const shopIds = state.shop.map(shop => shop.value || shop); // Lấy giá trị nếu shop là object
            query += `&shop_id=${shopIds.join(',')}`;
        }
        if (state?.status) {
            console.log('status: ', state?.status);
            
            const statusString = state?.status.map(status => `&status_name=${status}`).join("");
            query += statusString;
        }
        if (Array.isArray(state.fulfillment_name)) {
            if (state.fulfillment_name.length === 0) {
                state.fulfillment_name = ["FlashShip","PrintCare","Ckf"]; // Gán giá trị mặc định nếu mảng rỗng
            }
            console.log("state?.fulfillment_name", state?.fulfillment_name);
            state.fulfillment_name.forEach(name => {
                query += `&fulfillment_name=${name}`;
            });
        }
    
        // // Xử lý fulfillment_name nếu có
        // if (state?.fulfillment_name && Array.isArray(state.fulfillment_name)) {
        //     state.fulfillment_name.forEach(name => {
        //         query += `&fulfillment_name=${name}`;
        //     });
        // }
    
        // Chuyển create_time_gte và create_time_lt sang Unix timestamp khi filter
        if (state?.create_time_gte) {
            const createTimeGteUnix = dayjs(state.create_time_gte).unix();  // Chuyển ngày thành Unix timestamp
            query += `&create_time[$gte]=${createTimeGteUnix}`;
        }
        if (state?.create_time_lt) {
            const createTimeLtUnix = dayjs(state.create_time_lt).unix();  // Chuyển ngày thành Unix timestamp
            query += `&create_time[$lt]=${createTimeLtUnix}`;
        }
        if (state?.product_name) {
            query += `&product_name=${state.product_name}`;
        }
    
        // Thêm tìm kiếm order_id
        if (state?.order_id) {
            query += `&order_id=${state.order_id}`;
        }
    
        // console.log('Success:', state, query);
    
        if (query) return '?' + query;
        else return '';
    };

    const handleReset = () => {
        form.setFieldsValue(defaultValues);
    };
    // console.log("package", packages);
    const handleExport = () => {
        console.log("package", packages);
        if (packages?.length) {
            // Nhóm dữ liệu theo order_id và pack_id
            const groupedData = packages.reduce((acc, item) => {
                const key = `${item.order_id}-${item.pack_id}`;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(...item.products.map(product => ({
                    ...item,
                    ...product
                })));
                return acc;
            }, {});
    
            // Tạo dữ liệu xuất ra Excel với dropdown cho order_id
            const dataExport = Object.values(groupedData).flatMap((group) => {
                return group.map((item, index) => {
                    // Giữ lại `order_id` chỉ ở dòng đầu tiên trong nhóm
                    const orderIdDropdown = index === 0 ? item.order_id : "";
                    return {
                        ...item,
                        order_id: orderIdDropdown
                    };
                });
            });
    
            // Xóa thuộc tính products không cần thiết
            dataExport.forEach(obj => {
                delete obj.products;
            });
    
            // Xuất dữ liệu ra file Excel
            const worksheet = XLSX.utils.json_to_sheet(dataExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, `Packages-${Date.now()}.xlsx`);
        } else {
            toast.info('Không có package nào!');
        }
    };

    const onFinish = (values) => {
        console.log('Received values of form:', values);
        const onSuccess = (res) => {
          if (res) {
            // Đánh dấu các packages
            const updatedPackages = markPacksWithEmptyDesigns(res);
            setPackages(updatedPackages);
          }
        };
      
        getAllPackages(handleQuery(values), onSuccess);
      };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        form.setFieldsValue(defaultValues);
    }, [defaultValues, form]);

    
    // console.log('packages: ', packages);

    // const handleDateChange = (date, dateString, fieldName, form) => {
    //     if (dayjs(date).isValid()) {
    //         const unixTimestamp = dayjs(date).unix();  // Chuyển ngày thành Unix timestamp
    //         const currentValues = form.getFieldsValue(); // Lấy tất cả giá trị hiện tại của form
    //         currentValues[fieldName] = unixTimestamp; // Cập nhật giá trị tương ứng với trường ngày tháng
    //         form.setFieldsValue(currentValues); // Cập nhật lại form với giá trị mới
    //     } else {
    //         // Nếu ngày không hợp lệ, đặt giá trị là rỗng
    //         const currentValues = form.getFieldsValue();
    //         currentValues[fieldName] = ''; // Đặt trường ngày tháng về giá trị trống
    //         form.setFieldsValue(currentValues);
    //     }
    // };

    const handlePackageSelected = (data) => {
        console.log(data);
        
        setPackageSelected(data);
    }
    // console.log("package selected", packageSelected);

    const handleNavigate = () => {
        const onSuccess = (res) => {
            if (res) {
                toast.success('Update thành công!');
                // navigate('/all-packages/status');
            }         
        }

        const onFail = (err) => {
            console.log(err);            
        }

        packageSelected?.map((item) => {
            const dataSubmit = {
                "fulfillment_name": "Teelover",
                "status":"forwarded_to_supify"
            }
            updateFulfillmentName(item.id, dataSubmit, onSuccess, onFail);
        });
    }
    // console.log("user",users)
    // console.log("shops", shops)
    useEffect(() => {
        if (users.length) {
            const defaultUserValues = users.map(user => user.value); // Lấy tất cả IDs của users
            form.setFieldsValue({ user: defaultUserValues });
        }
    }, [users, form]);
    
    // useEffect(() => {
    //     if (users.length) {
    //         const allShops = users.flatMap(user => user.shops);
    //         console.log("allshop", allShops)
    //         form.setFieldsValue({ shop: allShops });
    //     }
    // }, [shops, form]);
    const handleUpdateStatus = () => {
        const statusUpdate = form.getFieldValue('status');

        const onSuccess = (res) => {
            if (res) {
                toast.success('Update thành công!');
            }         
        }

        const onFail = (err) => {
            console.log(err);            
        }

        if (statusUpdate?.length > 1) toast.error('Bạn đang chọn nhiều trạng thái khác nhau. Vui lòng chỉ chọn 1!');
        else {
            packageSelected?.map((item) => {
                const dataSubmit = {
                    status: statusUpdate[0]
                }
                
                updatePackageStatus(item.id, dataSubmit, onSuccess, onFail);
            });
        }
    }
    const handleExportFlashShip =()=>{
        const rows = [];
    packageSelected.forEach((packageItem) => {
        const onSuccess = (res) => {
            if (res) {
                toast.success('Update thành công!');
            }         
        }

        const onFail = (err) => {
            toast.error("Update fail")         
        }
        const dataSubmit = {
            status: 'fullfilled'
        }
        
        updatePackageStatus(packageItem.id, dataSubmit, onSuccess, onFail);
    packageItem.products.forEach((product) => {
        rows.push({
        'External ID': 'POD196',
        'Order ID': packageItem.order_id,
        'Shipping method': packageItem.shipment,
        'First Name': packageItem.buyer_first_name,
        'Last Name': packageItem.buyer_last_name,
        Email: packageItem.buyer_email,
        Phone: packageItem.buyer_phone,
        Country: packageItem.buyer_country_code,
        Region: packageItem.buyer_province_code,
        'Address line 1': packageItem.buyer_address1,
        'Address line 2': packageItem.buyer_address2,
        City: packageItem.buyer_city,
        Zip: packageItem.buyer_zip,
        Quantity: product.quantity,
        'Variant ID': product.sku_custom,
        'Print area front': product.printer_design_front_url || '',
        'Print area back': product.printer_design_back_url || '',
        'Mockup Front': product.mock_up_front_url || '',
        'Mockup Back': product.mock_up_back_url || '',
        'Product note': product.note || '',
        'Link label': packageItem.linkLabel,
        });
    });
    });

    // Xuất ra Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Lưu file Excel
    XLSX.writeFile(workbook, "orderflashship.xlsx");
    toast.success('export thành công!');
    // console.log("Export completed!");
    }
    const handleExportPrincare =()=>{
        const rows = [];
    packageSelected.forEach((packageItem) => {
        const onSuccess = (res) => {
            if (res) {
                toast.success('Update thành công!');
            }         
        }

        const onFail = (err) => {
            toast.error("Update fail")         
        }
        const dataSubmit = {
            status: 'fullfilled'
        }
        
        updatePackageStatus(packageItem.id, dataSubmit, onSuccess, onFail);
    packageItem.products.forEach((product) => {
        rows.push({
        'External ID': 'POD196',
        'Order ID': packageItem.order_id,
        'Shipping method': packageItem.shipment,
        'First Name': packageItem.buyer_first_name,
        'Last Name': packageItem.buyer_last_name,
        Email: packageItem.buyer_email,
        Phone: packageItem.buyer_phone,
        Country: packageItem.buyer_country_code,
        Region: packageItem.buyer_province_code,
        'Address line 1': packageItem.buyer_address1,
        'Address line 2': packageItem.buyer_address2,
        City: packageItem.buyer_city,
        Zip: packageItem.buyer_zip,
        Quantity: product.quantity,
        'Variant ID': product.variant_id,
        'Print area front': product.printer_design_front_url || '',
        'Print area back': product.printer_design_back_url || '',
        'Mockup Front': product.mock_up_front_url || '',
        'Mockup Back': product.mock_up_back_url || '',
        'Product note': product.note || '',
        'Link label': packageItem.linkLabel,
        'Tracking ID':packageItem.tracking_id
        });
    });
    });

    // Xuất ra Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Lưu file Excel
    XLSX.writeFile(workbook, "orderPrincare.xlsx");
    toast.success('Export completed!');
    
    }
    const handleExportCkf =()=>{
        const rows = [];
        const today = new Date();
        packageSelected.forEach((packageItem) => {
            const onSuccess = (res) => {
                if (res) {
                    toast.success('Update thành công!');
                }         
            }
    
            const onFail = (err) => {
                toast.error("Update fail")         
            }
            const dataSubmit = {
                status: 'fullfilled'
            }
            
            updatePackageStatus(packageItem.id, dataSubmit, onSuccess, onFail);
        packageItem.products.forEach((product) => {
            rows.push({
               
                    'Process day':`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
                    'Sent out day':'',
                    'Order ID':packageItem.order_id,
                    'Label Tiktok':packageItem.linkLabel,
                    'Tracking':packageItem.tracking_id,
                    'tracking status':'',
                    '店铺编号':'',
                    'Customer Note':product.note || " ",
                    'Phone (Billing)':'',
                    'Name (Shipping)':packageItem.buyer_first_name +" "+ packageItem.buyer_last_name,
                    'Address 1&2 (Shipping)':packageItem.buyer_address1 || packageItem.buyer_address2,
                    'City (Shipping)':packageItem.buyer_city,
                    'State Code (Shipping)':packageItem.buyer_province_code,
                    'Postcode Code (Shipping)':packageItem.buyer_zip,
                    'Country Code (Shipping)':"US",
                    'SKU BASIC':product.sku_custom,
                    'SKU Custom':product.seller_sku || '',
                    'Item Name': product.product_name,
                    'Type':product.product_type,
                    "Size":product.size,
                    "Color":product.color,
                    "Quantity":product.quantity,
                    'Design Front': product?.image_design_front || '',
                    'Design Back': product?.image_design_back || '',
                    'Mockup link':product?.mockup_front || '',
            });
        });
        });
    
        // Xuất ra Excel
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    
        // Lưu file Excel
        XLSX.writeFile(workbook, "orderCkf.xlsx");
    
        console.log("Export completed!");
    }
    const onSaveSuccess = (values) => {
        const formValues = form.getFieldsValue(values); // Lấy giá trị hiện tại của form
        console.log("value received", formValues);
        const onSuccess = (res) => {
            if (res) {
                const updatedPackages = markPacksWithEmptyDesigns(res); // Đánh dấu các packages
                const filteredPackages = filterPackages(updatedPackages, formValues); // Áp dụng filter
                setPackages(filteredPackages); // Cập nhật lại danh sách packages
            }
        };
        const query = handleQuery(formValues); // Tạo query từ giá trị form
        getAllPackages(query, onSuccess); // Lấy dữ liệu mới từ API
    };
    useEffect(() => {
       
            const userSelected = users;
            const allShops = userSelected.flatMap(item => item.shops);
            const uniqueShops = Array.from(new Map(allShops.map(shop => [shop.id, shop])).values());
    
            const shopByUser = uniqueShops.map(shop => ({
                value: shop.id,
                label: `${shop.id} - ${shop.name}`
            }));
    
            setShops(shopByUser);
            form.setFieldsValue({ shop: shopByUser.map(shop => shop.value) }); // Đồng bộ giá trị shop trong form
        
    }, [isUserLoaded, users, form]);
    
    return (
        <div className="p-10">
            <div className="mb-10">
                <h2 className="mb-5">Chức năng</h2>

                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <div className="flex flex-wrap items-center gap-5">
                        <Form.Item
                            label="Người dùng"
                            name="user"
                            className="w-full md:flex-1"
                        >
                            <Select
                                mode="multiple"
                                onChange={handleChangeUser}
                                options={users}
                            />
                        </Form.Item>

                        <Form.Item label="Cửa hàng" name="shop" className="w-full md:flex-1">
                        <Select
                            mode="multiple"
                            options={shops}
                            maxTagCount="responsive"
                            onChange={(value) => {
                                form.setFieldsValue({ shop: value }); // Cập nhật giá trị form
                                console.log("Selected shops:", value); // Debug xem giá trị có thay đổi không
                            }}
                        />
                    </Form.Item>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-5">
                                            <Form.Item label="Product Name" name="product_name" className="w-full md:flex-1">
                                                <Input placeholder="Enter product name to search" />
                                            </Form.Item>
                                            <Form.Item label="Order ID" name="order_id" className="w-full md:flex-1">
                                                <Input placeholder="Enter order ID to search" />
                                            </Form.Item>
                                        </div>
                                        {/* <div className="flex flex-wrap items-center gap-5">
                                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                                Search
                                            </Button>
                                            <Button type="link" >
                                                Reset
                                            </Button>
                                        </div> */}

                    <div className="flex flex-wrap items-center gap-5">
                        <Form.Item
                            label="Limit"
                            name="limit"
                            className="w-full md:flex-1"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Offset"
                            name="offset"
                            className="w-full md:flex-1"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Thời gian tạo:" name="sort" className="w-full md:flex-1">
                            <Radio.Group block options={optionSort} />
                        </Form.Item>

                        <Form.Item
                            label="Tên đơn vị vận chuyển"
                            name="fulfillment_name"
                            className="w-full md:flex-1"
                        >
                            <Select
                                mode="multiple"
                                initialValue={['FlashShip', 'PrinCare', 'Ckf']} // Giá trị mặc định
                                options={[
                                    { value: 'FlashShip', label: 'FlashShip' },
                                    { value: 'PrintCare', label: 'PrintCare' },
                                    { value: 'Ckf', label: 'Ckf' },
                                    { value: 'Platform', label: 'Platform' },
                                    { value: 'Teelover', label: 'Teelover' },
                                ]}
                            />
                        </Form.Item>

                        <div className="flex flex-wrap items-center gap-5">
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            className="w-full md:flex-1"
                        >
                            <Select
                                mode="multiple"
                                onChange={handleChangeUser}
                                options={status}
                            />
                        </Form.Item>

                        <Form.Item label="Thời gian tạo:" name="sort" className="w-full md:flex-1">
                            <Radio.Group block options={optionSort} />
                        </Form.Item>

                        <Form.Item
                            label="Create Time (Unix) - Thời gian bắt đầu"
                            name="create_time_gte"
                            className="w-full md:flex-1"
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                // onChange={(date, dateString) => handleDateChange(date, dateString, 'create_time_gte', form)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Create Time (Unix) - Thời gian kết thúc"
                            name="create_time_lt"
                            className="w-full md:flex-1"
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                // onChange={(date, dateString) => handleDateChange(date, dateString, 'create_time_lt', form)}
                            />
                        </Form.Item>
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                    {/* Các Form.Item khác */}
                    
                </Form>
                    </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <Button type="primary" disabled={!packageSelected?.length} onClick={handleNavigate}>Chuyển qua xưởng Teelover</Button>
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExport} disabled={!packages?.length}>
                            Export
                        </Button>
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExportFlashShip} disabled={!packageSelected?.length}>
                            Export FlashShip
                        </Button>
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExportPrincare} disabled={!packageSelected?.length}>
                            Export Printcare
                        </Button>
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExportCkf} disabled={!packageSelected?.length}>
                            Export Ckf
                        </Button>
                        <Form.Item label={null} className="!mb-0">
                            <Button type="primary" htmlType="submit" icon={<ReloadOutlined />}>
                                Làm mới 
                            </Button>
                        </Form.Item>
                        <Button type="primary" disabled={!packageSelected?.length} onClick={handleUpdateStatus}>
                            <Tooltip title="Cập nhật theo trạng thái đã chọn ở trên">
                                Update status
                            </Tooltip>
                        </Button>
                        <Button type="link" onClick={handleReset}>
                            Mặc định
                        </Button>
                    </div>
                </Form>
                <Form layout="vertical" form={form} onFinish={() => onSaveSuccess(form.getFieldsValue())}>
    <div className="flex flex-wrap items-center gap-5">
        <Form.Item label="Style" name="filterStyle" className="w-full md:flex-1">
            <Input placeholder="Enter style to filter" />
        </Form.Item>
        <Form.Item label="Color" name="filterColor" className="w-full md:flex-1">
            <Input placeholder="Enter color to filter" />
        </Form.Item>
        <Form.Item label="Size" name="filterSize" className="w-full md:flex-1">
            <Input placeholder="Enter size to filter" />
        </Form.Item>
    </div>
    <Button type="primary" htmlType="submit">
        Apply Filters
    </Button>
</Form>


            </div>

            <AllPackagesTable onSaveSuccesss={onSaveSuccess} data={packages} loading={loadingAllPackages} packageSelected={handlePackageSelected} onSaveSuccess={onFinish} packageStatus={form.getFieldValue('status')}/>
        </div>
    );
};

export default AllPackages;
