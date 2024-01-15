import { Card, Row, Col } from 'antd'

import { formatDate } from '../../utils/date'

import StoreDetailSectionTitle from './StoreDetailSectionTitle';

const StoreDetailBaseInformation = ({store}) => {
    return (
        <>
            <StoreDetailSectionTitle title='Thông tin cơ bản'/>
            <Card className='mb-5'>
                <Row>
                    <Col span={12}>
                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                            <Col span={4}>Tên cửa hàng:</Col>
                            <Col className='font-medium text-[#21409A]'>{store.shop_name}</Col>
                        </Row>
                    </Col>

                    <Col span={12}>
                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                            <Col span={4}>Thời gian hết hạn:</Col>
                            <Col className='font-medium text-[#21409A]'>{formatDate(new Date(), 'DD/MM/YY, h:mm:ss a')}</Col>
                        </Row>
                    </Col>

                    <Col span={12}>
                        <Row className='items-center gap-[4px] justify-start mt-3 break-words flex-nowrap'>
                            <Col span={4}>Mã cửa hàng:</Col>
                            <Col className='font-medium text-[#21409A]'>{store.shop_code}</Col>
                        </Row>
                    </Col>
                </Row>
            </Card>    
        </>
    );
}
 
export default StoreDetailBaseInformation;