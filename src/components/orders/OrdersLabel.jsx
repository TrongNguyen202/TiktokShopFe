import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom"
import { Table, Tag, Button, Space, Input, Form, message, Card, Spin, Modal } from 'antd';

import { getPathByIndex } from '../../utils'
import { useShopsOrder } from "../../store/ordersStore";

import SectionTitle from "../common/SectionTitle";
import LoadingButton from '../common/LoadingButton'
import OrderGetToShipInfo from "./OrderGetToShipInfo";

const OrdersLabel = ({changeNextStep, toShipInfoData}) => {
    const shopId = getPathByIndex(2)
    const location = useLocation()
    const { shippingDoc } = location.state
    const [labelSelected, setLabelSelected] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const { getToShipInfo, toShipInfo, uploadLabelToDriver, loading } = useShopsOrder((state) => state)

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            align: 'center',
            render: (_, record, index) => index + 1
        },
        {
          title: 'Package ID',
          dataIndex: 'package_id'
        },
        {
            title: 'Order ID',
            dataIndex: 'order_id',
            render: (_, record) => record.order_list.map(item => (
                <p className="py-4 border-0 border-b-[1px] border-solid border-[#0505050f] last:border-b-0">{item.order_id}</p>
            ))
          },
        {
          title: 'Label URL',
          dataIndex: 'label',
          render: (text) => text ? <Link to={text} target="_blank">{text}</Link> : <Tag color="error">Không lấy được label</Tag>
        }
    ]

    const rowSelection = {
        onChange: (_, selectedRows) => {
            setLabelSelected(selectedRows)
            if (selectedRows.length) changeNextStep(true)
            else changeNextStep(false)
        },
        getCheckboxProps: (record) => ({
            disabled: record.label === null
        })
    }

    const handlePushToDriver = () => {
        const dataLabelProcess = {
            order_documents: labelSelected?.map(item => (
                {
                    package_id: item.order_list.package_list[0].package_id,
                    doc_url: item.label
                }
            ))
        }

        const onSuccess = (res) => {
            if (res) {
                const onSuccess = (res) => {
                    if (res) {
                        messageApi.open({
                            type: 'success',
                            content: 'Đã đẩy label lên Server thành công',
                        })
                        setDataGetToShipInfo(toShipInfo)
                    }
                }
        
                getToShipInfo(shopId, dataLabelProcess, onSuccess, (err) => console.log(err))   
            }
        }

        const onFail = (err) => messageApi.error(err)
        uploadLabelToDriver(dataLabelProcess, onSuccess, onFail)  
    }

    useEffect(() => {
        toShipInfoData(labelSelected)
    }, [labelSelected])

    return (
        <div className="p-3 md:p-10">
            {contextHolder}
            <div className="mb-3 text-start">
                <SectionTitle title='Danh sách label' count={shippingDoc.length ? shippingDoc.length : "0"}/>
                <p><i>(Vui lòng tick vào ô để chọn label muốn Fulfillment)</i></p>
                <Button type="primary" onClick={handlePushToDriver} className="mt-3" disabled={!labelSelected.length}>
                    Lưu file Label đã mua vào Server &nbsp;
                    <span>({labelSelected.length})</span>
                    <LoadingButton loading={loading}/>
                </Button>
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
                rowKey={(record) => record.package_id}
            />
        </div>
    )
}
 
export default OrdersLabel;