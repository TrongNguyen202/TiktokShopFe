import { useEffect, useState } from 'react';
import { Divider, Table, Space, Button, Popover, Image, Modal, Form, Input, message } from 'antd';
import { DownOutlined } from "@ant-design/icons"
import * as XLSX from 'xlsx';

import { useShopsOrder } from '../../store/ordersStore'
import { useFlashShipStores } from '../../store/flashshipStores'
import { getPathByIndex } from "../../utils";
import { setToken } from "../../utils/auth"

import SectionTitle from "../common/SectionTitle";
4                                             
const OrderForPartner = ({toShipInfoData}) => {
    const shopId = getPathByIndex(2)
    const [designSku, setDesignSku] = useState([])
    const [ dataOCRCheck, setDataOCRCheck ] = useState([])
    const [ flashShipTable, setFlashShipTable ] = useState([])
    const [ printCareTable, setPrintCareTable ] = useState([])
    const [ flashShipVariants, setFlashShipVariants ] = useState([])
    const [ messageApi, contextHolder ] = message.useMessage();
    const [ openLoginFlashShip, setOpenLoginFlashShip ] = useState(false)
    const { getToShipInfo, loadingGetInfo, getDesignSku } = useShopsOrder(state => state)
    const { getFlashShipPODVariant, LoginFlashShip, createOrderFlashShip } = useFlashShipStores(state => state)

    const checkDataPartner = (data) => {
        const orderPartnerResult = data?.map((dataItem, index) => {
            const orderPartner = {...dataItem}
            const itemList = dataItem?.order_list?.flatMap(item => item.item_list)
            const variations = itemList.map((variation, itemListIndex) => {
                let variationObject = {}
                let result = {...variation}
                const variationSplit = variation?.sku_name?.split(', ')

                if (variationSplit.length === 3) {
                    variationObject = {
                        color: variationSplit[0],
                        size: variationSplit[1] - variationSplit[2]
                    }      
                } else {
                    variationObject = {
                        color: variationSplit[0],
                        size: variationSplit[1]
                    }
                }
                
                const checkProductType = flashShipVariants && flashShipVariants?.filter(variant => variationObject?.size.toUpperCase().includes(variant.product_type.toUpperCase()))
                
                if (checkProductType.length) {
                    const checkColor = checkProductType.filter(color => color.color.toUpperCase() === variationObject?.color.toUpperCase())
                    if (checkColor) {
                        const checkSize = checkColor.find(size => variationObject?.size.toUpperCase().includes(size.size.toUpperCase()))
                        if (checkSize) {
                            result.variant_id = checkSize.variant_id
                            orderPartner.is_FlashShip = true
                        }
                    }
                }
                
                return result
            })
            
            orderPartner.buyer_email = dataItem.order_list[0].buyer_email
            orderPartner.order_list = variations
            return orderPartner
        })

        const dataFlashShip = orderPartnerResult?.filter(item => item.is_FlashShip)
        const dataPrintCare = orderPartnerResult?.filter(item => !item.is_FlashShip)
        if (dataFlashShip.length) setFlashShipTable(dataFlashShip)
        if (dataPrintCare.length) setPrintCareTable(dataPrintCare)
    }

    const renderListItemProduct = (data) => {
        return data?.map((item, index) => (
            <div key={index}>
                <div className="flex justify-between items-center gap-3 mt-3 w-[400px]">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <Image src={item.sku_image} className="object-cover mt-1 flex-1" width={50} height={50}  />
                        </div>
                        <div>
                            <p className="text-[12px] text-gray-500">{item.sku_name}</p>
                            <p className="text-[12px] text-gray-500">{item.sku_id}</p>
                        </div>
                    </div>
                    <p className="font-semibold">x{item.quantity}</p>
                </div>
            </div>
        ));
    }

    const handleLoginFlashShip = (values) => {
        const onSuccess = (res) => {
            if (res) {
                setToken('flash-ship-tk', res.data.access_token)
                setOpenLoginFlashShip(false)
                const handAddDesignToShipInfoData = flashShipTable.map(item => {
                    const orderItem = item.order_list.map(order => {
                        const design = designSku?.results?.find(skuItem => skuItem.sku_id === order.sku_id)
                        if (design) {
                            order.image_design_front = design.image_front
                            order.image_design_back = design.image_back
                        }
                        return order
                    })
            
                    const flashShipItem = {
                        ...item,
                        order_list: orderItem
            
                    }
                    return flashShipItem
                })
                
                const dataSubmitFlashShip = handAddDesignToShipInfoData.map(item => (
                    {
                        order_id: item.package_id,
                        buyer_first_name: item.name_buyer?.split(' ')[0] || "",
                        buyer_last_name: item.name_buyer?.split(' ')[1] || "",
                        buyer_email: item.buyer_email,
                        buyer_phone: "",
                        buyer_address1: item.street,
                        buyer_address2: "",
                        buyer_city: item.city,
                        buyer_province_code: item.state,
                        buyer_zip: item.zip_code,
                        buyer_country_code: "US",
                        shipment: 1,
                        products: item.order_list.map(product => ({
                            variant_id: product.variant_id,
                            printer_design_front_url: item.image_design_front || null,
                            printer_design_back_url: item.image_design_back || null,
                            quantity: product.quantity,
                            note: ""
                        }))
                    }
                ))
                console.log('dataSubmitFlashShip: ', dataSubmitFlashShip);
                
                dataSubmitFlashShip.map(item => {
                    const onCreateSuccess = (resCreate) => {
                        console.log(resCreate)
                    }
            
                    const onCreateFail = (errCreate) => {
                        messageApi.open({
                            type: 'error',
                            content: errCreate
                        });
                    }
            
                    createOrderFlashShip(item, onCreateSuccess, onCreateFail)
                })
        
            }
        }

        const onFail = (err) => {
            messageApi.open({
                type: 'error',
                content: 'Đăng nhập thất bại. Vui lòng thử lại'
            })
        }

        LoginFlashShip(values, onSuccess, onFail)
    }

    console.log('flashShipTable: ', flashShipTable)

    const handleExportExcelFile = (data) => {
        console.log('data: ', data)
        // const worksheet = XLSX.utils.json_to_sheet(data)
        // const ws = XLSX.utils.json_to_sheet(data);
        // const wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        // XLSX.writeFile(wb, "productList.xlsx");
        // console.log('worksheet: ', worksheet)
    }
    
    const column = [
        {
            title: 'Package ID',
            dataIndex: 'package_id',
            key: 'package_id'
        },
        {
            title: 'Product items',
            dataIndex: 'product_items',
            key: 'product_items',
            render: (_, record) => {
                // console.log('record: ', record);
                return (
                    <Popover 
                        content={renderListItemProduct(record?.order_list)}
                        trigger="click"
                        placement="bottom"
                        title={`Current package: ${record?.order_list?.length} items`}
                    >
                        <div className='cursor-pointer hover:bg-gray-200 p-2 flex flex-wrap items-center'>
                            <div className='flex-1'>
                                <p>{record?.order_list?.length} items</p>
                                <ul className='text-ellipsis whitespace-nowrap overflow-hidden w-[180px]'>
                                    {record?.order_list?.map(item => (
                                        <li key={item.sku_id} className='inline-block mr-3 w-10 h-10 [&:nth-child(3+n)]:hidden'>
                                            <img className="w-full h-full object-cover" width={30} height={30} src={item.sku_image} />
                                        </li>
                                    ))} 
                                </ul>
                            </div>
                            <DownOutlined />
                        </div>
                    </Popover>
                )
            }
        },
        {
            title: 'Tracking ID',
            dataIndex: 'tracking_id',
            key: 'tracking_id'
        },
        {
            title: 'Name buyer',
            dataIndex: 'name_buyer',
            key: 'name_buyer'
        },
        {
            title: 'Shipping information',
            dataIndex: 'shipping_info',
            key: 'shipping_info',
            render: (_, record) => {
                <ul>
                    <li><span>State: </span>{record.state}</li>
                    <li><span>Street: </span>{record.street}</li>
                    <li><span>zip code: </span>{record.zip_code}</li>
                </ul>
            }
        }
    ]

    useEffect(() => {
        const data = {
            order_documents: toShipInfoData
        }

        const onSuccess = (res) => {
            if (res) {
                const dataCheck = res.map(item => (
                    {
                        order_list: item.data.order_list,
                        package_id: item.data.order_list[0].package_list[0].package_id,
                        state: item.state,
                        street: item.street,
                        city: item.city,
                        tracking_id: item.tracking_id,
                        zip_code: item.zip_code,
                        name_buyer: item.name_buyer
                    }
                ))
                setDataOCRCheck(dataCheck)                
            }
        }

        const onSuccessVariant = (res) => {
            if (res) {
                setFlashShipVariants(res)  
            }
        }

        const onFail = (err) => {
            console.log(err)
        }

        const onFailVariant = (err) => {
            console.log(err)
        }

        getDesignSku(
            (newRes) => setDesignSku(newRes),
            (err) => console.log('Error when fetching design SKU: ', err)
        )
        getFlashShipPODVariant(onSuccessVariant, onFailVariant)
        getToShipInfo(shopId, data, onSuccess, onFail)
    }, [shopId, toShipInfoData])

    useEffect(() => {
        if (dataOCRCheck && flashShipVariants.length > 0) {
            checkDataPartner(dataOCRCheck);
        }
    }, [dataOCRCheck, flashShipVariants]);

    return (
        <div className="p-10">
            {contextHolder}
            <div>
                <div className='flex flex-wrap items-center mb-3'>
                    <div className="flex-1"><SectionTitle title="Create Order in FlashShip" count={flashShipTable.length ? flashShipTable.length : '0'} /></div>
                    <Space>
                        <Button type='primary' onClick={() => setOpenLoginFlashShip(true)}>Create Order with FlashShip</Button>
                        <Button type='primary'>Export to excel file</Button>
                    </Space>
                </div>
                <Table columns={column} dataSource={flashShipTable} bordered loading={loadingGetInfo} />
            </div>

            <Divider className='my-10'/>
            <div>            
                <div className='flex flex-wrap items-center mb-3'>
                    <div className="flex-1"><SectionTitle title="Create Order in PrintCare" count={printCareTable.length ? printCareTable.length : '0'} /></div>
                    <Button type='primary' onClick={handleExportExcelFile(printCareTable)}>Export to excel file</Button>
                </div>             
                <Table columns={column} dataSource={printCareTable} bordered loading={loadingGetInfo} />
            </div>

            <Modal title="FlashShip Login" open={openLoginFlashShip} onCancel={() => setOpenLoginFlashShip(false)} footer={false}>
                <Form onFinish={handleLoginFlashShip}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{required: true, message: 'Please input your username!'}]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
 
export default OrderForPartner;