import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom"
import { Table, Tag, Button, Space, Input, Form, message, Card, Spin, Alert } from 'antd';

import { getPathByIndex } from '../../utils'
import { useShopsOrder } from "../../store/ordersStore";

import SectionTitle from "../common/SectionTitle";
import LoadingButton from '../../components/common/LoadingButton'
import OrderGetToShipInfo from "./OrderGetToShipInfo";

const OrdersProcessLabel = ({changeNextStep, toShipInfoData}) => {
    const shopId = getPathByIndex(2)
    const location = useLocation()
    const { labels, shippingDoc } = location.state
    const [stepProcessLabel, setStepProcessLabel] = useState(1)
    const [labelSelected, setLabelSelected] = useState([])
    const [labelSearch, setLabelSearch] = useState([])
    const [dataGetToShipInfo, setDataGetToShipInfo] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const { getLabelsById, getToShipInfo, toShipInfo, uploadLabelToDriver, loading, loadingGetInfo } = useShopsOrder((state) => state)

    console.log('shippingDoc: ', shippingDoc);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
            render: (_, record, index) => index + 1
        },
        {
          title: 'Package ID',
          dataIndex: 'package_id',
          render: (_, record) => record.order_list.package_id
        },
        {
          title: 'Label URL',
          dataIndex: 'label',
          render: (text) => text ? <Link to={text} target="_blank">{text}</Link> : <Tag color="error">Không lấy được label</Tag>
        }
    ]

    const rowSelection = {
        onChange: (_, selectedRows) => {
            console.log('selectedRows: ', selectedRows)
            setLabelSelected(selectedRows)
        },
        getCheckboxProps: (record) => ({
            disabled: record.label === null
        })
    }

    const handlePushToDriver = () => {
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

                setStepProcessLabel(2)
                const onSuccess = (res) => {
                    if (res) {
                        changeNextStep(true)
                        setDataGetToShipInfo(toShipInfo)
                    }
                }
        
                getToShipInfo(shopId, dataLabelProcess, onSuccess, (err) => console.log(err))   
            }
        }

        const onFail = (err) => messageApi.error(err)
        uploadLabelToDriver(dataLabelProcess, onSuccess, onFail)  
    }

    const onSearch = (values) => {
        const onSuccess = (res) => {
            if (res) {
                setLabelSearch(res)
            }
        }
        getLabelsById(values.order_id, onSuccess, () => {})
        
    }

    const handleBack = () => {
        setStepProcessLabel(1)
        setLabelSelected([])
    }

    useEffect(() => {
        toShipInfoData(toShipInfo)
    }, [toShipInfo])

    console.log('labelSelected: ', labelSelected)

    return (
        <div className="p-3 md:p-10">
            {contextHolder}
            {stepProcessLabel === 1 &&
                <>
                    <div className="mb-3 text-start">
                        <SectionTitle title='Danh sách label' count={shippingDoc.length}/>
                        <p><i>(Vui lòng tick vào ô để chọn label cần xử lý)</i></p>
                        {labelSelected.length > 0 && 
                            <Button type="primary" onClick={handlePushToDriver} className="mt-3">
                                Đẩy Label lên Google Drive &nbsp;
                                <span>({labelSelected.length})</span>
                                <LoadingButton loading={loading}/>
                            </Button>
                        }
                    </div>
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}     
                        scroll={{ x: true }}               
                        columns={columns}
                        dataSource={shippingDoc}
                        bordered
                        pagination={false}
                        loading={loading}
                        rowKey={(record) => record.order_list.package_id}
                    />
                </>
            }

            {stepProcessLabel === 2 &&
                <>
                    {loadingGetInfo && <Spin tip="Đang lấy thông tin đơn hàng..." className="mb-3 block" />}
                    {!loadingGetInfo &&
                        <>
                            <Space className="mb-3">
                        <Form onFinish={onSearch} onFinishFailed={() => { }} className='md:w-[400px] relative border-[1px] border-solid border-[#d9d9d9] rounded-[6px] pr-[90px]'>
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
                                <Button type="primary" onClick={handleBack}>Quay lại</Button>
                            </Space>

                            {labelSearch.length > 0 &&
                                <Card title={`Thông tin tìm kiếm  cho [${labelSearch[0].name}]`} className="mb-3">
                                    <p><span className="min-w-[70px] inline-block font-semibold">Order ID:</span> {labelSearch[0].name}</p>
                                    <p><span className="min-w-[70px] inline-block font-semibold">Label URL:</span> <Link to={labelSearch[0].link} target="_blank">{labelSearch[0].link}</Link></p>
                                </Card>
                            }

                            {dataGetToShipInfo.length > 0 &&
                                <OrderGetToShipInfo data={dataGetToShipInfo} loading={loadingGetInfo}/>
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}
 
export default OrdersProcessLabel;