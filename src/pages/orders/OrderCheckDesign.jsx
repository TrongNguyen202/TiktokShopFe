import { useEffect, useState } from 'react';
import { Table, Button } from 'antd'

import { useGoogleStore } from '../../store/googleSheets'

import PageTitle from "../../components/common/PageTitle";
import OrdersAddNewDesignData from '../../components/orders/OrdersAddNewDesignData';
import OrdersAddImageDesignByExcel from '../../components/orders/OrdersAddImageDesignByExcel';

const OrderCheckDesign = () => {
    const [toShipOrder, setToShipOrder] = useState([])
    const [newDesignData, setNewDesignData] = useState([])
    const [hasAddDesign, setHasAddDesign] = useState(false)
    const [hasNewDesignData, setHasNewDesignData] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { getAllSheetInfo, sheets, AddRowToSheet } = useGoogleStore()

    const data = [
        {
          "Order ID": "576553431390327649",
          "Order Substatus": 'Awaiting Collection',
          "SKU ID": "1729416642180846434",
          "Product Name": "Vintage 90s Columbus Blue Jacket Shirt Crewneck Columbus Blue Jacket Sweatshirt Jersey Hockey Gift For Christmas 3110 Ltrp Shirt, T-shirt, Sweatshirt, Hoodie, Free Shipping",
          "Variation": "Red, Crewneck Sweatshirt S",
          "Quantity": "1",
          "Tracking ID": "1729416642180846434"
        },
        {
            "Order ID": "576553431390327650",
            "Order Substatus": 'Awaiting Collection',
            "SKU ID": "1729416642180846435",
            "Product Name": "Miami Basketball Vintage Shirt Heat 90s Basketball Graphic Tee Retro For Women And Men Basketball Fan Ptp0910 Shirt, T-shirt, Sweatshirt, Hoodie, Free Shipping",
            "Variation": "Sport Grey, Crewneck Sweatshirt L",
            "Quantity": "1",
            "Tracking ID": "1729416638789161826"
        }
    ];
    
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'Order ID',
            key: 'Order ID'
        },
        {
            title: 'Order Substatus',
            dataIndex: 'Order Substatus',
            key: 'Order Substatus',
        },
        {
            title: 'SKU ID',
            dataIndex: 'SKU ID',
            key: 'SKU ID',
        },
        {
            title: 'Product Name',
            dataIndex: 'Product Name',
            key: 'Product Name',
        },
        {
            title: 'Variation',
            dataIndex: 'Variation',
            key: 'Variation',
        },
        {
            title: 'Quantity',
            dataIndex: 'Quantity',
            key: 'Quantity',
        },
        {
            title: 'Tracking ID',
            dataIndex: 'Tracking ID',
            key: 'Tracking ID',
        }
    ]

    const arrayTest = [
        [
            "1729394631027757219",
            "Halloween Cute Cat Crewneck Custom Halloween Holiday Sweatshirt Pumpkin Sweatshirt T-shirt, Sweatshirt, Hoodie, Free Shipping",
            "tt-ka-300823-shoptruong2-46,Sand,Hoodie,L",
            "",
            "",
            "1"
        ],
        [
            "1729394443161800858",
            "Taylor Swift Tour Eras Ghost Shirt T-shirt, Sweatshirt, Hoodie, Free Shipping",
            "tt-ka-300823-shoptruong2-57,Ash,T-Shirt,S",
            "",
            "",
            "1"
        ]
    ];

    const handleCheckOrderWithExcel = async() => {
        const newData = []
        let oauthAccessToken = localStorage.getItem('oauthAccessToken')
        if (!oauthAccessToken) {
            const response = await signInWithGoogle();
            localStorage.setItem('oauthAccessToken', response._tokenResponse.oauthAccessToken)
            oauthAccessToken = response._tokenResponse.oauthAccessToken
        }

        arrayTest.forEach(itemTest => {
            const matchingItem = sheets?.values?.some(itemOrigin => itemOrigin[0] === itemTest[0]);
            if (!matchingItem) {
                setHasAddDesign(true)
                sheets?.values?.push(itemTest)
                newData.push(itemTest)
                setNewDesignData(newData)
                AddRowToSheet('Team Dang', data, oauthAccessToken)
            }
        });
    }

    const handleAddDesign = () => {
        // setHasNewDesignData(true)
    }

    useEffect(() => {
        const onSuccess = (res) => {
            // console.log('res: ', res);
        }

        const onFail = (err) => {
            console.log(err);
        }
        getAllSheetInfo('Team Dang!A:F', onSuccess, onFail)
    }, [])

    const dataTableNewDesign = newDesignData.map(item => {
        const object = {}
        sheets?.values&&sheets?.values[0].map((key, index) => (
            object[key] = item[index]
        ))

        return object;
    })

    return (
        <div className="p-10">
            <PageTitle title='Kiểm tra và thêm mẫu' showBack/>
            <div className='text-center'>
                {!hasAddDesign && <Button type="primary" className='mb-3' onClick={handleCheckOrderWithExcel}>Kiếm tra mẫu trên Design sku files</Button>}
                {(!hasNewDesignData && hasAddDesign) && <Button type="primary" className='mb-3' onClick={handleAddDesign}>Thêm mẫu trực tiếp trên Design sku files</Button>}
            </div>
            {hasNewDesignData && <OrdersAddImageDesignByExcel/>}
            {!hasAddDesign && <Table columns={columns} dataSource={data} bordered /> }
            {hasAddDesign &&
                <OrdersAddNewDesignData 
                    dataColumns={dataTableNewDesign} 
                    pagination={{
                        position: ['none', 'none']
                    }}
                />
            }
        </div>
    );
}
 
export default OrderCheckDesign;