import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme } from 'antd';

import { useGoogleStore } from '../../store/googleSheets'

import OrdersProcessLabel from '../../components/orders/OrdersProcessLabel'
import OrderCheckDesign from '../../components/orders/OrderCheckDesign'
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
        console.log('data: ', data);
        setToShipInfoData(data)
    }

    console.log('toShipInfoData: ', toShipInfoData);

    const steps = [
        {
            title: 'Xửa lý label',
            content: <OrdersProcessLabel changeNextStep={changeNextStep} toShipInfoData={getToShipInfo}/>,
        },
        {
            title: 'Xử lý mẫu',
            content: <OrderCheckDesign changeNextStep={changeNextStep} toShipInfoData={toShipInfoData} sheetData={sheets}/>,
        },
        {
            title: 'Tạo đơn hàng bên FlashShip',
            content: 'Last-content',
        },
        {
            title: 'Tạo đơn hàng bên PrintCare',
            content: 'Last-content',
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

    console.log('toShipInfoData: ', toShipInfoData);

    useEffect(() => {
        const onSuccess = (res) => {
            console.log(res)
        }

        const onFail = (err) => {
            console.log(err);
        }
        
        getAllSheetInfo('Team Dang!A:F', onSuccess, onFail)
    }, [])

    return (
      <div className='p-10'>
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