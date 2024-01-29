import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image, Popover, Table, Tag, Tooltip, Button } from "antd";

import { getPathByIndex, IntlNumberFormat } from "../../utils";
import { formatDate } from "../../utils/date";
import { useShopsOrder } from "../../store/ordersStore";
import { statusOrder } from "../../constants/index";

import { alerts } from "../../utils/alerts";
import { DownOutlined, MessageOutlined } from "@ant-design/icons";
import PageTitle from "../../components/common/PageTitle";

const Orders = () => {
  const shopId = getPathByIndex(2)
  const navigate = useNavigate()
  const [orderSelected, setOrderSelected] = useState([])
  const { orders, buyLabels, getAllOrders, loading } = useShopsOrder((state) => state)
  const orderDataTable = orders.map(item => (
    {
      ...item,
      key: item.order_id
    }
  ))

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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setOrderSelected(selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: record.order_status === 140
  })
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: 'center',
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
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "order_status",
      key: "order_status",
      render: (text) => statusOrder.map(item => item.value === text && <Tag color={item.color}>{item.title}</Tag>)
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
      align: 'center',
      render: (_, record) => IntlNumberFormat(record?.payment_info?.currency, 'currency', 5, record?.payment_info?.total_amount)
    },
  ];

  const handleGetLabels = () => {
    const ordersId = {
      order_ids: orderSelected.map(item => item.order_id)
    }

    const onSuccess = (res) => {
      if (res.doc_urls) {
        navigate(`/shops/${shopId}/orders/labels`, { state: { labels:  res.doc_urls, orders: ordersId} })
      }
    }
    buyLabels(shopId, ordersId, onSuccess, (err) => console.log(err))
    // navigate(`/shops/${shopId}/orders/check-design`)
  }

  useEffect(() => {
    const onSuccess = (res) => {
      console.log(res);
    };

    const onFail = (err) => {
      console.log(err);
    };
    getAllOrders(shopId, onSuccess, onFail);
  }, []);

  return (
    <div className="p-10">
      <PageTitle title="Danh sách đơn hàng" showBack count={orders?.length ? orders?.length : '0'}/>
      {orderSelected.length > 0 && <Button type="primary" className="mb-3" onClick={handleGetLabels}>Lấy Label &nbsp;<span>({orderSelected.length})</span></Button>}
      <Table 
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns} 
        dataSource={orderDataTable} 
        loading={loading} 
        bordered
      />
    </div>
  );
};

export default Orders;
