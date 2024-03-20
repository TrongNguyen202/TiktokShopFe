import { useEffect, useState } from 'react';
import {
  Divider,
  Table,
  Space,
  Button,
  Popover,
  Image,
  Modal,
  Form,
  Input,
  message,
  notification,
  Tooltip,
} from 'antd';
import { DownOutlined, WarningOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";

import { useShopsOrder } from '../../store/ordersStore';
import { getPathByIndex } from '../../utils';
import { setToken } from '../../utils/auth';

import SectionTitle from '../common/SectionTitle';
import DesignEdit from '../design-sku/DesignEdit';
import { useFlashShipStores } from '../../store/flashshipStores';

function OrderForPartner({ toShipInfoData }) {
  const navigate = useNavigate();
  const shopId = getPathByIndex(2);
  const [messageApi, contextHolder] = message.useMessage();
  const [api, notificationContextHolder] = notification.useNotification();
  const [designSku, setDesignSku] = useState([]);
  const [designSkuById, setDesignSkuById] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataOCRCheck, setDataOCRCheck] = useState([]);
  const [tableFlashShipSelected, setTableFlashShipSelected] = useState([]);
  const [tablePrintCareSelected, setTablePrintCareSelected] = useState([]);
  const [flashShipTable, setFlashShipTable] = useState([]);
  const [printCareTable, setPrintCareTable] = useState([]);
  const [flashShipVariants, setFlashShipVariants] = useState([]);
  const [openLoginFlashShip, setOpenLoginFlashShip] = useState(false);
  const [allowCreateOrderPartner, setAllowCreateOrderPartner] = useState(false);
  const {
    getToShipInfo,
    loadingGetInfo,
    getDesignSku,
    getDesignSkuById,
    packageCreateFlashShip,
    packageCreatePrintCare,
  } = useShopsOrder((state) => state);
  const { getFlashShipPODVariant, LoginFlashShip, createOrderFlashShip } = useFlashShipStores((state) => state);

  const checkDataPartner = (data) => {
    const orderPartnerResult = data?.map((dataItem, index) => {
      const orderPartner = { ...dataItem };
      const itemList = dataItem?.order_list?.flatMap((item) => item.item_list);
      let isFlashShip = true;
      const variations = itemList.map((variation, itemListIndex) => {
        if (!isFlashShip) return variation;
        let variationObject = {};
        const result = { ...variation };
        const variationSplit = variation?.sku_name?.split(', ');

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

        const checkProductType = flashShipVariants?.filter((variant) =>
          variationObject?.size?.toUpperCase().includes(variant.product_type.toUpperCase()),
        );

        if (!checkProductType.length) {
          isFlashShip = false;
        }

        if (checkProductType.length) {
          const checkColor = checkProductType.filter(
            (color) => color.color.toUpperCase() === variationObject?.color?.replace(' ', '').toUpperCase(),
          );

          if (checkColor.length) {
            const checkSize = checkColor.find((size) =>
              variationObject?.size?.toUpperCase().includes(size.size.replace(' ', '').toUpperCase()),
            );
            if (checkSize) {
              result.variant_id = checkSize.variant_id;
            } else {
              isFlashShip = false;
            }
          } else {
            isFlashShip = false;
          }
        }
        return result;
      });

      orderPartner.buyer_email = dataItem.order_list[0].buyer_email;
      orderPartner.order_list = variations;
      orderPartner.is_FlashShip = isFlashShip;
      return orderPartner;
    });

    const dataFlashShip = orderPartnerResult?.filter((item) => item.is_FlashShip);
    const dataPrintCare = orderPartnerResult?.filter((item) => !item.is_FlashShip);
    if (dataFlashShip.length) setFlashShipTable(dataFlashShip);
    if (dataPrintCare.length) setPrintCareTable(dataPrintCare);
  };

  const handleEditDesignSku = (skuId) => {
    setOpenEditModal(true);
    const onSuccess = (res) => {
      setDesignSkuById(res);
    };

    const onFail = (err) => {
      console.log('getDesignSkuById: ', err);
    };
    getDesignSkuById(skuId, onSuccess, onFail);
  };

  const renderListItemProduct = (data) => {
    return data?.map((item, index) => (
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

  const handAddDesignToShipInfoData = (data) => {
    return data.map((item) => {
      const orderItem = item.order_list.map((order) => {
        const design = designSku?.results?.find((skuItem) => skuItem.sku_id === order.sku_id);
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

  const handleConvertDataPackageCreate = (data, key) => {
    const result = data.map((item) => ({
      order_id: item.package_id,
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
      shipment: 1,
      linkLabel: item.label,
      products: item.order_list.map((product) => {
        return {
          variant_id: key === 'PrintCare' ? 'POD097' : product.variant_id,
          printer_design_front_url: product.image_design_front || null,
          printer_design_back_url: product.image_design_back || null,
          quantity: product.quantity,
          note: '',
        };
      }),
    }));

    return result;
  };

  const handleLoginFlashShip = (values) => {
    const onSuccess = (res) => {
      if (res) {
        setToken('flash-ship-tk', res.data.access_token);
        setOpenLoginFlashShip(false);
        const handAddDesignToShipInfoData = tableFlashShipSelected.map((item) => {
          const orderItem = item.order_list.map((order) => {
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
            icon: <WarningOutlined style={{ color: 'red' }} />,
          });
        } else {
          const dataSubmitFlashShip = handleConvertDataPackageCreate(handAddDesignToShipInfoData, 'FlashShip');

          // eslint-disable-next-line array-callback-return
          dataSubmitFlashShip.map((item) => {
            const onCreateSuccess = (resCreate) => {
              api.open({
                message: `Đơn hàng ${item.order_id}`,
                description: resCreate.err,
                icon: <WarningOutlined style={{ color: 'red' }} />,
              });

              const onSuccessPackageCreate = (resPackage) => {
                if (resPackage) {
                  navigate(`/shops/${shopId}/orders/fulfillment/completed`)
                }
              };

              const onFailPackageCreate = (errPackage) => {
                console.log('errPackage: ', errPackage);
              };

              packageCreateFlashShip(shopId, item, onSuccessPackageCreate, onFailPackageCreate);
            };

            const onCreateFail = (errCreate) => {
              console.log(errCreate);
              messageApi.open({
                type: 'error',
                content: `Đơn hàng ${item.order_id} có lỗi : ${errCreate.err}`,
              });
            };

            createOrderFlashShip(item, onCreateSuccess, onCreateFail);
          });
        }
      }
    };

    const onFail = (err) => {
      messageApi.open({
        type: 'error',
        content: `Đăng nhập thất bại. Vui lòng thử lại. ${err}`,
      });
    };

    LoginFlashShip(values, onSuccess, onFail);
  };

  const ExportExcelFile = (data, fileName, dataPackageCreate) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}-${Date.now()}.xlsx`);

    const dataPackageCreateConvert = handleConvertDataPackageCreate(dataPackageCreate, fileName);
    // eslint-disable-next-line array-callback-return
    dataPackageCreateConvert.map((item) => {
      if (fileName === 'PrintCare') {
        const onSuccess = (res) => {
          if (res) {
            navigate(`/shops/${shopId}/orders/fulfillment/completed`)
          }
        }
        packageCreatePrintCare(
          shopId,
          item,
          onSuccess,
          (err) => console.log(err),
        );
      } else {
        packageCreateFlashShip(
          shopId,
          item,
          onSuccess,
          (err) => console.log(err),
        );
      }
    });
  };

  const handleExportExcelFile = (data, key) => {
    const dataConvert = handAddDesignToShipInfoData(data);
    const productItem = dataConvert
      .map((item) => {
        const productItem = item.order_list.map((product) => ({
          ...product,
          city: item.city,
          buyer_email: item.buyer_email,
          name_buyer: item.name_buyer,
          package_id: item.package_id,
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
        'Order ID': key === 'PrintCare' ? product.product_id : product.package_id,
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
        'Variant ID': key=== 'PrintCare' ? product.sku_name : product.variant_id,
        'Print area front': product.image_design_front,
        'Print area back': product.image_design_back,
        'Mockup Front': '',
        'Mockup Back': '',
        'Product note': product.note,
        'Link label': product.label,
      };

      if (key === 'PrintCare') {
        result['Tracking ID'] = product.tracking_id;
      }

      return result;
    });

    ExportExcelFile(dataExport, key, dataConvert);
  };

  const handleRefreshDesign = (newData) => {
    setDesignSku(newData);
    const data = {
      order_documents: toShipInfoData,
    };
    getToShipInfo(
      shopId,
      data,
      (res) => console.log(res),
      (err) => console.log(err),
    );
  };

  const rowSelectionFlashShip = {
    onChange: (_, selectedRows) => {
      setTableFlashShipSelected(selectedRows);
    },
    getCheckboxProps: () => ({
      disabled: !allowCreateOrderPartner,
    }),
  };

  const rowSelectionPrintCare = {
    onChange: (_, selectedRows) => {
      setTablePrintCareSelected(selectedRows);
    },
    getCheckboxProps: () => ({
      disabled: !allowCreateOrderPartner,
    }),
  };

  const column = [
    {
      title: 'Package ID',
      dataIndex: 'package_id',
      key: 'package_id',
    },
    {
      title: 'Product items',
      dataIndex: 'product_items',
      key: 'product_items',
      render: (_, record) => {
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
                  {record?.order_list?.map((item) => (
                    <li key={item.sku_id} className="inline-block mr-3 w-10 h-10 [&:nth-child(3+n)]:hidden">
                      <img className="w-full h-full object-cover" width={30} height={30} src={item.sku_image} />
                    </li>
                  ))}
                </ul>
              </div>
              <DownOutlined />
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
      render: (_, record) => {
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
        )
      },
    },
  ];

  useEffect(() => {
    const data = {
      order_documents: toShipInfoData,
    };

    const onSuccess = (res) => {
      if (res) {
        let errorShown = false;
        // eslint-disable-next-line array-callback-return
        const dataCheck = res.map((item) => {
          setAllowCreateOrderPartner(true);
          if (item.data.ocr_result.status === 'error' && !errorShown) {
            messageApi.open({
              type: 'error',
              content: item.data.ocr_result.message,
            });
            errorShown = true;
            setAllowCreateOrderPartner(false);
          }

          const itemLabel = toShipInfoData.find(
            (itemShipInfo) => itemShipInfo.package_id === item.data.data.order_list[0].package_list[0].package_id,
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

    const onSuccessVariant = (res) => {
      if (res) {
        setFlashShipVariants(res);
      }
    };

    const onFail = (err) => {
      console.log(err);
    };

    const onFailVariant = (err) => {
      console.log(err);
    };

    getDesignSku(
      (newRes) => setDesignSku(newRes),
      (err) => console.log('Error when fetching design SKU: ', err),
    );
    getFlashShipPODVariant(onSuccessVariant, onFailVariant);
    getToShipInfo(shopId, data, onSuccess, onFail);
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
        <div className="flex flex-wrap items-center mb-3">
          <div className="flex-1">
            <SectionTitle
              title="Create Order in FlashShip"
              count={flashShipTable.length ? flashShipTable.length : '0'}
            />
          </div>
          <Space>
            <Button
              type="primary"
              onClick={() => setOpenLoginFlashShip(true)}
              disabled={!tableFlashShipSelected.length}
            >
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
          loading={loadingGetInfo}
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
              count={printCareTable.length ? printCareTable.length : '0'}
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
          loading={loadingGetInfo}
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
      />
    </div>
  );
}

export default OrderForPartner;
