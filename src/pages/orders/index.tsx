import { DeleteOutlined, DownOutlined, EditOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Popover,
  Radio,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import { RangeValue } from 'rc-picker/lib/interface';
import { statusOrder } from '../../constants/index';
import { useShopsOrder } from '../../store/ordersStore';
import { getPathByIndex } from '../../utils';
import { formatDate } from '../../utils/date';

import PageTitle from '../../components/common/PageTitle';
import OrderCombinable from './OrderCombinable';
import { OrderDistrictInfo, orderLineList, packageList, PaymentInfo, recipientAddress } from '../../types';
import { orderDetail, itemList } from '../../types/order';

const { RangePicker } = DatePicker;
const rangePresets = [
  { label: 'Today', value: [dayjs().add(0, 'd'), dayjs()] },
  { label: 'Yesterday', value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')] },
  { label: 'Last 7 days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 days', value: [dayjs().add(-30, 'd'), dayjs()] },
];

function Orders() {
  const shopId = getPathByIndex(2);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [openFilterDate, setOpenFilterDate] = useState(false);
  const [reasonRejectOrder, setReasonRejectOrder] = useState('');
  const [openOrderCustom, setOpenOrderCustom] = useState(false);
  const [orderCustomEdit, setOrderCustomEdit] = useState<any>({});
  const [searchText, setSearchText] = useState<any>('');
  const [orderSelected, setOrderSelected] = useState([]);
  const [orderDataTable, setOrderDataTable] = useState<orderDetail[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const {
    getAllOrders,
    getAllCombine,
    combineList,
    createLabel,
    shippingService,
    getPackageBought,
    packageBought,
    getShippingDoc,
    cancelOrder,
    loading,
    loadingFulfillment,
    loadingRejectOrder,
  } = useShopsOrder((state) => state);
  const sortByPackageId = (arr: orderDetail[]) => {
    const grouped: { [key: string]: orderDetail[] } = arr.reduce((acc, item) => {
      const key = item.package_list.length > 0 ? item.package_list[0].package_id : null;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
    const sortedGroups = Object.values(grouped).sort((a, b) => {
      if (a[0].package_list[0].package_id < b[0].package_list[0].package_id) return -1;
      if (a[0].package_list[0].package_id > b[0].package_list[0].package_id) return 1;
      return 0;
    });
    const sortedArray = [].concat(...sortedGroups);
    return sortedArray;
  };

  const renderListItemProduct = (record: orderDetail) => {
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

  const onRangeChange: any = (
    dates: RangeValue<dayjs.Dayjs>,
    dateStrings: string,
    confirm: () => void,
    dataIndex: any,
    setSelectedKeys: (arg0: any) => void,
  ) => {
    confirm();
    setSelectedKeys(dateStrings);
    setSearchText(dateStrings);
  };

  const getColumnSearchProps = (dataIndex: any): any => ({
    // eslint-disable-next-line react/no-unstable-nested-components
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => {
      return (
        <div onKeyDown={(e) => e.stopPropagation()} className="px-5 py-3">
          <RangePicker
            popupClassName="text-[12px]"
            presets={[...rangePresets]}
            format="DD/MM/YYYY"
            onOk={false}
            onChange={(date, dateStrings) => onRangeChange(date, dateStrings, confirm, dataIndex, setSelectedKeys)}
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
      );
    },

    // eslint-disable-next-line react/no-unstable-nested-components
    filterIcon: (filtered: string) => (
      <SearchOutlined
        onClick={() => setOpenFilterDate(!openFilterDate)}
        className={filtered ? '#1677ff' : undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    ),
    filterDropdownOpen: openFilterDate,

    onFilter: (value: string, record: orderDetail) => {
      if (searchText.length === 2) {
        const startDate = dayjs(searchText[0], 'DD/MM/YYYY').startOf('day').valueOf();
        const endDate = dayjs(searchText[1], 'DD/MM/YYYY').endOf('day').valueOf();
        const createTime = Number(record[dataIndex]);
        return createTime.valueOf() >= startDate && createTime.valueOf() <= endDate;
      }

      return false;
    },
    render: (text: string) => formatDate(Number(text), 'DD/MM/YYYY, hh:mm:ss a'),
  });

  const handleGetAllCombine = () => {
    const onSuccess = (res: any) => {
      if (res && res.data.data.total !== 0) {
        setOpen(true);
      } else {
        messageApi.open({
          type: 'warning',
          content: 'Không tìm thấy order nào có thể gộp',
        });
      }
    };

    const onFail = (err: string) => {
      console.log(err);
    };

    if (shopId) getAllCombine(shopId, onSuccess, onFail);
  };

  const handleOpenModal = (isOpenModal: boolean) => {
    setOpen(isOpenModal);
    if (shopId) getAllOrders(shopId);
  };

  const handleOpenModalOrderCustom = (orderId: string) => {
    const orderCustom: any = orderDataTable.find((order: orderDetail) => order.order_id === orderId);
    if (orderCustom) {
      const formData = orderCustom.item_list.map((item: itemList) => ({
        sku_id: item.sku_id,
        sku_name: item.sku_name,
      }));
      form.setFieldsValue(formData);
      setOpenOrderCustom(true);
      setOrderCustomEdit(orderCustom);
    } else {
      messageApi.open({
        type: 'warning',
        content: 'Không tìm thấy dữ liệu',
      });
    }
  };

  const onFinishOrderCustom = (values: any) => {
    const valuesArray = Object.values<any>(values);
    const orderCustomTable = orderDataTable.map((order: orderDetail) => {
      const newOrder = { ...order };
      if (newOrder.order_id === orderCustomEdit.order_id) {
        const itemListUpdate = valuesArray.map((value) => {
          const checkOrderEdit: any = order.item_list?.find((item: any) => item.sku_id === value.sku_id);
          return {
            ...checkOrderEdit,
            sku_name: value.sku_name,
          };
        });

        newOrder.item_list = itemListUpdate;
      }

      return newOrder;
    });

    setOrderDataTable(orderCustomTable);
    setOpenOrderCustom(false);
  };

  const handleCreateLabels = () => {
    const onSuccess = (res) => {
      if (res) {
        const resConvert = res.map((resItem: { data: any }) => ({
          data: {
            ...resItem.data,
            shipping_provider: 'USPS Ground Advantage™',
            shipping_provider_id: '7208502187360519982',
          },
        }));

        const dataUpdate = [...resConvert];
        const promises = dataUpdate.map((item, index) => {
          return new Promise((resolve, reject) => {
            const packageId = {
              package_id: item.data.package_id,
            };
            const onSuccessShipping = (resShipping: {
              data: {
                name: any;
                id: any;
              }[];
            }) => {
              if (resShipping) {
                const dataOrderCombine = resConvert
                  .map((itemCombine: { data: { order_info_list: any[] } }) => ({
                    data: {
                      ...itemCombine.data,
                      order_info_list: itemCombine.data.order_info_list.map((itemCombineOrder: { order_id: any }) =>
                        orderDataTable.find((order) => order.order_id === itemCombineOrder.order_id),
                      ),
                    },
                  }))
                  .flat();

                const dataCreateLabel = dataOrderCombine.find(
                  (resItem: { data: { package_id: any } }) => resItem.data.package_id === packageId.package_id,
                );
                if (dataCreateLabel) {
                  dataCreateLabel.data.shipping_provider = resShipping.data[0].name;
                  dataCreateLabel.data.shipping_provider_id = resShipping.data[0].id;
                  dataUpdate[index] = dataCreateLabel;
                  resolve();
                }
              }
              // console.log('dataUpdate: ', index, dataUpdate[index], dataUpdate);
            };

            shippingService(shopId, packageId, onSuccessShipping, (err) => {
              console.log('err: ', resConvert);
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
              content: 'Không lấy được thông tin vận chuyển. Đang sử dụng đơn vị vận chuyển mặc định',
            });
            navigate(`/shops/${shopId}/orders/create-label`, { state: { dataCombine: resConvert } });
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

  const handleCancelOrder = (orderId: string) => {
    const dataSubmit = {
      cancel_reason_key: reasonRejectOrder,
      order_id: orderId,
    };

    const onSuccess = (res: any) => {
      if (res) {
        if (res.data !== null) {
          messageApi.open({
            type: 'success',
            content: 'Huỷ đơn thành công!',
          });
        } else {
          messageApi.open({
            type: 'warning',
            content: res.message,
          });
        }
      }
    };

    const onFail = (err: string) => {
      message.open({
        type: 'error',
        content: `Huỷ đơn thất bại. ${err}`,
      });
    };

    if (shopId) cancelOrder(shopId, dataSubmit, onSuccess, onFail);
  };

  const contentRejectOrder = (
    <div>
      <h3 className="mb-2">Select cancellation reason: </h3>
      <Radio.Group onChange={(e) => setReasonRejectOrder(e.target.value)} value={reasonRejectOrder}>
        <Space direction="vertical">
          <Radio value="seller_cancel_reason_out_of_stock">Out of stock</Radio>
          <Radio value="seller_cancel_reason_wrong_price">Pricing error</Radio>
          <Radio value="seller_cancel_paid_reason_address_not_deliver">Unable to deliver to buyer address</Radio>
          <Radio value="seller_cancel_paid_reason_buyer_requested_cancellation">Buyer requested cancellation</Radio>
        </Space>
      </Radio.Group>
    </div>
  );

  const rowSelection = {
    onChange: (_: any, selectedRows: any[]) => {
      const selectedRowsPackageId = selectedRows.map(
        (item: { package_list: { package_id: any }[] }) => item.package_list[0].package_id,
      );
      const uniqueArray = Array.from(new Set(selectedRowsPackageId));
      setOrderSelected(uniqueArray);
    },
    getCheckboxProps: (record: { order_status: number; package_list: string | any[] }) => {
      const disabledStatus = [140, 130, 122, 121, 105, 100];
      const disabledLabel = packageBought.map((item) => item.package_id);

      const isDisabledStatus = disabledStatus.includes(record.order_status);
      const isDisabledLabel = disabledLabel.includes(
        record.package_list.length > 0 && record.package_list[0].package_id,
      );

      return {
        disabled: isDisabledStatus || isDisabledLabel,
      };
    },
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
      render: (_: any, record: { package_list: string | any[] }) =>
        record.package_list.length > 0 ? record.package_list[0].package_id : 'Hiện chưa có package ID',
      // eslint-disable-next-line consistent-return
      onCell: (record: { package_id: any; order_id: any }, index: any) => {
        const rowSpanData = orderDataTable.filter(
          (item) => item.package_id === record.package_id && item.package_id !== null,
        );
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
        }
        return {
          rowSpan: 1,
        };
      },
    },
    {
      title: 'Mã đơn',
      dataIndex: 'order_code',
      key: 'order_code',
      render: (
        _: any,
        record: {
          order_id:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | null
            | undefined;
          update_time: number;
        },
      ) => (
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
      render: (
        _: any,
        record: {
          item_list: any;
          buyer_email?: string;
          buyer_message?: string | undefined;
          buyer_uid?: string;
          cancel_order_sla?: number;
          create_time?: string;
          delivery_option?: string;
          delivery_option_description?: string;
          delivery_option_id?: string;
          delivery_option_type?: number;
          delivery_sla?: number;
          district_info_list?: OrderDistrictInfo[];
          ext_status?: number;
          fulfillment_type?: number;
          is_cod?: boolean;
          is_sample_order?: boolean;
          order_id?: string;
          order_line_list?: orderLineList[];
          order_status?: number;
          package_list?: packageList[];
          paid_time?: number;
          payment_info?: PaymentInfo;
          payment_method?: string;
          payment_method_name?: string;
          payment_method_type?: number;
          receiver_address_updated?: number;
          recipient_address?: recipientAddress;
          rts_sla?: number;
          shipping_provider?: string;
          shipping_provider_id?: string;
          tracking_number?: string;
          tts_sla?: string;
          update_time?: string;
          warehouse_id?: string;
        },
      ) => (
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
                <DownOutlined
                  className="text-[12px]"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </p>
            </div>
            <div className="-my-[12px] flex gap-1">
              {record?.item_list?.map(
                (item: { sku_image: string | undefined }, index: React.Key | null | undefined) => (
                  <div
                    key={index}
                    className=" last:border-b-0 py-1 px-[8px] -mx-[8px] h-[53px] flex flex-wrap items-center"
                  >
                    <img src={item?.sku_image} className="w-[26px] h-[26px] object-cover" />
                  </div>
                ),
              )}
            </div>
          </div>
        </Popover>
      ),
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'order_status',
      key: 'order_status',
      onFilter: (value: any, record: { order_status: any }) => record.order_status === value,
      filters: statusOrder?.map((item) => ({
        text: item.title,
        value: item.value,
      })),
      render: (text: number) =>
        statusOrder.map((item) => item.value === text && <Tag color={item.color}>{item.title}</Tag>),
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
      title: 'Action (Cho đơn vật lý hoặc custom)',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_: any, record: { order_id: string }) => (
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Tooltip
            placement="top"
            title="Thêm thông tin đơn hàng"
            className="cursor-pointer w-[30px] h-[30px] leading-[30px]"
          >
            <span onClick={() => handleOpenModalOrderCustom(record.order_id)}>
              <EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </span>
          </Tooltip>

          <Tooltip placement="top" title="Huỷ đơn">
            <Popconfirm
              placement="left"
              title={contentRejectOrder}
              onConfirm={() => handleCancelOrder(record.order_id)}
              className="w-[30px] h-[30px] leading-[30px]"
            >
              <DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const onSuccess = (res: any) => {
      if (res) {
        const orderList: any = res?.flatMap((order: { data: { order_list: any } }) => order?.data?.order_list);
        const orderListSort: any = sortByPackageId(orderList).map((item: any, index: number) => ({
          key: index + 1,
          package_id: item.package_list.length ? item.package_list[0].package_id : null,
          ...item,
        }));
        setOrderDataTable(orderListSort);
      }
    };
    const onFail = () => {};
    if (shopId) getAllOrders(shopId, onSuccess, onFail);
    getPackageBought();
  }, [location.state, shopId]);

  return (
    <div className="p-3 md:p-10">
      {contextHolder}
      <PageTitle
        title="Danh sách đơn hàng"
        showBack
        count={orderDataTable?.length ? Number(orderDataTable?.length) : 0}
      />
      <Space className="mb-3">
        <Button type="primary" onClick={handleGetAllCombine}>
          Get All Combinable
        </Button>
        <Button type="primary" onClick={handleStartFulfillment}>
          Fulfillment
          {loadingFulfillment && (
            <Spin
              indicator={
                <LoadingOutlined
                  className="text-white ml-3"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              }
            />
          )}
        </Button>
        <Button type="primary" onClick={handleCreateLabels} disabled={!orderSelected.length}>
          Create Label &nbsp;<span>({orderSelected.length})</span>
          {orderSelected.length > 0 && loading && (
            <Spin
              indicator={
                <LoadingOutlined
                  className="text-white ml-3"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              }
            />
          )}
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
        loading={loading || loadingFulfillment || loadingRejectOrder}
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

      <Modal
        title={`Thêm, chỉnh sửa thông tin cho đơn custom (${orderCustomEdit.order_id})`}
        centered
        open={openOrderCustom}
        onCancel={() => setOpenOrderCustom(false)}
        width={1000}
        footer={false}
      >
        <Form onFinish={onFinishOrderCustom} form={form}>
          {orderCustomEdit?.item_list?.map((item: any, index: number) => (
            <>
              <h3 className="mb-3 text-[#1677ff]">
                {index + 1}. {item.product_name}
              </h3>
              <Form.Item label="Sku id" key={index} name={[index, 'sku_id']} initialValue={item.sku_id}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="Sku" key={index} name={[index, 'sku_name']} initialValue={item.sku_name}>
                <Input placeholder="VD: White, T-shirt-S" />
              </Form.Item>
            </>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Orders;
