import { useEffect, useState } from 'react'
import { Card, Col, Row } from 'antd';

import { alerts } from '../../utils/alerts'
import { getPathByIndex } from '../../utils'

import { useShopsStore } from '../../store/shopsStore'

import Loading from '../../components/loading'
import PageTitle from '../../components/common/PageTitle'
import StoreDetailBaseInformation from '../../components/stores/StoreDetailBaseInformation'
import StoreDetailBrands from '../../components/stores/StoreDetailBrands'
import StoreDetailWareHouses from '../../components/stores/StoreDetailWareHouses'
import StoreDetailCategories from '../../components/stores/StoreDetailCategories'
import StoreDetailProducts from '../../components/stores/StoreDetailProducts'
import StoreDetailOrder from '../../components/stores/StoreDetailOrder';
import StoreDetailSectionTitle from '../../components/stores/StoreDetailSectionTitle';

export default function StoreDetail() {
  const shopId = getPathByIndex(2)
  const { loadingById, getStoreById, storeById } = useShopsStore((state) => state)
  
  useEffect(() => {
    const onSuccess = (res) => {
      console.log(res);
    };
    const onFail = (err) => {
      alerts.error(err)
    }
    getStoreById(shopId, onSuccess, onFail)
  }, [shopId])

  const renderStoreDetail = () => {
    if (loadingById) return <Loading />
    
    return (
        <div className='p-10'>
            <PageTitle title='Chi tiết cửa hàng' showBack />

            <div className='mb-10'>
                <StoreDetailBaseInformation store={storeById} />
            </div>

            <div className='mb-10'>
                <StoreDetailWareHouses shopId={shopId} />          
            </div>

            <div className='mb-10'>
                <StoreDetailSectionTitle title='Thông tin chi tiết' />
                <Row gutter={[30, 30]}>
                    <Col span={6}>
                        <StoreDetailBrands shopId={shopId} />
                    </Col>

                    <Col span={6}>
                        <StoreDetailCategories shopId={shopId} />
                    </Col>

                    <Col span={6}>
                        <StoreDetailProducts shopId={shopId}/>
                    </Col>

                    <Col span={6}>
                        <StoreDetailOrder shopId={shopId}/>
                    </Col>
                </Row>
            </div>
        </div>
    )
  }

  return renderStoreDetail();
}
