import { DatePicker, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { alerts } from '../../utils/alerts';
import { getPathByIndex } from '../../utils/index';
// import viVN from "antd/locale/vi_VN";
const { Search } = Input;

const { RangePicker } = DatePicker;
// const rangePresets = [
//   { label: "Hôm nay", value: [dayjs().add(0, "d"), dayjs()] },
//   { label: "Hôm qua", value: [dayjs().add(-1, "d"), dayjs().add(-1, "d")] },
//   { label: "1 tuần trước", value: [dayjs().add(-7, "d"), dayjs()] },
//   { label: "14 ngày trước", value: [dayjs().add(-14, "d"), dayjs()] },
//   { label: "1 tháng trước", value: [dayjs().add(-30, "d"), dayjs()] },
//   { label: "3 tháng trước", value: [dayjs().add(-90, "d"), dayjs()] },
//   { label: "1 năm trước", value: [dayjs().add(-365, "d"), dayjs()] },
// ];

export function Order() {
  console.log('order');
  // LOGIC UI
  const shopId = getPathByIndex(2);
  const navigate = useNavigate();
  const { getAllOrders, tableInfo } = useOrderStore();
  const [searchParam, setSearchparam] = useSearchParams();
  const page = searchParam.get('page');

  // table param
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: parseInt(page || 1),
      pageSize: 20,
    },
    keyword: '',
    status: '',
    start_date: '',
    end_date: '',
    payment_status_code: '',
    order_status_code: '',
  });

  useEffect(() => {
    fetchApi(tableParams.keyword);
  }, [navigate]);

  // logic search
  const fetchApi = () => {
    const onSuccess = (response) => {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.total,
        },
      });
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    getAllOrders(shopId, onSuccess, onFail);
  };

  // handle keyword change
  const onKeywordChange = (e) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      keyword: e.target.value,
    });
  };

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      fetchApi('', dateStrings[0], dateStrings[1]);
    } else {
      fetchApi('', '', '');
    }
  };

  const handleCustomerRoleFilter = (value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      customer_roles: value,
    });
  };

  const handlePaymentStatusFilter = (value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      payment_status_code: value,
    });
  };

  const handleOrderStatusFilter = (value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      order_status_code: value,
    });
  };

  const handleTableChange = (pagination) => {
    setSearchparam({ page: pagination.current });
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
      },
    });
  };

  // const columns = [
  //   {
  //     title: "STT",
  //     dataIndex: "index",
  //     key: "index",
  //     render: (_, item, i) => <p>{i + 1}</p>,
  //   },
  //   {
  //     title: "Mã đơn",
  //     dataIndex: "order_code",
  //     key: "order_code",
  //     render: (_, record) => (
  //       <Link
  //         to={`/order/detail/${record?.order_code}`}
  //         className="font-medium"
  //       >
  //         {record?.order_code}{" "}
  //         <p style={{ fontSize: 11, color: "grey" }}> {record?.created_at} </p>
  //       </Link>
  //     ),
  //   },
  //   {
  //     title: (
  //       <div className="flex gap-2 items-center flex-col">
  //         <p>Người đặt</p>
  //         <Select
  //           defaultValue="Tất cả"
  //           style={{ minWidth: 130 }}
  //           onChange={handleCustomerRoleFilter}
  //           options={[
  //             {
  //               label: "Tất cả",
  //               value: "",
  //             },
  //             {
  //               label: "Khách hàng",
  //               value: "normal",
  //             },
  //             {
  //               label: "Affiliate",
  //               value: "aff",
  //             },
  //             {
  //               label: "seller",
  //               value: "seller",
  //             },
  //           ]}
  //         />
  //       </div>
  //     ),
  //     dataIndex: "name",
  //     key: "name",
  //     render: (_, item, i) => (
  //       <p key={i}>
  //         {" "}
  //         <a href={`/customers/${item?.customer_id}`}>{item?.customer?.name}</a>
  //         <p style={{ fontSize: 11, color: "grey" }}>
  //           {" "}
  //           {item?.customer?.customer_role == "aff"
  //             ? " Affiliate"
  //             : item?.customer?.customer_role == "seller"
  //             ? " Seller"
  //             : ""}
  //         </p>
  //       </p>
  //     ),
  //   },
  //   {
  //     title: customerId == null ? "Giới thiệu" : "Nguồn",
  //     dataIndex: "name",
  //     key: "name",
  //     render: (_, item, i) => (
  //       <p key={i}>
  //         {item.collaborator_by_customer_id === item.customer?.id ||
  //         item.collaborator_by_customer_id === null ? (
  //           <span style={{ color: "green" }}>Tự đặt</span>
  //         ) : (
  //           <span style={{ color: "#cf5763" }}>
  //             {customerId !== null ? "Giới thiệu" : "Có"}
  //           </span>
  //         )}
  //       </p>
  //     ),
  //   },
  //   {
  //     title: "Hoa hồng người đặt",
  //     dataIndex: "name",
  //     key: "name",
  //     render: (_, record) => (
  //       <p key={_}>
  //         {" "}
  //         <span style={{ color: "green" }}>
  //           {formatNumber(record?.commission_buyer)}đ
  //         </span>
  //       </p>
  //     ),
  //   },
  //   {
  //     title: "Hoa hồng giới thiệu",
  //     dataIndex: "name",
  //     key: "name",
  //     render: (_, record) => (
  //       <p key={_}>
  //         {" "}
  //         <span style={{ color: "#cf5763" }}>
  //           {formatNumber(record?.commission_referral)}đ
  //         </span>
  //       </p>
  //     ),
  //   },
  //   {
  //     title: "Tổng tiền",
  //     dataIndex: "total_final",
  //     key: "total_final",
  //     render: (_, record) => <span>{formatNumber(record?.total_final)}đ</span>,
  //   },
  //   {
  //     title: "Thời gian tạo đơn",
  //     dataIndex: "created_at",
  //     key: "created_at",
  //   },
  //   {
  //     title: "Trạng thái thanh toán" && (
  //       <Select
  //         defaultValue="Tất cả"
  //         style={{ minWidth: 180 }}
  //         onChange={handlePaymentStatusFilter}
  //         options={[
  //           {
  //             label: "Tất cả",
  //             value: "",
  //           },
  //           {
  //             label: "Chưa thanh toán",
  //             value: "UNPAID",
  //           },
  //           {
  //             label: "Đã thanh toán một phần",
  //             value: "PARTIALLY_PAID",
  //           },
  //           {
  //             label: "Đã thanh toán",
  //             value: "PAID",
  //           },
  //           {
  //             label: "Đã hoàn tiền",
  //             value: "REFUNDS",
  //           },
  //         ]}
  //       />
  //     ),
  //     dataIndex: "payment_status_name",
  //     key: "payment_status_name",
  //     align: "center",
  //     render: (_, { payment_status_name, payment_status_code }) => {
  //       switch (payment_status_code) {
  //         case "REFUNDS":
  //           return (
  //             <div className="border-[#218ECB]  border-solid text-[#218ECB] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#27AE601A] text-center min-w-[170px]">
  //               {payment_status_name}
  //             </div>
  //           );
  //         case "UNPAID":
  //           return (
  //             <div className="border-[#E83A2F] border-solid text-[#E83A2F] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#E83A2F1A] text-center min-w-[170px]">
  //               {payment_status_name}
  //             </div>
  //           );
  //         case "WAITING_FOR_PROGRESSING":
  //           return (
  //             <div className="border-[#F0AD00] border-solid text-[#F0AD00] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#F0AD001A] text-center min-w-[170px]">
  //               {payment_status_name}
  //             </div>
  //           );
  //         case "PARTIALLY_PAID":
  //           return (
  //             <div className="border-[#FF833D] border-solid text-[#FF833D] w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#F0AD001A] text-center min-w-[170px]">
  //               {payment_status_name}
  //             </div>
  //           );
  //         default:
  //           return (
  //             <div className="border-[#27AE60] text-[#27AE60] border-solid  w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#218ECB1A] text-center min-w-[170px]">
  //               {payment_status_name}
  //             </div>
  //           );
  //       }
  //     },
  //   },
  //   {
  //     title: "Trạng thái đơn hàng" && (
  //       <Select
  //         defaultValue="Tất cả"
  //         style={{ minWidth: 160 }}
  //         onChange={handleOrderStatusFilter}
  //         options={[
  //           {
  //             label: "Tất cả",
  //             value: "",
  //           },
  //           {
  //             label: "Chờ xử lí",
  //             value: "WAITING_FOR_PROGRESSING",
  //           },
  //           {
  //             label: "Đang chuẩn bị hàng",
  //             value: "PACKING",
  //           },
  //           {
  //             label: "Hết hàng",
  //             value: "OUT_OF_STOCK",
  //           },
  //           {
  //             label: "Shop hủy",
  //             value: "USER_CANCELLED",
  //           },
  //           {
  //             label: "Khách đã hủy",
  //             value: "CUSTOMER_CANCELLED",
  //           },
  //           {
  //             label: "Đang giao hàng",
  //             value: "SHIPPING",
  //           },
  //           {
  //             label: "Đã nhận hàng",
  //             value: "SHIPPER_DELIVERED",
  //           },
  //           {
  //             label: "Lỗi giao hàng",
  //             value: "DELIVERY_ERROR",
  //           },
  //           {
  //             label: "Đã hoàn thành",
  //             value: "COMPLETED",
  //           },
  //           {
  //             label: "Chờ trả hàng",
  //             value: "CUSTOMER_RETURNING",
  //           },
  //           {
  //             label: "Đã trả hàng",
  //             value: "CUSTOMER_HAS_RETURNS",
  //           },
  //         ]}
  //       />
  //     ),
  //     dataIndex: "order_status_name",
  //     key: "order_status_name",
  //     align: "center",
  //     render: (_, { order_status_name, order_status_code }) => {
  //       let colorWithOrderStatusColor = (order_status_code) => {
  //         if (
  //           order_status_code == "WAITING_FOR_PROGRESSING" ||
  //           order_status_code == "PACKING" ||
  //           order_status_code == "SHIPPING" ||
  //           order_status_code == "WAIT_FOR_PAYMENT"
  //         ) {
  //           return {
  //             main: "#FF833D",
  //             bg: "#F0AD001A",
  //           };
  //         }
  //         if (
  //           order_status_code == "DELIVERY_ERROR" ||
  //           order_status_code == "DELIVERY_ERROR" ||
  //           order_status_code == "CUSTOMER_CANCELLED" ||
  //           order_status_code == "USER_CANCELLED" ||
  //           order_status_code == "OUT_OF_STOCK"
  //         ) {
  //           return {
  //             main: "#E83A2F",
  //             bg: "#E83A2F1A",
  //           };
  //         }
  //         if (
  //           order_status_code == "REFUNDS" ||
  //           order_status_code == "CUSTOMER_RETURNING" ||
  //           order_status_code == "CUSTOMER_HAS_RETURNS"
  //         ) {
  //           return {
  //             main: "#F0AD00",
  //             bg: "#F0AD001A",
  //           };
  //         }

  //         return {
  //           main: "#27AE60",
  //           bg: "#218ECB1A",
  //         };
  //       };
  //       return (
  //         <>
  //           <div
  //             className="border-solid w-[110px] mx-auto border-[1px] font-semibold py-[6px] rounded-lg bg-[#F0AD001A] text-center min-w-[150px]"
  //             style={{
  //               color: colorWithOrderStatusColor(order_status_code).main,
  //               border: `1px solid ${
  //                 colorWithOrderStatusColor(order_status_code).main
  //               }`,
  //               backgroundColor:
  //                 colorWithOrderStatusColor(order_status_code).bg,
  //             }}
  //           >
  //             {order_status_name}
  //           </div>
  //         </>
  //       );
  //     },
  //   },
  // ];

  return (
    <div className="py-3 bg-white">
      {/* header */}
      <div className="pt-[10px] pl-[30px] pb-[10px] ">
        <div className="flex gap-3 items-center pt-[10px] w-full">
          {/* <div className="flex justify-between">
            <div className="">
              <Search
                placeholder="Tìm mã đơn, tên, SĐT"
                keyword={tableParams.keyword}
                onChange={onKeywordChange}
                onSearch={fetchApi}
                enterButton
              />
            </div>
          </div> */}
          {/* <Space direction="horizontal">
            <Select
                defaultValue="Thời gian tạo đơn"
                style={{
                  width: 228,
                }}
                onChange={handleChangeSelectBox}
                options={[
                  {
                    value: "time_order",
                    label: "Thời gian tạo đơn",
                  },
                  {
                    value: "last_time_change_order_status",
                    label: "Thời gian trạng thái cuối",
                  },
                ]}
              />
            <ConfigProvider locale={viVN}>
              <RangePicker
                popupClassName="text-[12px]"
                presets={[...rangePresets]}
                format="YYYY/MM/DD"
                onChange={onRangeChange}
              />
            </ConfigProvider>
          </Space> */}

          {/* total order */}
          <span className="text-[#CF5763] text-[16px] font-medium">{tableInfo?.total} đơn</span>
          <span>
            Tổng doanh thu:{' '}
            <span className="text-[#CF5763] text-[16px] font-medium">{/* {formatNumber(totalRevenue)}đ */}</span>
          </span>
        </div>
      </div>

      {/* body - table data */}
      {/* <Row>
        <Col span={24}>
          <div className=" px-[20px] ">
            {hasSelected ? (
                <Button type="primary" icon={<PrinterOutlined />} danger>
                  In {selectedRowKeys.length} đơn hàng
                </Button>
              ) : (
                ''
              )}

            <Table
              // rowSelection={rowSelection}
              dataSource={orders.length ? orders : []}
              columns={columns}
              pagination={tableParams.pagination}
              onChange={handleTableChange}
              loading={loading}
              style={{ marginTop: 10, textAlign: "center" }}
            />
          </div>
        </Col>
      </Row> */}
    </div>
  );
}
