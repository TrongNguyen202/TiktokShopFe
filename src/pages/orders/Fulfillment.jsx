import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme } from 'antd';

import { useGoogleStore } from '../../store/googleSheets'

import OrdersLabel from '../../components/orders/OrdersLabel'
import OrderCheckDesign from '../../components/orders/OrderCheckDesign'
import OrderForPartner from '../../components/orders/OrderForPartner'
import PageTitle from '../../components/common/PageTitle';

const Fulfillment = () => {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [enableNextStep, setEnableNextStep] = useState(false);
    const [toShipInfoData, setToShipInfoData] = useState([]);
    const { getAllSheetInfo, sheets } = useGoogleStore()
    const changeNextStep = (value) => {
        setEnableNextStep(value)
    }

    const getToShipInfo = (data) => {
        setToShipInfoData(data)
    }

    const steps = [
        {
            title: 'Danh sách Label đã mua',
            content: <OrdersLabel changeNextStep={changeNextStep} toShipInfoData={getToShipInfo}/>,
        },
        {
            title: 'Kiểm tra và xử lý Design',
            content: <OrderCheckDesign changeNextStep={changeNextStep} toShipInfoData={toShipInfoData} />,
        },
        {
            title: 'Tạo và xử lý đơn hàng',
            content: <OrderForPartner toShipInfoData={toShipInfoData}/>,
        }
    ];

    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <div className='p-3 md:p-10'>
          <PageTitle title='Fulfillment' showBack/>
          <Steps current={current} items={items} />
          <div className='mt-5'>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()} disabled={!enableNextStep}>Bước tiếp theo</Button>
                )}
                {current > 0 && (
                    <Button className='ml-[8px]' onClick={() => prev()}>Quay lại</Button>
                )}
          </div>
          <div className='bg-[rgba(0,_0,_0,_0.01)] mt-10 border-[1px] border-dashed border-[rgba(217,_217,_217,_1)]'>{steps[current].content}</div>
      </div>
    );
};
export default Fulfillment;