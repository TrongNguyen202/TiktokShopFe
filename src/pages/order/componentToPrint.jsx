import React from "react";
import { Table } from "antd";
import { formatPrice } from "../../utils";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const data = props.props;
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: "item_price",
      render: (text, record) => <span>{formatPrice(record.item_price)}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Thành tiền",
      render: (text, record) => (
        <span>{formatPrice(record.item_price * record.quantity)}</span>
      ),
    },
  ];
  return (
    <div ref={ref} className="p-[25px]">
      <div className=" border-[1px] border-solid border-[#000]">
        <div className="px-[15px] mt-[25px]">
          Mã đơn hàng: {data?.order_code}
        </div>
        <div
          className="flex justify-between gap-[15px] py-[10px] leading-[25px] px-[15px] my-[20px]"
          style={{
            borderTop: "1px dashed #000",
            borderBottom: "1px dashed #000",
          }}
        >
          <div style={{ flex: 1, borderRight: "1px dashed #000" }}>
            <div className="font-semibold">Từ: </div>
            <div>Tên shop: {data?.store?.name}</div>
            <div>Địa chỉ: {data?.store?.address}</div>
            <div>Hotline: {data?.store?.hotline}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="font-semibold">Đến:</div>
            <div>Người đặt hàng: {data?.customer_address?.name}</div>
            <div>
              Địa chỉ: {data?.customer_address?.address_detail},{" "}
              {data?.customer_address?.wards_name},{" "}
              {data?.customer_address?.province_name},{" "}
              {data?.customer_address?.district_name}
            </div>
            <div>Số điện thoại: {data?.customer_address?.phone}</div>
          </div>
        </div>
        <div
          className="px-[15px] pb-[10px]"
          style={{ borderBottom: "1px dashed #000" }}
        >
          <div>
            Nội dung đơn hàng: {"("}Tổng số lượng sản phẩm:{" "}
            {data?.line_items_at_time?.length}
            {")"}
          </div>
          <Table
            dataSource={data?.line_items_at_time}
            columns={columns}
            footer={() => (
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{formatPrice(data?.total_shipping_fee)}</span>
              </div>
            )}
            pagination={false}
          ></Table>
        </div>
        <div className="flex justify-between leading-[25px] py-[20px] text-[18px] px-[10px]">
          <div style={{ flex: 1 }} className="text-center p-[10px]">
            <div className="mb-[100px]">
              <div>Tiền thu người nhận</div>
              <div className="font-semibold ">
                {formatPrice(data?.total_final)}
              </div>
            </div>
            <div className="text-[13px] italic">
              Quý khách vui lòng kiểm tra danh sách đơn hàng trước khi nhận
              hàng. Cảm ơn Quý khách đã tin tưởng sử dụng sản phẩm của{" "}
              {data?.store?.name}
            </div>
          </div>
          <div
            style={{ flex: 1, border: "1px dashed #000" }}
            className="text-center p-[10px]"
          >
            <div>Chữ ký người nhận</div>
            <div>Xác nhận hàng nguyên vẹn, không bóp méo</div>
          </div>
        </div>
      </div>
    </div>
  );
});
