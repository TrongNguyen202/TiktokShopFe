import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Table, Tag, Button, Space, Input, Form } from 'antd';

import { getPathByIndex } from '../../utils'
import { useShopsOrder } from "../../store/ordersStore";

import PageTitle from "../../components/common/PageTitle";
import OrdersLabelsSearch from "../../components/orders/OrdersLabelsSearch";

const OrderLabels = () => {
    const shopId = getPathByIndex(2)
    const location = useLocation()
    const navigate = useNavigate()
    const { labels, orders } = location.state
    const [labelSelected, setLabelSelected] = useState([])
    const [isGetLabel, setIsGetLabel] = useState(false)
    const [showToShipOrders, setShowToShipOrders] = useState(false)
    const [checkDesign, setCheckDesign] = useState(false)
    const { getLabelsById, labelsById, getToShipInfo, uploadLabelToDriver, loading } = useShopsOrder((state) => state)

    const data = orders.map((order, index) => (
        {
            key: index,
            order_id: order.order_id,
            label: labels[index]
        }
    ))

    const columns = [
        {
            title: 'SST',
            dataIndex: 'stt',
            render: (_, record, index) => index + 1
          },
        {
          title: 'Order ID',
          dataIndex: 'order_id'
        },
        {
          title: 'Label URL',
          dataIndex: 'label',
          render: (text) => text ? <Link to={text} target="_blank">{text}</Link> : <Tag color="error">Không lấy được label</Tag>
        }
    ];

    const rowSelection = {
        onChange: (_, selectedRows) => {
            setLabelSelected(selectedRows)
        },
        getCheckboxProps: (record) => ({
            disabled: record.label === null
        })
    };

    const onFinish = (values) => {
        const onSuccess = (res) => {}
        getLabelsById(values.order_id, onSuccess, () => {})
        
    }

    const handleLabelProcessing = () => {
        const dataLabelProcess = {
            order_documents: labelSelected?.map(item => (
                {
                    order_id: item.order_id,
                    doc_url: item.label
                }
            ))
        }

        const onSuccess = (res) => {
            if (res) {
                setShowToShipOrders(true)
                setIsGetLabel(true)
            }
        }

        uploadLabelToDriver(dataLabelProcess, onSuccess, (err) => console.log(err))        
    }
    
    const handleBack = () => {
        setShowToShipOrders(false)
        setCheckDesign(false)
    }

    const handleToShipOrders = () => {
        const onSuccess = (res) => {
            ;
            setCheckDesign(true)
        }
        getToShipInfo(shopId, onSuccess, () => {})

        // const dataSend = labelSelected.map(item => orders.filter(order => order.order_id === item.order_id)).flat()
        // const dataMatching = dataSend.map(item => (
        //     {
        //         ...item,
        //         linkLabel: labelSelected.find(label => label.order_id === item.order_id).label
        //     }
        // ))
        // if (dataMatching) {
        //     console.log('dataSend: ', dataMatching);
        //     navigate(`/shops/${shopId}/orders/check-design`, {state: { orders: dataMatching }})
        // }
    }

    return (
        <div className="p-10">
            <PageTitle title='Danh sách label' showBack count={labels.length}/>
            {labelSelected.length > 0 && 
                <Space className="mb-3">
                    {!showToShipOrders && <Button type="primary" onClick={handleLabelProcessing}>Đẩy Label lên Google Drive &nbsp;<span>({labelSelected.length})</span></Button>}
                    {showToShipOrders && 
                        <>
                            <Button type="primary" onClick={handleBack}>Quay lại</Button>
                            <Button type="primary" onClick={handleToShipOrders}>Lấy thông tin đơn hàng và Label</Button>
                        </>
                    }

                    {checkDesign &&
                        <Button type="primary" onClick={handleToShipOrders}>Kiếm tra Design</Button>
                    }

                    {isGetLabel && 
                        <Form onFinish={onFinish} onFinishFailed={() => {}} className='w-[400px] relative border-[1px] border-solid border-[#d9d9d9] rounded-[6px] pr-[90px]'>
                            <Form.Item name="order_id" className="mb-0">
                                <Input placeholder='Tìm kiếm theo Order ID...' className="!border-none"/>
                            </Form.Item>
                            <Form.Item className="absolute top-[-1px] right-[-1px] bottom-[-1px] mb-0">
                                <Button type="primary" htmlType="submit" className="h-[34px]">Tìm kiếm</Button>
                            </Form.Item>
                        </Form>
                    }
                </Space>
            }
            {!isGetLabel &&
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    bordered
                />
            }

            {isGetLabel &&
                <OrdersLabelsSearch dataSource={labelsById} loading={loading}/>
            }
        </div>
    );
}
 
export default OrderLabels;