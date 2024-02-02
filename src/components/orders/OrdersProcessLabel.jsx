import { useState } from "react";
import { useLocation, Link } from "react-router-dom"
import { Table, Tag, Button, Space, Input, Form, message, Card } from 'antd';

import { getPathByIndex } from '../../utils'
import { useShopsOrder } from "../../store/ordersStore";

import SectionTitle from "../common/SectionTitle";
import LoadingButton from '../../components/common/LoadingButton'
import OrderGetToShipInfo from "./OrderGetToShipInfo";

const OrdersProcessLabel = ({changeNextStep, toShipInfoData}) => {
    const shopId = getPathByIndex(2)
    const location = useLocation()
    const { labels, orders } = location.state
    const [labelsById, setLabelsById] = useState([])
    const [labelSelected, setLabelSelected] = useState([])
    const [hasPushDriver, setHasPushDriver] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const { getLabelsById, getToShipInfo, toShipInfo, uploadLabelToDriver, loading, loadingGetInfo } = useShopsOrder((state) => state)

    const data = orders.map((order, index) => (
        {
            key: index,
            order_id: order.order_id,
            label: labels[index]
        }
    ))

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
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

    const onSearch = (values) => {
        const onSuccess = (res) => {
            if (res) {
                setLabelsById(res)
            }
        }
        getLabelsById(values.order_id, onSuccess, () => {})
        
    }

    const dataLabelProcessTest = {
        "order_documents": [
            {
                "order_id": "576574955557261378",
                "doc_url": "https://utfs.io/f/69e037b2-c448-49eb-8958-6c1ceb21270c-goim43.pdf"
            },
            {
                "order_id": "576579276613062722",
                "doc_url": "https://utfs.io/f/242db5cd-efae-48e9-aa98-a8677e4e7d22-1tv8vr.pdf"
            }
        ]
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
                messageApi.open({
                    type: 'success',
                    content: 'Đã đẩy label lên Driver thành công',
                })
                setHasPushDriver(true)
            }
        }

        const onFail = (err) => messageApi.error(err)

        uploadLabelToDriver(dataLabelProcess, onSuccess, onFail)        
    }
    
    const handleBack = () => {
        setHasPushDriver(false)
    }

    const handleToShipOrders = () => {
        const onSuccess = (res) => {
            console.log(res);
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

    const handleGetToShipInfo = () => {
        const onSuccess = (res) => {
            if (res) {
                changeNextStep(true)
                toShipInfoData(toShipInfo)
            }
        }

        getToShipInfo(shopId, dataLabelProcessTest, onSuccess, () => {})    
    }

    console.log('toShipInfo: ', toShipInfo);

    return (
        <div className="p-10">
            {contextHolder}
            {!hasPushDriver &&
                <div className="mb-3 text-start">
                    <SectionTitle title='Danh sách label' count={labels.length}/>
                    <i>(Vui lòng tick vào ô để chọn label cần xử lý)</i>
                </div>
            }        
            {labelSelected.length > 0 &&
                <Space className="mb-3 w-full">
                    {!hasPushDriver ? 
                        <Button type="primary" onClick={handleLabelProcessing}>
                            Đẩy Label lên Google Drive &nbsp;
                            <span>({labelSelected.length})</span>
                            <LoadingButton loading={loading}/>
                        </Button>

                    :
                        <>
                            <Form onFinish={onSearch} onFinishFailed={() => {}} className='w-[400px] relative border-[1px] border-solid border-[#d9d9d9] rounded-[6px] pr-[90px]'>
                                <Form.Item name="order_id" className="mb-0">
                                    <Input placeholder='Tìm kiếm theo Order ID...' className="!border-none"/>
                                </Form.Item>
                                <Form.Item className="absolute top-[-1px] right-[-1px] bottom-[-1px] mb-0">
                                    <Button type="primary" htmlType="submit" className="h-[34px]">
                                        Tìm kiếm
                                        <LoadingButton loading={loading}/>
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Button type="primary" onClick={handleGetToShipInfo}>
                                Lấy thông tin đơn hàng và Label
                                <LoadingButton loading={loadingGetInfo}/>
                            </Button>
                            <Button type="primary" onClick={handleBack}>Quay lại</Button>
                        </>
                    }
                </Space>
            }

            {labelsById.length > 0 && 
                <Card title={`Thông tin tìm kiếm  cho [${labelsById[0].name}]`} className="mb-3">
                    <p><span className="min-w-[70px] inline-block font-semibold">Order ID:</span> {labelsById[0].name}</p>
                    <p><span className="min-w-[70px] inline-block font-semibold">Label URL:</span> <Link to={labelsById[0].link} target="_blank">{labelsById[0].link}</Link></p>
                </Card>
            }

            {!hasPushDriver &&
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}                    
                    columns={columns}
                    dataSource={data}
                    bordered
                    pagination={{ position: ['none'] }}
                    loading={loading}
                />
            }

            {toShipInfo.length > 0 &&
                <OrderGetToShipInfo data={toShipInfo} loading={loadingGetInfo}/>
            }
        </div>
    );
}
 
export default OrdersProcessLabel;