import { DownOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Image, Popover, Space, Spin, Table, Tag, Tooltip, Modal, message, DatePicker, Form, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import dayjs from 'dayjs';
import { statusOrder } from '../../constants/index';
import { useShopsOrder } from '../../store/ordersStore';
import { getPathByIndex } from '../../utils';
import { formatDate } from '../../utils/date';

import PageTitle from '../../components/common/PageTitle';
import OrderCombinable from './OrderCombinable';

const { RangePicker } = DatePicker;
const rangePresets = [
  { label: 'Today', value: [dayjs().add(0, 'd'), dayjs()] },
  { label: 'Yesterday', value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')] },
  { label: 'Last 7 days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 days', value: [dayjs().add(-30, 'd'), dayjs()] },
  // { label: "3 tháng trước", value: [dayjs().add(-90, "d"), dayjs()] },
  // { label: "1 năm trước", value: [dayjs().add(-365, "d"), dayjs()] },
];

function Orders() {
  const shopId = getPathByIndex(2);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openFilterDate, setOpenFilterDate] = useState(false);
  const [openOrderCustom, setOpenOrderCustom] = useState(false);
  const [orderCustomEdit, setOrderCustomEdit] = useState({});
  const [searchText, setSearchText] = useState('');
  const [orderSelected, setOrderSelected] = useState([]);
  const [orderDataTable, setOrderDataTable] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const {
    orders,
    getAllOrders,
    getAllCombine,
    combineList,
    createLabel,
    shippingService,
    getPackageBought,
    packageBought,
    getShippingDoc,
    loading,
    loadingFulfillment
  } = useShopsOrder((state) => state);

  const sortByPackageId = (arr) => {
    const grouped = arr.reduce((acc, item) => {
      const key = item.package_list.length > 0 ? item.package_list[0].package_id : null;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    const sortedGroups = Object.values(grouped).sort((a, b) => {
      if (a[0].package_id < b[0].package_id) return -1;
      if (a[0].package_id > b[0].package_id) return 1;
      return 0;
    });

    const sortedArray = [].concat(...sortedGroups);
    return sortedArray;
  };

  const renderListItemProduct = (record) => {
    const { item_list } = record;
    return item_list.map((item, index) => {
      return (
        <div key={index}>
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
                  <p className="font-semibold line-clamp-1">{item.product_name}</p>
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

  const onRangeChange = (dates, dateStrings, confirm, dataIndex, setSelectedKeys, selectedKeys) => {
    confirm();
    setSelectedKeys(dateStrings);
    setSearchText(dateStrings);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    // eslint-disable-next-line react/no-unstable-nested-components
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => {
      return (
        <div onKeyDown={(e) => e.stopPropagation()} className="px-5 py-3">
          <RangePicker
            popupClassName="text-[12px]"
            presets={[...rangePresets]}
            format="DD/MM/YYYY"
            onOk={false}
            onChange={(date, dateStrings) => onRangeChange(date, dateStrings, confirm, dataIndex, setSelectedKeys, selectedKeys)}
          />
  
          <Space className="mt-3 ml-3">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
                close();
                setOpenFilterDate(false);
              }}
            >
              Tìm kiếm
            </Button>
  
            <Button
              size="small"
              onClick={() => {
                clearFilters();
                setSearchText('');
                confirm({
                  closeDropdown: false,
                });
                close();
                setOpenFilterDate(false);
              }}
            >
              Xoá
            </Button>
          </Space>
        </div>
      )
    },

    // eslint-disable-next-line react/no-unstable-nested-components
    filterIcon: (filtered) => <SearchOutlined onClick={() => setOpenFilterDate(!openFilterDate)} className={filtered ? '#1677ff' : undefined} />,
    filterDropdownOpen: openFilterDate,

    onFilter: (value, record) => {
      if (searchText.length === 2) {
        const startDate = dayjs(searchText[0], 'DD/MM/YYYY').startOf('day').valueOf();
        const endDate = dayjs(searchText[1], 'DD/MM/YYYY').endOf('day').valueOf();
        const createTime = Number(record[dataIndex]);
        return createTime.valueOf() >= startDate && createTime.valueOf() <= endDate;
      }
      
      return false;
    },
    render: (text) => formatDate(Number(text), 'DD/MM/YYYY, hh:mm:ss a'),
  });

  const handleGetAllCombine = () => {
    const onSuccess = (res) => {
      if (res && res.data.data.total !== 0) {
        setOpen(true);
      } else {
        messageApi.open({
          type: 'warning',
          content: 'Không tìm thấy order nào có thể gộp',
        });
      }
    };

    const onFail = (err) => {
      console.log(err);
    };

    getAllCombine(shopId, onSuccess, onFail);
  };

  const handleOpenModal = (isOpenModal) => {
    setOpen(isOpenModal);
    getAllOrders(shopId);
  };

  const handleOpenModalOrderCustom = (orderId) => {
    const orderCustom = orderDataTable.find((order) => order.order_id === orderId);
    setOpenOrderCustom(true);
    setOrderCustomEdit(orderCustom);
  }

  const onFinishOrderCustom = (values) => {
    const valuesArray = Object.values(values);
    const orderCustomTable = orderDataTable.map((order) => {
      const newOrder = {...order};
      if (newOrder.order_id === orderCustomEdit.order_id) {
        const itemListUpdate = valuesArray.map((value) => {
          const checkOrderEdit = order.item_list?.find(item => item.sku_id === value.sku_id);
          return {
            ...checkOrderEdit,
            sku_name: value.sku_name
          }
        })

        newOrder.item_list = itemListUpdate;
      }

      return newOrder;
    });
    setOrderDataTable(orderCustomTable);
    setOpenOrderCustom(false);
  }

  const handleCreateLabels = () => {
    const onSuccess = (res) => {
      if (res) {
        let dataUpdate;
        const promises = res.map((item, index) => {
          return new Promise((resolve, reject) => {
            const packageId = {
              package_id: item.data.package_id,
            };
            const onSuccessShipping = (resShipping) => {
              if (resShipping) {
                const dataOrderCombine = res
                  .map((itemCombine) => ({
                    data: {
                      ...itemCombine.data,
                      order_info_list: itemCombine.data.order_info_list.map((itemCombineOrder) =>
                        orderDataTable.find((order) => order.order_id === itemCombineOrder.order_id),
                      ),
                    },
                  }))
                  .flat();

                dataUpdate = [...dataOrderCombine];

                const dataCreateLabel = dataUpdate.find((resItem) => resItem.data.package_id === packageId.package_id);
                dataCreateLabel.data.shipping_provider = resShipping.data[0].name;
                dataCreateLabel.data.shipping_provider_id = resShipping.data[0].id;
                dataUpdate[index] = dataCreateLabel;
                resolve();
              }
            };
            shippingService(shopId, packageId, onSuccessShipping, (err) => {
              console.log(err);
              reject(err);
            });
          });
        });

        Promise.all(promises)
          .then(() => {
            navigate(`/shops/${shopId}/orders/create-label`, { state: { dataCombine: dataUpdate } });
          })
          .catch(() => {
            messageApi.open({
              type: 'error',
              content: 'Lỗi khi lấy thông tin vận chuyển',
            });
          });
      }
    };
    createLabel(shopId, orderSelected, onSuccess, () => {});
  };

  const handleStartFulfillment = () => {
    const ordersHasPackageId = orderDataTable.filter((order) => order.package_list.length > 0);
    const orderBoughtLabel = packageBought
      .map((item) => ordersHasPackageId.filter((order) => item.package_id === order.package_list[0].package_id))
      .filter((item) => item.length);

    const orderBoughtLabelUnique = packageBought
      .map((item) => ordersHasPackageId.find((order) => item.package_id === order.package_list[0].package_id))
      .filter((item) => item !== undefined);

    const packageIds = {
      package_ids: orderBoughtLabelUnique.map((item) => item.package_list[0].package_id),
    };

    const onSuccess = (res) => {
      if (res) {
        const shippingDocData = orderBoughtLabel.map((item, index) => ({
          order_list: item,
          label: res.doc_urls[index],
          package_id: item[0].package_list[0].package_id,
        }));
        navigate(`/shops/${shopId}/orders/fulfillment`, { state: { shippingDoc: shippingDocData } });
      }
    };

    getShippingDoc(shopId, packageIds, onSuccess, (err) => console.log(err));
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      const selectedRowsPackageId = selectedRows.map((item) => item.package_list[0].package_id);
      setOrderSelected(selectedRowsPackageId);
    },
    // getCheckboxProps: (record) => {
    //   const disabledStatus = [140, 130, 122, 121, 105, 100];
    //   const disabledLabel = packageBought.map((item) => item.package_id);

    //   const isDisabledStatus = disabledStatus.includes(record.order_status);
    //   const isDisabledLabel = disabledLabel.includes(
    //     record.package_list.length > 0 && record.package_list[0].package_id,
    //   );

    //   return {
    //     disabled: isDisabledStatus || isDisabledLabel,
    //   };
    // },
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
    },
    {
      title: 'Package ID',
      dataIndex: 'package_id',
      key: 'package_id',
      align: 'center',
      render: (_, record) =>
        record.package_list.length > 0 ? record.package_list[0].package_id : 'Hiện chưa có package ID',
      // eslint-disable-next-line consistent-return
      onCell: (record, index) => {
        const rowSpanData = orderDataTable.filter((item) => item.package_id === record.package_id && item.package_id !== null);
        const orderIdRowSpanData = rowSpanData.map((item) => {
          return {
            ...item,
            order_position: item.order_id === record.order_id ? index : null,
            // key: item.order_id === record.order_id ? item.key : '',
          };
        });            

        if (rowSpanData.length > 1) {
          if (index === orderIdRowSpanData[0].order_position) {
            return {
              rowSpan: rowSpanData.length,
            };
          }
          return {
            rowSpan: 0,
          };
        } else {
          return {
            rowSpan: 1,
          };
        }
      },
    },
    {
      title: 'Mã đơn',
      dataIndex: 'order_code',
      key: 'order_code',
      render: (_, record) => (
        <Link to={`/shops/${shopId}/orders/${record?.order_id}`} state={{ orderData: record }} className="font-medium">
          {record?.order_id}{' '}
          <p style={{ fontSize: 11, color: 'grey' }}>
            {' '}
            {formatDate(record.update_time * 1000, 'DD/MM/YYYY, h:mm:ss a')}{' '}
          </p>
        </Link>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'item',
      key: 'item',
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
              <p className="text-[13px] font-semibold">{record?.item_list?.length} sản phẩm</p>
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
                  <img src={item?.sku_image} className="w-[26px] h-[26px] object-cover" />
                </div>
              ))}
            </div>
          </div>
        </Popover>
      ),
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'order_status',
      key: 'order_status',
      onFilter: (value, record) => record.order_status === value,
      filters: statusOrder?.map((item) => ({
        text: item.title,
        value: item.value,
      })),
      render: (text) => statusOrder.map((item) => item.value === text && <Tag color={item.color}>{item.title}</Tag>),
    },
    {
      title: 'Thời gian tạo đơn',
      dataIndex: 'create_time',
      key: 'create_time',
      ...getColumnSearchProps('create_time'),
    },
    {
      title: 'Vận chuyển',
      dataIndex: 'shipping_provider',
      key: 'shipping_provider',
    },
    {
      title: 'Action (Cho đơn custom)',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Tooltip placement="top" title="Thêm thông tin đơn hàng">
          <Button onClick={() => handleOpenModalOrderCustom(record.order_id)}><EditOutlined /></Button>
        </Tooltip>
      )
    },
  ];

  useEffect(() => {
    const onSuccess = (res) => {
      if (res) {
        const orderList = res?.flatMap((order) => order?.data?.order_list);
        const orderListSort = sortByPackageId(orderList).map((item, index) => ({
          key: index + 1,
          package_id: item.package_list.length ? item.package_list[0].package_id : null,
          ...item,
        }));
        setOrderDataTable(orderListSort)
      }
    };
    const onFail = () => {};
    getAllOrders(shopId, onSuccess, onFail);
    getPackageBought();
    
  }, [location.state, shopId]);

  return (
    <div className="p-3 md:p-10">
      {contextHolder}
      <PageTitle title="Danh sách đơn hàng" showBack count={orderDataTable?.length ? orderDataTable?.length : '0'} />
      <Space className="mb-3">
        <Button type="primary" onClick={handleGetAllCombine}>
          Get All Combinable
        </Button>
        <Button type="primary" onClick={handleStartFulfillment}>
          Fulfillment
          {loadingFulfillment && <Spin indicator={<LoadingOutlined className="text-white ml-3" />} />}
        </Button>
        <Button type="primary" onClick={handleCreateLabels} disabled={!orderSelected.length}>
          Create Label &nbsp;<span>({orderSelected.length})</span>
          {orderSelected.length > 0 && loading && <Spin indicator={<LoadingOutlined className="text-white ml-3" />} />}
        </Button>
      </Space>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        scroll={{ x: true }}
        columns={columns}
        dataSource={orderDataTable}
        loading={loading || loadingFulfillment}
        bordered
        pagination={{
          pageSize: 30,
          total: orderDataTable.length,
        }}
      />

      <Modal title="Combine" centered open={open} onCancel={() => setOpen(false)} width={1000} footer={false}>
        <OrderCombinable
          data={combineList}
          popOverContent={renderListItemProduct}
          dataOrderDetail={orderDataTable}
          isOpenModal={handleOpenModal}
        />
      </Modal>

      <Modal title={`Thêm, chỉnh sửa thông tin cho đơn custom (${orderCustomEdit.order_id})`} centered open={openOrderCustom} onCancel={() => setOpenOrderCustom(false)} width={1000} footer={false}>
        <Form onFinish={onFinishOrderCustom}>
          {orderCustomEdit?.item_list?.map((item, index) => (
            <>
              <h3 className="mb-3 text-[#1677ff]">{index+1}. {item.product_name}</h3>
              <Form.Item label='Sku id' key={index} name={[index, "sku_id"]} initialValue={item.sku_id}>
                <Input disabled/>
              </Form.Item>
              <Form.Item label='Sku' key={index} name={[index, "sku_name"]} initialValue={item.sku_name}>
                <Input placeholder='VD: White, T-shirt-S'/>
              </Form.Item>
            </>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Orders;
