import { useLocation } from 'react-router-dom';
import { Table, Popover, Image, Button } from "antd";
import { DownOutlined, EditOutlined } from "@ant-design/icons"

import { getPathByIndex } from "../../utils";
import { OrderPackageWeightSize } from "../../constants"

const CreateLabel = () => {
    const location = useLocation()
    const { orders } = location.state
    const shopId = getPathByIndex(2)
    console.log('OrderPackageWeightSize: ', OrderPackageWeightSize)

    const renderListItemProduct = (data) => {
        const skuList = data.order_info_list.map(item => item.sku_list)
        return skuList.map((skuItem, index) => {
            return (
                <>
                    {skuItem.map(item => (
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
                    ))}
                </>
            )
        });
    };

    const handleChangeShippingService = (shopId, shippingServiceData) => {
        console.log('click');
    }

    const rowSelection = {
        onChange: (_, selectedRows) => {
          console.log(selectedRows)
        },
        // getCheckboxProps: (record) => ({
        //   disabled: [140, 130, 122, 121, 105, 100].includes(record.order_status)
        // })
    };

    const columns = [
        {
          title: "Đơn hàng",
          dataIndex: "combine_item",
          key: "combine_item",
          render: (_, record) => <p>{record.data.order_info_list.length} orders combined</p>
        },
        {
            title: "Sản phẩm",
            dataIndex: "items",
            key: "items",
            render: (_, record) => {
                const sumItem = record.data.order_info_list.map(item => item.sku_list.length).reduce((partialSum, a) => partialSum + a, 0)
                return (
                    <Popover 
                        content={renderListItemProduct(record.data)}
                        trigger="click"
                        placement="bottom"
                        title={`Current package: ${sumItem} items`}
                    >
                        <div className='cursor-pointer hover:bg-gray-200 p-2 flex flex-wrap items-center'>
                            <div className='flex-1'>
                                <p>{sumItem} items</p>
                                <ul className='text-ellipsis whitespace-nowrap overflow-hidden w-[180px]'>
                                    {record.data.order_info_list.map(item => (
                                            item.sku_list.map((prItem, index) => (
                                                <li key={item.sku_id} className='inline-block mr-3 w-10 h-10 [&:nth-child(3+n)]:hidden'>
                                                    <img className="w-full h-full object-cover" width={30} height={30} src={prItem.sku_image} />
                                                </li>
                                            ))
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
            title: "Cân nặng",
            dataIndex: "weight",
            key: "weight",
            render: (_, record) => {
                console.log('record: ', record)
                const productItems = record.data.order_info_list.map(item => (
                    item.sku_list.map(skuItem => skuItem.sku_name).flat()
                )).flat()

                console.log('productItems: ', productItems);
                const productItemsWeight = productItems.map(item => {
                    const packageName = item.split(",")
                    const findPackageName = packageName.map(name => OrderPackageWeightSize.find(packageItem => packageItem.name === name)).filter(filterItem => filterItem !== undefined).flat()
                    console.log(findPackageName);
                })
            }
        },
        {
            title: "Kích thước",
            dataIndex: "package-size",
            key: "package-size",
        },
        {
          title: "Vận chuyển",
          dataIndex: "shipping_provider",
          key: "shipping_provider",
          render: (_, record) => {
            const shippingServiceData = {
                "package_id": record.package_id
            }

            return (
                <div className='flex flex-wrap gap-3 items-center'>
                    <p>{record.data.shipping_provider}</p>
                    <Popover
                        // content={}
                    >
                        <Button onClick={handleChangeShippingService(shopId, shippingServiceData)}><EditOutlined /></Button>
                    </Popover>
                </div>
              )
          }
        }
    ];
    return (
        <Table 
            rowSelection={{
                type: 'checkbox',
                ...rowSelection,
            }}
            scroll={{ x: true }}
            columns={columns} 
            dataSource={orders} 
            // loading={loading}
            bordered
            pagination={{ pageSize: 100}}
        />
    )
}
 
export default CreateLabel;