import { DownOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Popover, Table } from 'antd';
import React, { useState } from 'react';
import { useShopsOrder } from '../../store/ordersStore';
import { getPathByIndex, IntlNumberFormat } from '../../utils';
import { orderDetail } from '../../types';

interface removeCombineItemProps {
  order_id_list: string[];
  pre_combine_pkg_id: string;
}

interface DataProps {
  more: boolean;
  next_cursor: string;
  pre_combine_pkg_list: removeCombineItemProps[];
  total: number;
}

interface OrderCombinableProps {
  data: DataProps;
  popOverContent: any;
  dataOrderDetail: orderDetail[];
  isOpenModal: any;
}

function OrderCombinable({ data, popOverContent, dataOrderDetail, isOpenModal }: OrderCombinableProps) {
  const shopId = getPathByIndex(2);
  const { confirmCombine } = useShopsOrder((state) => state);
  const [dataCombine, setDataCombine] = useState(data.pre_combine_pkg_list);

  const handleRemoveCombineItem = (CombinePkgId: string, orderId: string) => {
    const dataRemoved = dataCombine.map((item: removeCombineItemProps) => {
      return {
        pre_combine_pkg_id: item.pre_combine_pkg_id,
        order_id_list:
          item.pre_combine_pkg_id === CombinePkgId
            ? item.order_id_list.filter((order: any) => order !== orderId)
            : item.order_id_list,
      };
    });

    // console.log('dataRemoved: ', dataRemoved);
    setDataCombine(dataRemoved);
  };

  const handleCombineSubmit = () => {
    const dataCombineConfirm = {
      pre_combine_pkg_list: dataCombine,
    };

    const onSuccess = (res: any) => {
      if (res) {
        isOpenModal(false);
      }
    };

    const onFail = (err: string) => {
      console.log(err);
    };

    if (shopId) confirmCombine(shopId, dataCombineConfirm, onSuccess, onFail);
  };

  const columnsOrderCombine: any = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'item',
      key: 'item',
      render: (_: any, record: any) => (
        <Popover
          content={popOverContent(record)}
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
              {record?.item_list?.map((item: any, index: number) => (
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
      title: 'Tổng',
      dataIndex: 'payment_info',
      key: 'payment_info',
      align: 'center',
      render: (_: any, record: any) =>
        IntlNumberFormat(record?.payment_info?.currency, 'currency', 5, record?.payment_info?.total_amount),
    },
    {
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xoá order này?"
          onConfirm={() => handleRemoveCombineItem(record.pre_combine_pkg_id, record.order_id)}
        >
          <a href="##">Delete</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      {dataCombine?.map((item, index) => {
        const orderCombine = item.order_id_list
          .map((orderItem) => dataOrderDetail?.filter((orderTableItem) => orderTableItem.order_id === orderItem))
          .flat();

        const orderCombineConvert = orderCombine.map((item2) => ({
          ...item2,
          pre_combine_pkg_id: item.pre_combine_pkg_id,
        }));

        return (
          <div key={index} className="mb-10">
            <Table columns={columnsOrderCombine} dataSource={orderCombineConvert} bordered pagination={false} />
          </div>
        );
      })}
      <div className="flex flex-wrap items-center justify-end gap-10">
        <Button type="primary" htmlType="submit" onClick={handleCombineSubmit}>
          Submit
        </Button>
      </div>
    </>
  );
}

export default OrderCombinable;
