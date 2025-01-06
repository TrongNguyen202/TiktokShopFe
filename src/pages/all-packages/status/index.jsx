import React, { useEffect, useState } from "react";
import { Button, Radio, Form, Input, Select, Tooltip } from 'antd';
import { ReloadOutlined, CloudDownloadOutlined, CopyOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useOrdersStore } from "../../../store/ordersStore";
import PackagesStatusTable from "../../../components/all-packages/PackagesStatusTable";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun } from "docx";
import { saveAs } from "file-saver";
const optionSort = [
    { value: 'desc', label: 'Mới nhất'},
    { value: 'asc', label: 'Cũ nhất'},
];

const status = [
    { value: 'init', label: 'init' },
    { value: 'no_design', label: 'No design' },
    { value: 'has_design', label: 'Has design' },
    { value: 'print_pending', label: 'Print pending' },
    { value: 'printed', label: 'Printed' },
    { value: 'in_production', label: 'In production' },
    { value: 'production_done', label: 'Production done' },
    { value: 'shipping_to_us', label: 'Shipping to US' },
    { value: 'shipped_to_us', label: 'Shipped to US' },
    { value: 'shipping_within_us', label: 'Shipping within US' },
    { value: 'delivered_to_customer', label: 'Delivered to customer' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'can_not_produce', label: 'Cannot produce' },
    { value: 'lack_of_pet', label: 'Lack of pet' },
    { value: 'wrong_design', label: 'Wrong design' },
    { value: 'wrong_mockkup', label: 'Wrong mockup' },
    { value: 'forwarded_to_supify', label: 'Forwarded to Supify' },
    { value: 'sent_to_onos', label: 'Sent to Onos' },
    { value: 'fullfilled', label: 'Fulfilled' },
    { value: 'reforwarded_to_hall', label: 'Reforwarded to hall' }
];


const defaultValues = {
    sort: optionSort[0].value,
    user: [],
    shop: [],
    fulfillment_name: [],
    create_time_gte: '',
    create_time_lt: '',
    supify_create_time_gte:'',
    supify_create_time_lt:'',
    limit: 1000,
    offset: 0,
    status: [status[0].value]
};

const PackagesStatus = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [shops, setShops] = useState([]);
    const [packageSelected, setPackageSelected] = useState([]);
    const [packages, setPackages] = useState([]);
    const { getUserGroup, getAllPackages, loadingAllPackages, updatePackageStatus } = useOrdersStore();

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
    
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    useEffect(() => {
        const onSuccess = (res) => {
            if (res) {
                const dataResConvert = res.users?.map((user) => ({
                    value: user.user_id,
                    label: user.user_name,
                    shops: user.shops
                }));
                setUsers(dataResConvert);
                setIsUserLoaded(true); // Đánh dấu dữ liệu đã load xong
            }
        };
        getUserGroup(onSuccess);
    }, []);
    
    useEffect(() => {
        if (isUserLoaded) { // Chỉ chạy khi users đã load xong
            const userSelected = users;
            console.log("user selected", userSelected);
            const allShops = userSelected.flatMap(item => item.shops);
            const uniqueShops = Array.from(
                new Map(allShops.map(shop => [shop.id, shop])).values()
            );
    
            const shopByUser = uniqueShops?.map((shop) => ({
                value: shop.id,
                label: `${shop.id} - ${shop.name}`
            }));
    
            console.log("shop by user", shopByUser);
            setShops(shopByUser);
            form.setFieldsValue({ shop: shopByUser });
        }
    }, [isUserLoaded, users, form]); // Chỉ chạy khi `isUserLoaded` thay đổi
    useEffect(() => {
        if (users.length) {
            const defaultUserValues = users.map(user => user.value); // Lấy tất cả IDs của users
            form.setFieldsValue({ user: defaultUserValues });
        }
    }, [users, form]);
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
            // console.log("state shop", state.shop)
            const shopIds = state.shop.map((item)=>{
                return item.value
            })
            query += `&shop_id=${shopIds}`;
        }

        if (state?.status) {
            console.log('status: ', state?.status);
            
            const statusString = state?.status.map(status => `&status_name=${status}`).join("");
            query += statusString;
        }
    
        // Xử lý fulfillment_name nếu có
        if (Array.isArray(state.fulfillment_name)) {
            if (state.fulfillment_name.length === 0) {
                state.fulfillment_name = ["Teelover"]; // Gán giá trị mặc định nếu mảng rỗng
            }
            console.log("state?.fulfillment_name", state?.fulfillment_name);
            state.fulfillment_name.forEach(name => {
                query += `&fulfillment_name=${name}`;
            });
        }
        
        if (state?.supify_create_time_gte){
            const supifycreateTimeGteUnix = dayjs(state.supify_create_time_gte).unix()
            query += `&supify_create_time[$gte]=${supifycreateTimeGteUnix}`;
        }
        if (state?.supify_create_time_lte){
            const supifycreateTimeLteUnix = dayjs(state.supify_create_time_lte).unix()
            query += `&supify_create_time[$lte]=${supifycreateTimeLteUnix}`; 
        }
        // Chuyển create_time_gte và create_time_lt sang Unix timestamp khi filter
        // if (state?.create_time_gte) {
        //     const createTimeGteUnix = dayjs(state.create_time_gte).unix();  // Chuyển ngày thành Unix timestamp
        //     query += `&create_time[$gte]=${createTimeGteUnix}`;
        // }
        // if (state?.create_time_lt) {
        //     const createTimeLtUnix = dayjs(state.create_time_lt).unix();  // Chuyển ngày thành Unix timestamp
        //     query += `&create_time[$lt]=${createTimeLtUnix}`;
        // }
        if (state?.product_name) {
            query += `&product_name=${state.product_name}`;
        }
    
        // Thêm tìm kiếm order_id
        if (state?.order_id) {
            query += `&order_id=${state.order_id}`;
        }
        console.log('Success:', state, query);
    
        if (query) return '?' + query;
        else return '';
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
    
    const handlePackageSelected = (data) => {
        console.log(data);
        
        setPackageSelected(data);
    }

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
    const onSaveSuccess = () => {
        const values = form.getFieldsValue(); // Lấy giá trị hiện tại của form
        const query = handleQuery(values); // Tạo query từ giá trị form
    
        const onSuccess = (res) => {
            if (res) {
                const updatedPackages = markPacksWithEmptyDesigns(res); // Đánh dấu các packages
    
                // Áp dụng filter
                const filteredPackages = filterPackages(updatedPackages, values);
    
                setPackages(filteredPackages); // Cập nhật lại danh sách packages
            }
        };
    
        getAllPackages(query, onSuccess); // Lấy dữ liệu mới từ API
    };
    const handleCopyAllLinkLabels = (packages) => {
        // Lấy tất cả linkLabel từ danh sách packages
        const linkLabels = packages.map(pkg => pkg.linkLabel).filter(Boolean); // Loại bỏ giá trị null/undefined
    
        if (linkLabels.length > 0) {
            // Kết hợp các linkLabel thành chuỗi, mỗi link trên một dòng
            const textToCopy = linkLabels.join('\n');
    
            // Sao chép chuỗi vào clipboard
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    toast.success('All link labels copied to clipboard!');
                })
                .catch(() => {
                    toast.error('Failed to copy link labels.');
                });
        } else {
            toast.info('No link labels available to copy.');
        }
    };
    
    const handleExportToWord = async (selectedPackages) => {
        const blobToBase64 = (blob) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        };
    
        const base64ToUint8Array = (base64) => {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        };
    
        for (const pkg of selectedPackages) {
            const sections = [];
    
            for (const [index, product] of pkg.products.entries()) {
                console.log("dax vao")
                console.log("Sssca",pkg.products.length)
                const rows = [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Ngày", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: `${new Date().toLocaleDateString()}` })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "STT", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: `${product.stt}` })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Số Lượng Áo", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: `${index + 1}/${pkg.products.length}` })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Mã Tracking", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: `${pkg.tracking_id || "N/A"}` })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Loại Áo", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: `${product.style || "N/A"}` })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Màu", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: `${product.color || "N/A"}` })] }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Size", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: `${product.size || "N/A"}` })] }),
                        ],
                    }),
                ];
    
                const table = new Table({
                    rows: rows,
                    width: {
                        size: 10000, // Đặt độ rộng của bảng
                        type: "pct", // Loại là phần trăm
                    },
                });
    
                const mockupParagraphs = [];
    
                const children = [
                    new TextRun({ text: `Mockup for Product`, bold: true }),
                    new TextRun("\n"),
                ];
    
                if (product.mock_up_front_url) {
                    try {
                        console.log(`Fetching mockup for Product:`, product.mock_up_front_url);
                        const imageBlob = await fetch(product.mock_up_front_url, { cache: "reload" }).then((res) => res.blob());
                        const base64Image = await blobToBase64(imageBlob);
                        const uint8Array = base64ToUint8Array(base64Image.split(",")[1]);
                        children.push(
                            new ImageRun({
                                data: uint8Array,
                                transformation: { width: 600, height: 600 },
                            })
                        );
                    } catch (error) {
                        console.error(`Error fetching image for Product`, error);
                        children.push(new TextRun({ text: "Error loading image" }));
                    }
                } else {
                    children.push(new TextRun({ text: "No Mockup Available" }));
                }
    
                mockupParagraphs.push(new Paragraph({ children }));
    
                sections.push({
                    children: [
                        new Paragraph({
                            text: `Package ID: ${pkg.pack_id}`,
                            bold: true,
                            alignment: "left",
                        }),
                        table,
                        new Paragraph("\n"), // Dòng trống
                        ...mockupParagraphs,
                    ],
                });
            }
    
            const doc = new Document({
                sections: sections.map((section) => ({ children: section.children })),
            });
    
            const fileName = `Package_${pkg.pack_id}_${Date.now()}.docx`;
            const blob = await Packer.toBlob(doc);
            saveAs(blob, fileName);
        }
    };
    
    
    
    
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
                                maxTagCount="responsive" // Tự động ẩn các thẻ khi có quá nhiều
                                maxTagPlaceholder={(omittedValues) => (
                                    <Tooltip
                                        overlayStyle={{ pointerEvents: 'none' }}
                                        title={omittedValues.map(({ label }) => label).join(', ')}
                                    >
                                        <span>...</span>
                                    </Tooltip>
        )}
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

                        <Form.Item
                            label="Tên đơn vị vận chuyển"
                            name="fulfillment_name"
                            className="w-full md:flex-1"
                            initialValue={["Teelover"]} // Đặt giá trị mặc định là mảng
                        >
                            <Input value="Teelover" readOnly /> {/* Chỉ hiển thị giá trị TeeClub */}
                        </Form.Item>
                    </div>

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
                            name="supify_create_time_gte"
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
                            name="supify_create_time_lt"
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
                        <Button type="primary" disabled={!packageSelected?.length} icon={<CloudDownloadOutlined/>} onClick={handleExport}>Export</Button>
                        <Button
                        type="primary"
                        icon={<CloudDownloadOutlined />}
                        disabled={!packageSelected.length}
                        onClick={() => handleExportToWord(packageSelected)}
                    >
                        Export to Word
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
{/* 
                        <Button type="link" onClick={handleReset}>
                            Mặc định
                        </Button> */}

                    </div>
                </Form>
                <Form layout="vertical" form={form} onFinish={onSaveSuccess}>
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
            <div className="flex flex-wrap items-center gap-5 ">
            <Button type="primary" htmlType="submit">
                Apply Filters
            </Button>
                   
            <Button
            type="primary"
            icon={<CopyOutlined />}
            disabled={!packages?.length}
            onClick={() => handleCopyAllLinkLabels(packages)}
        >
            Copy All Link Labels
        </Button>
            </div>

        </Form>

            </div>

            <PackagesStatusTable
                onSaveSuccesss={onSaveSuccess} 
                data={packages} 
                loading={loadingAllPackages} 
                packageSelected={handlePackageSelected} 
                onSaveSuccess={onFinish}
                packageStatus={form.getFieldValue('status')}
            />
        </div>
    );
};

export default PackagesStatus;