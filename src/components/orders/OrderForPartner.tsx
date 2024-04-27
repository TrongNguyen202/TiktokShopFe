import { DownOutlined, LinkOutlined, WarningOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Popover,
  Select,
  Space,
  Table,
  Tooltip,
  message,
  notification,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

import { constants as c } from '../../constants';
import { useShopsOrder } from '../../store/ordersStore';
import { getPathByIndex } from '../../utils';
import { getTokenKey, setTokenExpand } from '../../utils/auth';

import { useFlashShipStores } from '../../store/flashShipStores';
import SectionTitle from '../common/SectionTitle';
import DesignEdit from '../design-sku/DesignEdit';

type DesignSkuType = {
  results: Record<string, string>[];
};

function OrderForPartner({ toShipInfoData }: { toShipInfoData: any }) {
  const shopId = getPathByIndex(2);
  const flashShipToken = getTokenKey('flash-ship-tk');
  const flashShipTokenExpiration = getTokenKey('flash-ship-tk-expiration');
  const [messageApi, contextHolder] = message.useMessage();
  const [api, notificationContextHolder] = notification.useNotification();
  const [showLink, setShowLink] = useState(true);
  const [designSku, setDesignSku] = useState<DesignSkuType | null>(null);
  const [flashShipShipment, setFlashShipShipment] = useState(1);
  const [designSkuById, setDesignSkuById] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataOCRCheck, setDataOCRCheck] = useState([]);
  const [orderFulfillmentCompleted, setOrderFulfillmentCompleted] = useState([]);
  const [tableFlashShipSelected, setTableFlashShipSelected] = useState([]);
  const [tablePrintCareSelected, setTablePrintCareSelected] = useState([]);
  const [flashShipTable, setFlashShipTable] = useState([]);
  const [printCareTable, setPrintCareTable] = useState([]);
  const [flashShipVariants, setFlashShipVariants] = useState([]);
  const [openLoginFlashShip, setOpenLoginFlashShip] = useState(false);
  const {
    getToShipInfo,
    loadingGetInfo,
    getDesignSku,
    getDesignSkuById,
    packageCreateFlashShip,
    packageCreatePrintCare,
    packageFulfillmentCompleted,
    pdfLabelLinkSearch,
    loadingGetLink,
  } = useShopsOrder((state) => state);
  const { getFlashShipPODVariant, LoginFlashShip, createOrderFlashShip } = useFlashShipStores((state) => state);

  const checkDataPartner = (data: any) => {
    const dataCheck = data
      .map((order: any) => {
        order.order_list[0].item_list = order.order_list[0].item_list.filter(
          (item: any) => item.sku_name !== 'Default',
        );
        return order;
      })
      .filter((order: any) => order.order_list[0].item_list.length > 0);

    const orderPartnerResult = dataCheck?.map((dataItem: any) => {
      const orderPartner = { ...dataItem };
      const itemList = dataItem?.order_list?.flatMap((item: any) => item.item_list);
      const itemListRemovePhysical = itemList.filter((item: any) => item.sku_name !== 'Default');
      let isFlashShip = true;
      const variations = itemListRemovePhysical.map((variation: any) => {
        if (!isFlashShip) return variation;
        let variationObject = {};
        const result = { ...variation };
        const variationSplit = variation?.sku_name.split(',').map((item: any) => item.trim());

        if (variationSplit.length === 3) {
          variationObject = {
            color: variationSplit[0],
            size: variationSplit[1] - variationSplit[2],
          };
        } else {
          variationObject = {
            color: variationSplit[0],
            size: variationSplit[1],
          };
        }

        if (Array.isArray(variationObject) && variationObject.length < 2) {
          isFlashShip = false;
        } else {
          const variationObjectSize = (variationObject as { size?: string; color?: string })?.size
            ?.split(/[\s-,]/)
            .filter(Boolean);
          const checkProductType = flashShipVariants?.filter((variant: Record<string, unknown>) =>
            variationObjectSize?.find(
              (item) => item.toUpperCase() === (variant as { product_type?: string })?.product_type?.toUpperCase(),
            ),
          );

          if (!checkProductType.length) {
            isFlashShip = false;
          }

          if (checkProductType.length) {
            const checkColor = checkProductType.filter(
              (color: Record<string, string>) =>
                color.color.toUpperCase() ===
                (variationObject as { color?: string })?.color?.replace(' ', '').toUpperCase(),
            );

            if (checkColor.length) {
              const checkSize = checkColor.find((size: Record<string, string>) => {
                return variationObjectSize?.find((item) => item.toUpperCase() === size.size.toUpperCase());
              }) as Record<string, string> | undefined;

              if (checkSize) {
                result.variant_id = checkSize.variant_id;
              } else {
                isFlashShip = false;
              }
            } else {
              isFlashShip = false;
            }
          }
        }

        return result;
      });

      orderPartner.buyer_email = dataItem.order_list[0].buyer_email;
      orderPartner.order_list = variations;
      orderPartner.is_FlashShip = isFlashShip;
      orderPartner.order_id = dataItem.order_list
        .map((item: Record<string, unknown>, index: number) => (index !== 0 ? `-${item.order_id}` : item.order_id))
        .join('');
      return orderPartner;
    });

    const dataFlashShip = orderPartnerResult?.filter((item: Record<string, unknown>) => item.is_FlashShip);
    const dataPrintCare = orderPartnerResult?.filter((item: Record<string, unknown>) => !item.is_FlashShip);
    if (dataFlashShip.length) setFlashShipTable(dataFlashShip);
    if (dataPrintCare.length) setPrintCareTable(dataPrintCare);
  };

  const handleEditDesignSku = (skuId: string) => {
    setOpenEditModal(true);
    const onSuccess = (res: any) => {
      setDesignSkuById(res);
    };

    const onFail = () => {};
    getDesignSkuById(skuId, onSuccess, onFail);
  };

  const renderListItemProduct = (data: Record<string, string>[]) => {
    return data?.map((item, index: number) => (
      <div key={index} onClick={() => handleEditDesignSku(item.sku_id)} className="cursor-pointer">
        <div className="flex justify-between items-center gap-3 mt-3 w-[400px]">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Image src={item.sku_image} className="object-cover mt-1 flex-1" width={50} height={50} />
            </div>
            <div>
              <p className="text-[12px] text-gray-500">{item.sku_name}</p>
              <Tooltip placement="top" title={`Click vào đây để thêm design cho ${item.sku_id}`}>
                <span className="text-[12px]">{item.sku_id}</span>
              </Tooltip>
            </div>
          </div>
          <p className="font-semibold">x{item.quantity}</p>
        </div>
      </div>
    ));
  };

  const handAddDesignToShipInfoData = (data: Record<string, unknown>[]) => {
    return data.map((item: Record<string, unknown>) => {
      const orderItem =
        Array.isArray(item.order_list) &&
        item.order_list.length &&
        item.order_list.map((order) => {
          const design = designSku?.results?.find((skuItem: Record<string, string>) => skuItem.sku_id === order.sku_id);
          if (design) {
            order.image_design_front = design.image_front;
            order.image_design_back = design.image_back;
          }
          return order;
        });

      const DesignSkuItem = {
        ...item,
        order_list: orderItem,
      };
      return DesignSkuItem;
    });
  };

  const handleConvertDataPackageCreate = (data: Record<string, unknown>[], key: string, isExport: boolean) => {
    const result = data
      .map((item: any) => {
        let orderList;
        const orderFulfillmentCompletedRejected = orderFulfillmentCompleted.find(
          (order: { order_id: string }) => String(order.order_id) === item.order_id,
        );

        if (isExport) {
          orderList = item.order_list.map((order: any) => {
            const orderItem = {
              pack_id: item.package_id,
              order_id: item.order_id,
              buyer_first_name: item.name_buyer?.split(' ')[0] || '',
              buyer_last_name: item.name_buyer?.split(' ')[1] || '',
              buyer_email: item.buyer_email,
              buyer_phone: '',
              buyer_address1: item.street?.trim(),
              buyer_address2: '',
              buyer_city: item.city,
              buyer_province_code: item.state?.trim(),
              buyer_zip: item.zip_code,
              buyer_country_code: 'US',
              shipment: flashShipShipment,
              linkLabel: item.label,
              products: [
                {
                  variant_id: key === 'PrintCare' ? 'POD097' : order.variant_id,
                  printer_design_front_url: order.image_design_front || null,
                  printer_design_back_url: order.image_design_back || null,
                  quantity: order.quantity,
                  note: '',
                },
              ],
            };
            return orderItem;
          });
        } else {
          orderList = {
            pack_id: item.package_id,
            order_id: item.order_id,
            buyer_first_name: item.name_buyer?.split(' ')[0] || '',
            buyer_last_name: item.name_buyer?.split(' ')[1] || '',
            buyer_email: item.buyer_email,
            buyer_phone: '',
            buyer_address1: item.street?.trim(),
            buyer_address2: '',
            buyer_city: item.city,
            buyer_province_code: item.state?.trim(),
            buyer_zip: item.zip_code,
            buyer_country_code: 'US',
            shipment: flashShipShipment,
            linkLabel: item.label,
            products: item.order_list.map((product: any) => ({
              variant_id: key === 'PrintCare' ? 'POD097' : product.variant_id,
              printer_design_front_url: product.image_design_front || null,
              printer_design_back_url: product.image_design_back || null,
              quantity: product.quantity,
              note: '',
            })),
          };
        }

        if (
          orderFulfillmentCompletedRejected &&
          (orderFulfillmentCompletedRejected as { package_status: boolean })?.package_status === false
        ) {
          orderList.order_id = `${item.order_id}-${Math.floor(Math.random() * 10)}`;
        }
        return orderList;
      })
      .flat();
    return result;
  };

  const handleCreateOrderFlashShipAPI = () => {
    const handAddDesignToShipInfoData = tableFlashShipSelected.map((item: Record<string, []>) => {
      const orderItem = item.order_list.map((order: Record<string, string>) => {
        const design = designSku?.results?.find((skuItem) => skuItem.sku_id === order.sku_id);
        if (design) {
          order.image_design_front = design.image_front;
          order.image_design_back = design.image_back;
        }
        return order;
      });

      const flashShipItem = {
        ...item,
        order_list: orderItem,
      };
      return flashShipItem;
    });

    const orderList = handAddDesignToShipInfoData.flatMap((item) => item.order_list);
    const itemsWithNullImages = orderList.filter(
      (item) => item.image_design_front === null && item.image_design_back === null,
    );

    if (itemsWithNullImages.length > 0) {
      const productIds = itemsWithNullImages.map((product) => product.product_id);
      api.open({
        message: 'Lỗi khi tạo order',
        description: `Ảnh design mặt trước và sau của ${productIds.join(
          ', ',
        )} không thể cùng trống. Vui lòng quay lại và thêm design`,
        icon: (
          <WarningOutlined
            style={{ color: 'red' }}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ),
      });
    } else {
      const dataSubmitFlashShip = handleConvertDataPackageCreate(handAddDesignToShipInfoData, 'FlashShip', false);
      // eslint-disable-next-line array-callback-return
      dataSubmitFlashShip.map((item) => {
        const dataCreateOrder = { ...item };
        delete dataCreateOrder.package_id;
        const onCreateSuccess = (resCreate: any) => {
          if (resCreate.data !== null) {
            const dataCreateOrder = {
              ...item,
              order_code: resCreate.data,
            };

            const onSuccessPackageCreate = (resPackage: any) => {
              if (resPackage) {
                messageApi.open({
                  type: 'success',
                  content: `Tạo đơn thành công.`,
                });
                setShowLink(true);
              }
            };

            const onFailPackageCreate = () => {
              return null;
            };
            packageCreateFlashShip(String(shopId), dataCreateOrder, onSuccessPackageCreate, onFailPackageCreate);
          } else {
            api.open({
              message: `Đơn hàng ${item.order_id}`,
              description: resCreate.err,
              icon: (
                <WarningOutlined
                  style={{ color: 'red' }}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
            });
          }
        };

        const onCreateFail = (errCreate: any) => {
          messageApi.open({
            type: 'error',
            content: `Đơn hàng ${item.order_id} có lỗi : ${errCreate.err}`,
          });
        };

        createOrderFlashShip(dataCreateOrder, onCreateSuccess, onCreateFail);
      });
    }
  };

  const handleCreateOrderFlashShip = () => {
    const currentTime = Date.now();
    if (flashShipToken === null || currentTime >= parseInt(flashShipTokenExpiration || '0', 10)) {
      messageApi.open({
        type: 'error',
        content: 'Đăng nhập tài khoản Flashship để có thể tạo đơn.',
      });
      setOpenLoginFlashShip(true);
    } else {
      handleCreateOrderFlashShipAPI();
    }
  };

  const handleLoginFlashShip = (values: any) => {
    const onSuccess = (res: any) => {
      if (res) {
        setTokenExpand('flash-ship-tk', res.access_token, String(c.TOKEN_FLASH_SHIP_EXPIRATION));
        setOpenLoginFlashShip(false);
        messageApi.open({
          type: 'success',
          content: `Đăng nhập thành công. Vui lòng click lại để xem hoặc huỷ đơn`,
        });
      }
    };

    const onFail = (err: string) => {
      messageApi.open({
        type: 'error',
        content: `Đăng nhập thất bại. Vui lòng thử lại. ${err}`,
      });
    };
    LoginFlashShip(values, onSuccess, onFail);
  };

  const ExportExcelFile = (data: any, fileName: string, dataPackageCreate: any) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}-${Date.now()}.xlsx`);

    const dataPackageCreateConvert = handleConvertDataPackageCreate(dataPackageCreate, fileName, true);
    // eslint-disable-next-line array-callback-return
    dataPackageCreateConvert.map((item) => {
      if (fileName === 'PrintCare') {
        const onSuccess = (res: any) => {
          if (res) {
            messageApi.open({
              type: 'success',
              content: `Export đơn thành công.`,
            });
            setShowLink(true);
          }
        };
        packageCreatePrintCare(String(shopId), item, onSuccess, (err) => console.log(err));
      } else {
        const onSuccess = () => {
          messageApi.open({
            type: 'success',
            content: `Export đơn thành công.`,
          });
          setShowLink(true);
        };
        packageCreateFlashShip(String(shopId), item, onSuccess, (err) => console.log(err));
      }
    });
  };

  const handleExportExcelFile = (data: any, key: string) => {
    const dataLabel = {
      pdf_name: data.map((item: any) => `${item.package_id}.pdf`),
    };

    const onSuccess = (res: any) => {
      if (res) {
        const dataChangedLabelLink = data.map((item: any) => {
          const resConvert = res.flatMap((resItem: any) => resItem[0]);
          const checkPackageId = resConvert.find(
            (itemRes: any) => itemRes.name.replace('.pdf', '').toString() === item.package_id,
          );
          return {
            ...item,
            label: checkPackageId.link,
          };
        });

        const dataConvert = handAddDesignToShipInfoData(dataChangedLabelLink);
        const productItem = dataConvert
          .map((item: any) => {
            const productItem = item.order_list.map((product: any) => ({
              ...product,
              city: item.city,
              buyer_email: item.buyer_email,
              name_buyer: item.name_buyer,
              package_id: item.package_id,
              order_id: item.order_id,
              state: item.state,
              street: item.street,
              tracking_id: item.tracking_id,
              zip_code: item.zip_code,
              label: item.label,
            }));

            return productItem;
          })
          .flat();

        const dataExport = productItem.map((product) => {
          const result = {
            'External ID': 'POD097',
            'Order ID': product.order_id,
            'Shipping method': 1,
            'First Name': product.name_buyer.split(' ')[0],
            'Last Name': product.name_buyer.split(' ')[1],
            Email: product.buyer_email,
            Phone: '',
            Country: 'US',
            Region: product.state,
            'Address line 1': product.street,
            'Address line 2': '',
            City: product.city,
            Zip: product.zip_code,
            Quantity: product.quantity,
            'Variant ID': key === 'PrintCare' ? product.sku_name : product.variant_id,
            'Print area front': product.image_design_front,
            'Print area back': product.image_design_back,
            'Mockup Front': '',
            'Mockup Back': '',
            'Product note': product.note,
            'Link label': product.label,
            'Tracking ID': '',
          };

          if (key === 'PrintCare') {
            result['Tracking ID'] = product.tracking_id;
          }

          return result;
        });

        ExportExcelFile(dataExport, key, dataConvert);
      }
    };
    pdfLabelLinkSearch(dataLabel, onSuccess, () => {});
  };

  const handleRefreshDesign = (newData: any) => {
    setDesignSku(newData);
    const data = {
      order_documents: toShipInfoData,
    };
    getToShipInfo(
      String(shopId),
      data,
      (res) => console.log(res),
      (err) => console.log(err),
    );
  };

  const rowSelectionFlashShip = {
    onChange: (_: any, selectedRows: any) => {
      setTableFlashShipSelected(selectedRows);
    },
    // getCheckboxProps: () => ({
    //   disabled: !allowCreateOrderPartner,
    // }),
  };

  const rowSelectionPrintCare = {
    onChange: (_: any, selectedRows: any) => {
      setTablePrintCareSelected(selectedRows);
    },
    // getCheckboxProps: () => ({
    //   disabled: !allowCreateOrderPartner,
    // }),
  };

  const column = [
    {
      title: 'Package ID',
      dataIndex: 'package_id',
      key: 'package_id',
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Product items',
      dataIndex: 'product_items',
      key: 'product_items',
      render: (_: any, record: any) => {
        return (
          <Popover
            content={renderListItemProduct(record?.order_list)}
            trigger="click"
            placement="bottom"
            title={`Current package: ${record?.order_list?.length} items`}
          >
            <div className="cursor-pointer hover:bg-gray-200 p-2 flex flex-wrap items-center">
              <div className="flex-1">
                <p>{record?.order_list?.length} items</p>
                <ul className="text-ellipsis whitespace-nowrap overflow-hidden w-[180px]">
                  {record?.order_list?.map((item: any) => (
                    <li key={item.sku_id} className="inline-block mr-3 w-10 h-10 [&:nth-child(3+n)]:hidden">
                      <img className="w-full h-full object-cover" width={30} height={30} src={item.sku_image} />
                    </li>
                  ))}
                </ul>
              </div>
              <DownOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </div>
          </Popover>
        );
      },
    },
    {
      title: 'Tracking ID',
      dataIndex: 'tracking_id',
      key: 'tracking_id',
    },
    {
      title: 'Name buyer',
      dataIndex: 'name_buyer',
      key: 'name_buyer',
    },
    {
      title: 'Shipping information',
      dataIndex: 'shipping_info',
      key: 'shipping_info',
      render: (_: any, record: any) => {
        return (
          <ul>
            <li>
              <span>State: </span>
              {record.state}
            </li>
            <li>
              <span>Street: </span>
              {record.street}
            </li>
            <li>
              <span>zip code: </span>
              {record.zip_code}
            </li>
          </ul>
        );
      },
    },
  ];

  useEffect(() => {
    const data = {
      order_documents: toShipInfoData,
    };

    const onSuccess = (res: any) => {
      if (res) {
        let errorShown = false;
        // eslint-disable-next-line array-callback-return
        const dataCheck = res.map((item: any) => {
          if (item.data.ocr_result.status === 'error' && !errorShown) {
            messageApi.open({
              type: 'error',
              content: item.data.ocr_result.message,
            });
            errorShown = true;
          }

          const itemLabel = toShipInfoData.find(
            (itemShipInfo: any) => itemShipInfo.package_id === item.data.data.order_list[0].package_list[0].package_id,
          );

          return {
            label: itemLabel.label,
            order_list: item.data.data.order_list,
            package_id: item.data.data.order_list[0].package_list[0].package_id,
            state: item.data.ocr_result.data?.state,
            street: item.data.ocr_result.data?.address || '',
            city: item.data.ocr_result.data?.city || '',
            tracking_id: item.data.ocr_result.data?.tracking_id || '',
            zip_code: item.data.ocr_result.data?.zipcode || '',
            name_buyer: item.data.ocr_result.data?.name || '',
          };
        });
        setDataOCRCheck(dataCheck);
      }
    };

    const onSuccessVariant = (res: any) => {
      if (res) {
        setFlashShipVariants(res);
      }
    };

    const onSuccessFulfillmentCompleted = (res: any) => {
      setOrderFulfillmentCompleted(res);
    };

    const onFail = (err: any) => {
      console.log(err);
    };

    const onFailVariant = (err: any) => {
      console.log(err);
    };

    getDesignSku(
      (newRes) => setDesignSku(newRes),
      (err) => console.log('Error when fetching design SKU: ', err),
    );
    getFlashShipPODVariant(onSuccessVariant, onFailVariant);
    getToShipInfo(String(shopId), data, onSuccess, onFail);
    packageFulfillmentCompleted(String(shopId), onSuccessFulfillmentCompleted, () => {
      return null;
    });
  }, [shopId, toShipInfoData]);

  useEffect(() => {
    if (dataOCRCheck && flashShipVariants.length > 0) {
      checkDataPartner(dataOCRCheck);
    }
  }, [dataOCRCheck, flashShipVariants]);

  return (
    <div className="p-10">
      {contextHolder}
      {notificationContextHolder}
      <div>
        {showLink && (
          <Link to={`/shops/${shopId}/orders/fulfillment/completed`} className="mb-5 inline-block" target="_blank">
            <LinkOutlined className="mr-3" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            Kiểm tra đơn đã tạo thành công
          </Link>
        )}
        <div className="flex flex-wrap items-center mb-3">
          <div className="flex-1">
            <SectionTitle
              title="Create Order in FlashShip"
              count={flashShipTable.length ? flashShipTable.length : undefined}
            />
          </div>
          <Space>
            <div className="flex flex-wrap items-center">
              <label className="mr-3">Shipment method: </label>
              <Select
                defaultValue="1"
                onChange={(value) => setFlashShipShipment(Number(value))}
                options={[
                  {
                    value: '1',
                    label: 'FirstClass',
                  },
                  {
                    value: '2',
                    label: 'Priority',
                  },
                  {
                    value: '3',
                    label: 'RushProduction',
                  },
                ]}
              />
            </div>
            <Button type="primary" onClick={handleCreateOrderFlashShip} disabled={!tableFlashShipSelected.length}>
              Create Order with FlashShip
            </Button>
            <Button
              type="primary"
              onClick={() => handleExportExcelFile(tableFlashShipSelected, 'FlashShip')}
              disabled={!tableFlashShipSelected.length}
            >
              Export to excel file
            </Button>
          </Space>
        </div>
        <Table
          columns={column}
          dataSource={flashShipTable}
          bordered
          loading={loadingGetInfo || loadingGetLink}
          rowSelection={{
            type: 'checkbox',
            ...rowSelectionFlashShip,
          }}
          rowKey={(record) => record.package_id}
        />
      </div>

      <Divider className="my-10" />

      <div>
        <div className="flex flex-wrap items-center mb-3">
          <div className="flex-1">
            <SectionTitle
              title="Create Order in PrintCare"
              count={printCareTable.length ? printCareTable.length : undefined}
            />
          </div>
          <Button
            type="primary"
            onClick={() => handleExportExcelFile(tablePrintCareSelected, 'PrintCare')}
            disabled={!tablePrintCareSelected.length}
          >
            Export to excel file
          </Button>
        </div>
        <Table
          columns={column}
          dataSource={printCareTable}
          bordered
          loading={loadingGetInfo || loadingGetLink}
          rowSelection={{
            type: 'checkbox',
            ...rowSelectionPrintCare,
          }}
          rowKey={(record) => record.package_id}
        />
      </div>

      <Modal
        title="FlashShip Login"
        open={openLoginFlashShip}
        onCancel={() => setOpenLoginFlashShip(false)}
        footer={false}
      >
        <Form onFinish={handleLoginFlashShip}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <DesignEdit
        openModal={[openEditModal, setOpenEditModal]}
        initData={designSkuById}
        refreshDesign={handleRefreshDesign}
        groupId=""
      />
    </div>
  );
}

export default OrderForPartner;
