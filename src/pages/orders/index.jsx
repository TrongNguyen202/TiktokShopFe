import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, Popover, Space, Table, Tag, Tooltip } from "antd";

import { getPathByIndex } from "../../utils";
import { formatDate } from "../../utils/date";
import { useShopsOrder } from "../../store/ordersStore";
import { statusOrder } from "../../constants/index";

import Loading from "../../components/loading";
import { alerts } from "../../utils/alerts";
import { DownOutlined, MessageOutlined } from "@ant-design/icons";

const Orders = () => {
  const shopId = getPathByIndex(2);
  const { orders, getAllOrders, loading } = useShopsOrder((state) => state);

  const renderListItemProduct = (record) => {
    const { item_list } = record;
    return item_list.map((item, index) => {
      return (
        <div>
          <div className="flex justify-between items-center gap-3 mt-3 w-[300px]">
            <div className="flex gap-2">
              <div className="flex-1">
                <Image
                  src={item.sku_image}
                  className="w-[26px] h-[26px] object-cover mt-1 flex-1"
                  width={26}
                  height={26}
                />
              </div>
              <div>
                <Tooltip title={item.product_name}>
                  <p className="font-semibold line-clamp-1">
                    {item.product_name}
                  </p>
                </Tooltip>
                <p className="text-[12px] text-gray-500">{item.sku_name}</p>
                <p className="text-[12px] text-gray-500">{item.seller_sku}</p>
              </div>
            </div>
            <p className="font-semibold">x{item.quantity}</p>
          </div>
        </div>
      );
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, item, i) => <p>{i + 1}</p>,
    },
    {
      title: "Mã đơn",
      dataIndex: "order_code",
      key: "order_code",
      render: (_, record) => (
        <Link
          to={`/shops/${shopId}/order/${record?.order_id}`}
          state={{ orderData: record }}
          className="font-medium"
        >
          {record?.order_id}{" "}
          <p style={{ fontSize: 11, color: "grey" }}>
            {" "}
            {formatDate(record?.update_time * 1000, "DD/MM/YY, h:mm:ss a")}{" "}
          </p>
        </Link>
      ),
    },
    {
      title: "Người mua",
      dataIndex: "buyer_uid",
      key: "buyer_uid",
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <p className="ml-2">{record?.buyer_uid}</p>
          {record?.buyer_message && (
            <Tooltip title={record?.buyer_message} className="cursor-pointer">
              <MessageOutlined className="text-[12px]" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "item",
      key: "item",
      width: 200,
      render: (_, record) => (
        <Popover
          content={renderListItemProduct(record)}
          title={`${record.item_list.length} sản phẩm`}
          trigger="click"
          placement="bottom"
        >
          <div className="cursor-pointer hover:bg-gray-200 p-2">
            <div className="flex justify-between">
              <p className="text-[13px] font-semibold">
                {record?.item_list?.length} sản phẩm
              </p>
              <p>
                <DownOutlined className="text-[12px]" />
              </p>
            </div>
            <div className="-my-[12px] flex gap-1">
              {record?.item_list?.map((item, index) => (
                <div
                  key={index}
                  className=" last:border-b-0 py-1 px-[8px] -mx-[8px] h-[53px] flex flex-wrap items-center"
                >
                  <img
                    src={item?.sku_image}
                    className="w-[26px] h-[26px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Popover>
      ),
    },
    // {
    //   title: "Thời gian đặt hàng",
    //   dataIndex: "create_time",
    //   key: "create_time",
    //   render: (text) => <span>{formatDate(text, "DD/MM/YY hh:mm:ss")}</span>,
    // },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "order_status",
      key: "order_status",
    },
    {
      title: "Giao hàng",
      dataIndex: "shipping_provider",
      key: "shipping_provider",
    },
    {
      title: "Vận chuyển",
      dataIndex: "delivery_option",
      key: "delivery_option",
    },
    {
      title: "Tổng",
      dataIndex: "payment_info",
      key: "payment_info",
      render: (_, record) => (
        // t muốn forrmat sang tiền Usd thì làm sao
        <p>${record?.payment_info?.total_amount}</p>
      ),
    },
  ];

  useEffect(() => {
    const onSuccess = (res) => {
      console.log(res);
    };

    const onFail = (res) => {
      alerts.error(res);
    };
    getAllOrders(shopId, onSuccess, onFail);
  }, []);

  return (
    <div className="p-10">
      <Table columns={columns} dataSource={orders} loading={loading} />
    </div>
  );
};

export default Orders;
