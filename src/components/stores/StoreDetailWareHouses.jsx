import { useEffect } from 'react'
import { Row, Col, Card, Badge, Spin } from 'antd'

import { useWareHousesStore } from '../../store/warehousesStore'

import StoreDetailSectionTitle from './StoreDetailSectionTitle';
import { alerts } from '../../utils/alerts';

const StoreDetailWareHouses = ({shopId}) => {
    const { getWarehousesByShopId, warehousesById, loading } = useWareHousesStore((state) => state)

    useEffect(() => {
        const onSuccess = (res) => {
        }
        const onFail = (err) => {
          alerts.error(err)
        }
        
        getWarehousesByShopId(shopId, onSuccess, onFail)
    }, [])

    const { warehouse_list } = warehousesById

    return (
        <>
            <StoreDetailSectionTitle title='Thông tin kho' count={warehouse_list?.length} />
            {loading && <p className='text-[#21409A]'><Spin className='mr-3'/>Đang lấy thông tin...</p> }
            {!loading && 
                <Row className='mb-5' gutter={30}>
                    {warehouse_list?.map((item) => (
                        <Col key={item.warehouse_id} md={{ span: 12 }} span={24} className='mb-3 md:mb-0'>
                        <Card className='relative'>
                        {item.is_default && <Badge count='Kho mặc định' style={{ backgroundColor: '#52c41a' }} className='absolute -top-[10px] left-[10px]' />}
                        <span></span>
                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                                    <Col md={{ span: 4 }} span={8}>Tên kho:</Col>
                            <Col className='font-medium text-[#21409A]'>{item?.warehouse_name}</Col>
                        </Row>

                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                                    <Col md={{ span: 4 }} span={8}>Mã kho:</Col>
                            <Col className='font-medium text-[#21409A]'>{item?.warehouse_id}</Col>
                        </Row>

                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                                    <Col md={{ span: 4 }} span={8}>Số điện thoại:</Col>
                            <Col className='font-medium text-[#21409A]'>{item?.warehouse_address?.phone}</Col>
                        </Row>

                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                                    <Col md={{ span: 4 }} span={8}>Địa chỉ:</Col>
                            <Col className='font-medium text-[#21409A]'>{item?.warehouse_address?.full_address}</Col>
                        </Row>

                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                                    <Col md={{ span: 4 }} span={8}>Quốc gia:</Col>
                            <Col className='font-medium text-[#21409A]'>{item?.warehouse_address?.region}</Col>
                        </Row>

                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                                    <Col md={{ span: 4 }} span={8}>Tiểu bang/Tỉnh:</Col>
                            <Col className='font-medium text-[#21409A]'>{item?.warehouse_address?.state}</Col>
                        </Row>

                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                                    <Col md={{ span: 4 }} span={8}>Mã zip/postal:</Col>
                            <Col className='font-medium text-[#21409A]'>{item?.warehouse_address?.zipcode}</Col>
                        </Row>
                        </Card>          
                    </Col>
                    ))}
                </Row>
            }
        </>
    );
}
 
export default StoreDetailWareHouses;