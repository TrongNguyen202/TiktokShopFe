import React, { useEffect, useState } from "react";
import { Button, Radio, Form, Input, Select } from 'antd';
import { ReloadOutlined, CloudDownloadOutlined } from "@ant-design/icons";
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

const defaultValues = {
    sort: optionSort[0].value,
    user: [],
    shop: [],
    fulfillment_name: [],
    create_time_gte: '',
    create_time_lt: '',
    limit: 10,
    offset: 0,
};

const AllPackages = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [shops, setShops] = useState([]);
    const [packageSelected, setPackageSelected] = useState([]);
    const [packages, setPackages] = useState([]);
    const { getUserGroup, getAllPackages, loadingAllPackages, updateFulfillmentName } = useOrdersStore();

    const handleChangeUser = (values) => {
        const idsSet = new Set(values);
        const userSelected = users.filter(user => idsSet.has(user.value));
        const allShops = userSelected.flatMap(item => item.shops);
        const uniqueShops = Array.from(
            new Map(allShops.map(shop => [shop.id, shop])).values()
        );
        
        const shopByUser = uniqueShops?.map((shop) => ({
            value: shop.id,
            label: `${shop.id} - ${shop.name}`
        }));
        setShops(shopByUser);
    };
    
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
            const shopIds = state.shop.join(',');
            query += `&shop_id=${shopIds}`;
        }
    
        // Xử lý fulfillment_name nếu có
        if (state?.fulfillment_name && Array.isArray(state.fulfillment_name)) {
            state.fulfillment_name.forEach(name => {
                query += `&fulfillment_name=${name}`;
            });
        }
    
        // Chuyển create_time_gte và create_time_lt sang Unix timestamp khi filter
        if (state?.create_time_gte) {
            const createTimeGteUnix = dayjs(state.create_time_gte).unix();  // Chuyển ngày thành Unix timestamp
            query += `&create_time[$gte]=${createTimeGteUnix}`;
        }
        if (state?.create_time_lt) {
            const createTimeLtUnix = dayjs(state.create_time_lt).unix();  // Chuyển ngày thành Unix timestamp
            query += `&create_time[$lt]=${createTimeLtUnix}`;
        }
    
        console.log('Success:', state, query);
    
        if (query) return '?' + query;
        else return '';
    };

    const handleReset = () => {
        form.setFieldsValue(defaultValues);
    };

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
        const onSuccess = (res) => {
            if (res) setPackages(res);
        };
        getAllPackages(handleQuery(values), onSuccess);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        form.setFieldsValue(defaultValues);
    }, [defaultValues, form]);

    useEffect(() => {
        const onSuccess = (res) => {
            if (res) {
                const dataResConvert = res.users?.map((user) => ({
                    value: user.user_id,
                    label: user.user_name,
                    shops: user.shops
                }));
                
                setUsers(dataResConvert);
            }
        };
        getUserGroup(onSuccess);
    }, []);

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

    const handleNavigate = () => {
        const onSuccess = (res) => {
            if (res) {
                toast.success('Update thành công!');
                navigate('/all-packages/status');
            }         
        }

        const onFail = (err) => {
            console.log(err);            
        }

        packageSelected?.map((item) => {
            const dataSubmit = {
                "fulfillment_name": "Teelover"
            }
            updateFulfillmentName(item.id, dataSubmit, onSuccess, onFail);
        });
    }

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

                        <Form.Item
                            label="Cửa hàng"
                            name="shop"
                            className="w-full md:flex-1"
                        >
                            <Select
                                mode="multiple"
                                options={shops}
                            />
                        </Form.Item>
                    </div>

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
                                options={[
                                    { value: 'Flashship', label: 'Flashship' },
                                    { value: 'Princare', label: 'Princare' },
                                    { value: 'Ckf', label: 'Ckf' },
                                    { value: 'Platform', label: 'Platform' },
                                    { value: 'TeeClub', label: 'TeeClub' },
                                ]}
                            />
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
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <Button type="primary" disabled={!packageSelected?.length} onClick={handleNavigate}>Chuyển qua xưởng Teelover</Button>
                        <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExport} disabled={!packages?.length}>
                            Export
                        </Button>

                        <Form.Item label={null} className="!mb-0">
                            <Button type="primary" htmlType="submit" icon={<ReloadOutlined />}>
                                Làm mới 
                            </Button>
                        </Form.Item>

                        <Button type="link" onClick={handleReset}>
                            Mặc định
                        </Button>
                    </div>
                </Form>

            </div>

            <AllPackagesTable data={packages} loading={loadingAllPackages} packageSelected={handlePackageSelected} onSaveSuccess={onFinish} />
        </div>
    );
};

export default AllPackages;
