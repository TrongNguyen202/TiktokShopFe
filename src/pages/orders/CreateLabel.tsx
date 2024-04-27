import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Popover, Image, Button, Modal, Form, Input, Radio, Space, Spin, message } from 'antd';
import { DownOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';

import { getPathByIndex } from '../../utils';
import { OrderPackageWeightSize } from '../../constants';
import { CreateLabelData, CreateLabelType, orderDetail, shippingService } from '../../types/order';

import { useShopsOrder } from '../../store/ordersStore';

function CreateLabel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dataCombine } = location.state;
  const shopId = getPathByIndex(2);
  const [open, setOpen] = useState(false);
  const [startFulfillment, setStartFulfillment] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [shippingServiceData, setShippingServiceData] = useState([]);
  const [dataSizeChart, setDataSizeChart] = useState(OrderPackageWeightSize);
  const [buyLabelSelected, setBuyLabelSelected] = useState<CreateLabelType[]>([]);
  const { buyLabel, shippingService, getShippingDoc, getPackageBought, loading } = useShopsOrder((state) => state);
  const [messageApi, contextHolder] = message.useMessage();
  const dataSizeChartConvert = dataSizeChart
    .map((sizeChart) =>
      sizeChart.items.map((item, index) => ({
        ...item,
        type: sizeChart.name,
        rowSpan: index === 0 ? sizeChart.items.length : 0,
      })),
    )
    .flat();
  const dataCombineConvert = dataCombine.map((item: any, index: number) => ({
    key: index + 1,
    ...item,
  }));

  const dataTableWeightSize = (dataInput: CreateLabelType[]) => {
    const labelItems = dataInput.map((label: CreateLabelType) => {
      const orderList = label.data.order_info_list?.map((order: orderDetail) => {
        const orderItemList = order?.item_list || order?.sku_list;
        const productList = orderItemList?.map((product) => {
          let variationSize = '';
          const variationSplit: any = product?.sku_name.split(',').map((item) => item.trim());
          if (variationSplit.length === 3) {
            variationSize = (variationSplit[1] - variationSplit[2]).toString();
          } else {
            variationSize = variationSplit[1];
          }

          const variationSizeSplit = variationSize?.split(/[\s,-]/).filter(Boolean);

          let orderPackageList = dataSizeChart?.find((variant) =>
            variationSizeSplit?.find((item) => item.toUpperCase() === variant.name.toUpperCase()),
          );

          if (orderPackageList === undefined) {
            orderPackageList = dataSizeChart.find((orderPackage) => orderPackage.name === 'shirt');
          }

          let orderPackageSizeChart = orderPackageList?.items.find((orderPackage) =>
            variationSizeSplit?.find((item) => item.toUpperCase() === orderPackage.name.toUpperCase()),
          );

          if (orderPackageSizeChart === undefined) {
            orderPackageSizeChart = dataSizeChart.find((orderPackage) => orderPackage.name === 'shirt')?.items[0];
          }

          const orderPackageWeight = Number(orderPackageSizeChart?.weight) * Number(product.quantity);
          const orderPackageSize = orderPackageSizeChart?.size;
          return { orderPackageWeight, orderPackageSize };
        });

        let sumWeight = productList
          ?.map((product) => product.orderPackageWeight)
          .reduce((partialSum, current) => partialSum + current, 0);
        sumWeight = parseFloat(sumWeight.toFixed(4));
        const sumSize = orderItemList.length > 1 ? '10x10x3'.split('x') : productList[0]?.orderPackageSize?.split('x');
        return { sumWeight, sumSize };
      });

      let packageWeight = orderList
        .map((item: any) => parseFloat(item.sumWeight))
        .reduce((partialSum, current) => partialSum + current, 0);
      packageWeight = parseFloat(packageWeight.toFixed(4));
      const sumPackageCombine = {
        package_weight: packageWeight,
        package_size: orderList.length > 1 ? '10x10x3'.split('x') : orderList[0]?.sumSize,
      };

      return {
        ...label,
        package_weight: sumPackageCombine.package_weight,
        package_size: sumPackageCombine.package_size,
      };
    });
    return labelItems;
  };

  useEffect(() => {
    const updatedTableData = dataTableWeightSize(dataCombineConvert);
    setTableData(updatedTableData);
    getPackageBought();
  }, [dataCombine, dataSizeChart]);

  const renderListItemProduct = (data: CreateLabelData) => {
    const skuList = data.order_info_list.map((item: orderDetail) => (item.item_list ? item.item_list : item.sku_list));
    return skuList.map((skuItem: any, index: number) => {
      return (
        <>
          {skuItem.map((item: any) => (
            <div key={index}>
              <div className="flex justify-between items-center gap-3 mt-3 w-[400px]">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Image src={item.sku_image} className="object-cover mt-1 flex-1" width={50} height={50} />
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-500">{item.sku_name}</p>
                    <p className="text-[12px] text-gray-500">{item.sku_id}</p>
                  </div>
                </div>
                <p className="font-semibold">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </>
      );
    });
  };

  const handleUpdatePackage = (e: React.ChangeEvent<HTMLInputElement>, key: string, index: number): void => {
    const dataUpdate: any = [...tableData];
    if (key.includes('package_size')) {
      const position = parseInt(key.slice(key.lastIndexOf('_') + 1), 10);
      dataUpdate[index].package_size[position] = e.target.value;
    } else {
      dataUpdate[index][key] = parseFloat(e.target.value);
    }
    setTableData(dataUpdate);
  };

  const handleUpdateSizeChart = (values: any) => {
    const hasTypePosition = Object.keys(values)
      .map((key) => ({ index: key, type: values[key].type }))
      .filter((item) => item.type !== undefined)
      .map((item) => parseInt(item.index));

    const sizeChartSplice = [];
    for (let i = 0; i < hasTypePosition.length - 1; i++) {
      const start = hasTypePosition[i];
      const end = hasTypePosition[i + 1];
      const spliceData = Object.values(values).slice(start, end);
      sizeChartSplice.push(spliceData);
    }

    const result = Object.values(values).slice(hasTypePosition[hasTypePosition.length - 1]);
    sizeChartSplice.push(result);
    const sizeChartUpdate = sizeChartSplice.map((itemUpdate: any) => ({
      name: itemUpdate[0].type,
      items: itemUpdate.map((item: any) => ({
        name: item.name,
        weight: item.weight,
        size: item.size,
      })),
    }));
    setDataSizeChart(sizeChartUpdate);
    setOpen(false);
  };

  const contentPopover = (data: string[], key: string, index: number) => {
    return (
      <>
        {key === 'size' && (
          <>
            <div className="mb-3">
              <label>Package length</label>
              <Input
                name="length"
                suffix="in"
                defaultValue={data[0]}
                onChange={(e) => handleUpdatePackage(e, 'package_size_0', index)}
              />
            </div>
            <div className="mb-3">
              <label>Package width</label>
              <Input
                name="width"
                suffix="in"
                defaultValue={data[1]}
                onChange={(e) => handleUpdatePackage(e, 'package_size_1', index)}
              />
            </div>
            <div className="mb-3">
              <label>Package height</label>
              <Input
                name="height"
                suffix="in"
                defaultValue={data[2]}
                onChange={(e) => handleUpdatePackage(e, 'package_size_2', index)}
              />
            </div>
          </>
        )}

        {key === 'weight' && (
          <div className="mb-3">
            <label>Package weight</label>
            <Input
              name="length"
              suffix="lb"
              defaultValue={data}
              onChange={(e) => handleUpdatePackage(e, 'package_weight', index)}
            />
          </div>
        )}
      </>
    );
  };

  const handleGetShippingService = (newStatus: boolean, packageId: string) => {
    const onSuccess = (res: any) => {
      if (res) {
        const shippingService = res.data;
        setShippingServiceData(shippingService);
      }
    };

    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: `Không lấy được thông tin vận chuyển khác. ${err}`,
      });
    };

    if (newStatus === true && shopId) {
      shippingService(shopId, packageId, onSuccess, onFail);
    }
  };

  const handleChangeShippingService = (e: any, index: number) => {
    const shippingService = e.target.value.split('-');
    const dataShippingServiceUpdate = [...tableData];
    dataShippingServiceUpdate[index].data.shipping_provider_id = shippingService[0];
    dataShippingServiceUpdate[index].data.shipping_provider = shippingService[1];
    setTableData(dataShippingServiceUpdate);
  };

  const contentPopoverShipping = (index: number) => {
    return (
      <div className="p-5">
        <Spin spinning={loading}>
          <Radio.Group onChange={(e) => handleChangeShippingService(e, index)}>
            <Space direction="vertical">
              {shippingServiceData.length > 0 &&
                shippingServiceData.map((item: shippingService) => (
                  <Radio key={item.id} value={`${item.id}-${item.name}`}>
                    {item.name}
                  </Radio>
                ))}
            </Space>
          </Radio.Group>
        </Spin>
      </div>
    );
  };

  const rowSelection = {
    onChange: (_: any, selectedRows: CreateLabelType[]) => {
      setBuyLabelSelected(selectedRows);
    },
  };

  const handleBuyLabel = () => {
    const dataBuyLabel = buyLabelSelected.map((item: any) => ({
      dimension: {
        length: item.package_size[0],
        width: item.package_size[1],
        height: item.package_size[2],
      },
      dimension_unit: 2,
      package_id: item.data.package_id,
      shipping_service_id: item.data.shipping_provider_id,
      weight: item.package_weight,
      weight_unit: 2,
    }));

    const onSuccess = () => {
      messageApi.open({
        type: 'success',
        content: 'Mua label thành công',
      });

      setStartFulfillment(true);
    };
    if (shopId) buyLabel(shopId, dataBuyLabel, onSuccess, (err) => console.log(err));
  };

  const handleStartFulfillment = () => {
    const packageIds = {
      package_ids: buyLabelSelected.map((label) => label.data.package_id),
    };

    const onSuccess = (res: any) => {
      if (res) {
        const shippingDocData = buyLabelSelected.map((item, index) => ({
          order_list: item.data.order_info_list,
          label: res.doc_urls[index],
          package_id: item.data.package_id,
        }));

        navigate(`/shops/${shopId}/orders/fulfillment`, { state: { shippingDoc: shippingDocData } });
      }
    };

    if (shopId) getShippingDoc(shopId, packageIds, onSuccess, (err) => console.log(err));
  };

  const columns: any = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
    },
    {
      title: 'Đơn hàng',
      dataIndex: 'combine_item',
      key: 'combine_item',
      render: (_: any, record: CreateLabelType) => <p>{record.data.order_info_list.length} orders combined</p>,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'items',
      key: 'items',
      render: (_: any, record: CreateLabelType) => {
        const sumItem = record.data.order_info_list
          .map((item: orderDetail) => {
            if (item.item_list && item.item_list.length > 0) {
              return item.item_list.length;
            }
            return item?.sku_list?.length ?? 0;
          })
          .reduce((partialSum: number, a: number) => partialSum + a, 0);

        return (
          <Popover
            content={renderListItemProduct(record.data)}
            trigger="click"
            placement="bottom"
            title={`Current package: ${sumItem} items`}
          >
            <div className="cursor-pointer hover:bg-gray-200 p-2 flex flex-wrap items-center">
              <div className="flex-1">
                <p>{sumItem} items</p>
                <ul className="text-ellipsis whitespace-nowrap overflow-hidden w-[180px]">
                  {record.data.order_info_list.map((item) => {
                    const orderItemList = item?.item_list || item?.sku_list;
                    return orderItemList.map((prItem) => (
                      <li key={prItem.sku_id} className="inline-block mr-3 w-10 h-10 [&:nth-child(3+n)]:hidden">
                        <img className="w-full h-full object-cover" width={30} height={30} src={prItem.sku_image} />
                      </li>
                    ));
                  })}
                </ul>
              </div>
              <DownOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </div>
          </Popover>
        );
      },
    },
    {
      title: 'Cân nặng',
      dataIndex: 'package_weight',
      key: 'package_weight',
      align: 'center',
      render: (_: any, record: any, index: number) => {
        return (
          <Popover
            title="Sửa cân nặng"
            className="flex flex-wrap items-center gap-3 cursor-pointer relative"
            trigger="click"
            content={contentPopover(record.package_weight, 'weight', index)}
          >
            <p>
              {record.package_weight} <span>lb</span>
            </p>
            <span className="cursor-pointer absolute top-[50%] right-5 -translate-y-[50%]">
              <EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </span>
          </Popover>
        );
      },
    },
    {
      title: 'Kích thước',
      dataIndex: 'package-size',
      key: 'package-size',
      align: 'center',
      render: (_: any, record: any, index: number) => {
        return (
          <Popover
            title="Sửa kích thước"
            className="flex flex-wrap items-center gap-3 cursor-pointer relative"
            trigger="click"
            content={contentPopover(record.package_size, 'size', index)}
          >
            <p>
              {record.package_size[0]} x {record.package_size[1]} x {record.package_size[2]} <span>in</span>
            </p>
            <span className="cursor-pointer absolute top-[50%] right-5 -translate-y-[50%]">
              <EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </span>
          </Popover>
        );
      },
    },
    {
      title: 'Vận chuyển',
      dataIndex: 'shipping_provider',
      key: 'shipping_provider',
      render: (_: any, record: any, index: number) => {
        const shippingServiceData = {
          package_id: record.data.package_id,
        };

        return (
          <Popover
            className="flex flex-wrap items-center gap-3 cursor-pointer relative"
            trigger="click"
            content={contentPopoverShipping(index)}
            onOpenChange={(newStatus) => handleGetShippingService(newStatus, shippingServiceData)}
          >
            <p className="flex-1">{record.data.shipping_provider}</p>
            <span className="cursor-pointer absolute top-[50%] right-5 -translate-y-[50%]">
              <EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </span>
          </Popover>
        );
      },
    },
  ];

  const columnsSizeChart: any = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (text: string, _: any, index: number) => (
        <Form.Item name={[index, 'type']} initialValue={text}>
          <Input className="pointer-events-none border-0 text-center bg-transparent" />
        </Form.Item>
      ),
      onCell: (record: any) => ({ rowSpan: record.rowSpan }),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text: string, _: any, index: number) => (
        <Form.Item name={[index, 'name']} initialValue={text}>
          <Input className="pointer-events-none border-0 text-center bg-transparent" />
        </Form.Item>
      ),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      render: (text: string, _: any, index: number) => (
        <Form.Item name={[index, 'weight']} initialValue={text}>
          <Input className="text-center" />
        </Form.Item>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      align: 'center',
      render: (text: string, _: any, index: number) => (
        <Form.Item name={[index, 'size']} initialValue={text}>
          <Input className="text-center" />
        </Form.Item>
      ),
    },
  ];

  return (
    <div className="p-10">
      {contextHolder}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-5">
        {startFulfillment && (
          <Button type="primary" onClick={handleStartFulfillment}>
            Fulfillment &nbsp;<span>({buyLabelSelected.length})</span>
            {buyLabelSelected.length > 0 && loading && (
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
        )}
        {!startFulfillment && (
          <Button type="primary" onClick={handleBuyLabel} disabled={!buyLabelSelected.length}>
            Mua Label &nbsp;<span>({buyLabelSelected.length})</span>
            {buyLabelSelected.length > 0 && loading && (
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
        )}
        <Button type="primary" onClick={() => setOpen(true)}>
          Sửa Size Chart
        </Button>
      </div>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        scroll={{ x: true }}
        columns={columns}
        dataSource={tableData}
        loading={loading}
        bordered
        pagination={{ pageSize: 100 }}
      />

      <Modal title="Size Chart" open={open} onCancel={() => setOpen(false)} width={1000} footer={false}>
        <Form name="basic" onFinish={handleUpdateSizeChart}>
          <Table dataSource={dataSizeChartConvert} columns={columnsSizeChart} bordered pagination={false} />
          <Form.Item className="text-right mt-10">
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateLabel;
