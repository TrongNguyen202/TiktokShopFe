import { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd'

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
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser'],
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sydney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
        },
    ];

    const data2 = [
        {
          key: '1',
          name: 'John Brown 2',
          age: 32,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser'],
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sydney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
        },
    ];
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
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
        setIsModalOpen(true)
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

    console.log('isModalOpen: ', isModalOpen);
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
            {hasNewDesignData &&
                <Modal title="Thêm ảnh mặt trước và ảnh mặt sau cho mẫu" open={isModalOpen} footer={null} onCancel={setIsModalOpen(false)}>
                    <OrdersAddImageDesignByExcel/>
                </Modal>
            }
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