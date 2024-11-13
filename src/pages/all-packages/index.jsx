import React, { useEffect, useState } from "react";
import { Button, Radio, Form, Input, Select  } from 'antd';
import { ReloadOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';

import { useOrdersStore } from "../../store/ordersStore";
import AllPackagesTable from "../../components/all-packages/AllPackagesTable";

const optionSort = [
    { value: 'desc', label: 'Mới nhất'},
    { value: 'asc', label: 'Cũ nhất'},
];

const defaultValues = {
    sort: optionSort[0].value,
    user: '',
    shop: '',
    limit: 10,
    offset: 0,
};

const AllPackages = () => {
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [shops, setShops] = useState([]);
    const [packages, setPackages] = useState([]);
    const { getUserGroup, getAllPackages, loadingAllPackages } = useOrdersStore();

    const handleChangeUser = (value) => {
        const userSelected = users.find(user => user.value === value);
        console.log('userSelected: ', userSelected);
        const shopByUser = userSelected.shops?.map((shop) => ({
            value: shop.id,
            label: shop.name
        }))
        setShops(shopByUser);
    }

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

        if (state?.shop) {
            query += `&shop_id=${state.shop}`;
        }

        console.log('Success:', state, query);

        if (query) return '?'+ query;
        else return '';
    }

    const handleReset = () => {
        form.setFieldsValue(defaultValues);
    }

    const handleExport = () => {        
        if (packages?.length) {
            const dataExport = packages?.flatMap((item) => {
                const result = item?.products?.map((product) => ({
                    ...item,
                    ...product
                }));

            return result;
            });
            
            dataExport.forEach(obj => {
                delete obj.products;
            });

            const worksheet = XLSX.utils.json_to_sheet(dataExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, `Packages-${Date.now()}.xlsx`);
        } else {
            toast.info('Không có package nào!');
        }
    }

    const onFinish = (values) => {
        const onSuccess = (res) => {
            if (res) setPackages(res);
        }
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
        }
        getUserGroup(onSuccess);
    }, []);

    console.log('packages: ', packages);
    

    return (
        <div className="p-10">
            <div  className="mb-10">
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
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
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

            <AllPackagesTable data={packages} loading={loadingAllPackages} />
        </div>
    )
};

export default AllPackages;
