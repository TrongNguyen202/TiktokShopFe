import { DownOutlined, LoadingOutlined, MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Image, Popover, Space, Spin, Table, Tag, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { statusOrder } from "../../constants/index";
import { useShopsOrder } from "../../store/ordersStore";
import { getPathByIndex, IntlNumberFormat } from "../../utils";
import { formatDate } from "../../utils/date";

import { DatePicker } from 'antd';
import dayjs from "dayjs";
import PageTitle from "../../components/common/PageTitle";

const { RangePicker } = DatePicker;
const rangePresets = [
  { label: "Today", value: [dayjs().add(0, "d"), dayjs()] },
  { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs().add(-1, "d")] },
  { label: "Last 7 days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 days", value: [dayjs().add(-30, "d"), dayjs()] },
  // { label: "3 tháng trước", value: [dayjs().add(-90, "d"), dayjs()] },
  // { label: "1 năm trước", value: [dayjs().add(-365, "d"), dayjs()] },
];


const Orders = () => {
  const shopId = getPathByIndex(2)
  const navigate = useNavigate()
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  console.log('searchText: ', searchText);
  const [searchedColumn, setSearchedColumn] = useState('');
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const onRangeChange = (dates, dateStrings, confirm, dataIndex, setSelectedKeys, selectedKeys) => {
    confirm()
    setSelectedKeys(dateStrings)
    setSearchText(dateStrings)
    setSearchedColumn(dataIndex)
  };


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div onKeyDown={(e) => e.stopPropagation()} className="px-5 py-3">
        {/* <Input ref={searchInput} placeholder={`Hãy tìm theo định dạng DD/MM/YYYY`} value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        /> */}
        {/* <ConfigProvider locale={viVN}> */}
        <RangePicker
          popupClassName="text-[12px]"
          presets={[...rangePresets]}
          format="DD/MM/YYYY"
          onChange={(date, dateStrings) => onRangeChange(date, dateStrings, confirm, dataIndex, setSelectedKeys, selectedKeys)}
        />
        {/* </ConfigProvider> */}

        <Space className="mt-3">
          <Button type="primary" size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
              close();
            }}
          >Tìm kiếm</Button>

          <Button size="small"
            onClick={() => {
              clearFilters()
              setSearchText('')
              confirm({
                closeDropdown: false,
              });
              close();
            }}
          >Xoá</Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined className={filtered ? '#1677ff' : undefined}/>
    ),

    onFilter: (value, record) => {
      if (searchText.length === 2) {
        const startDate = dayjs(searchText[0], 'DD/MM/YYYY').startOf('day').valueOf();
        const endDate = dayjs(searchText[1], 'DD/MM/YYYY').endOf('day').valueOf();
        // const createTime = Number(record[dataIndex]);
        // console.log('createTime: ', createTime, startDate, endDate,);

        // console.log('createTime >= startDate && createTime <= endDate;: ', createTime >= startDate && createTime <= endDate);
        // return createTime >= startDate && createTime <= endDate;
        const createTime = dayjs(Number(record[dataIndex]), 'DD/MM/YYYY');

        return createTime.isSameOrAfter(startDate) && createTime.isSameOrBefore(endDate);
      }
      return false;
    },
    render: (text) => formatDate(Number(text), "DD/MM/YYYY, hh:mm:ss a")
  });

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setOrderSelected(selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: [140, 130, 122, 121].includes(record.order_status)
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
            {formatDate(record?.update_time * 1000, "DD/MM/YYYY, h:mm:ss a")}{" "}
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
      onFilter: (value, record) => record.order_status === value,
      filters: statusOrder?.map(item => ({ 
        text:  item.title, 
        value: item.value
      })),
      render: (text) => statusOrder.map(item => item.value === text && <Tag color={item.color}>{item.title}</Tag>),
    },
    {
      title: "Thời gian tạo đơn",
      dataIndex: "create_time",
      key: "create_time",
      ...getColumnSearchProps('create_time')
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
        navigate(`/shops/${shopId}/orders/fulfillment`, { state: { labels:  res.doc_urls, orders: orderSelected} })
      }
    }
    buyLabels(shopId, ordersId, onSuccess, (err) => console.log(err))
  }

  useEffect(() => {
    const onSuccess = (res) => {
      ;
    };

    const onFail = (err) => {
      console.log(err);
    };
    getAllOrders(shopId, onSuccess, onFail);
  }, []);

  return (
    <div className="p-3 md:p-10">
      <PageTitle title="Danh sách đơn hàng" showBack count={orders?.length ? orders?.length : '0'}/>
      {orderSelected.length > 0 && <Button type="primary" className="mb-3" onClick={handleGetLabels}>
        Bắt đầu Fulfillment &nbsp;<span>({orderSelected.length})</span>
        {loading && <Spin indicator={<LoadingOutlined className="text-white ml-3" />} />}
      </Button>}
      <Table 
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        scroll={{ x: true }}
        columns={columns} 
        dataSource={orderDataTable} 
        loading={loading} 
        bordered
      />
    </div>
  );
};

export default Orders;
