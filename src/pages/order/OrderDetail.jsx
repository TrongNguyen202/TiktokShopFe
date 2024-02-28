import {
  Col,
  Image,
  Modal,
  Radio,
  Row,
  Spin,
  Table,
  Tabs,
  Select,
  Input,
  Button,
  Tooltip,
} from "antd";
import { LoadingOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Link, useParams } from "react-router-dom";
import ImageDefault from "../../assets/images/image-default.jpg";
import ContentHeader from "../../components/content-header/index.jsx";
import PackageWeight from "../../assets/icons/PackageWeight";
import { useOrderStore } from "../../store/orderStore.js";
import { formatNumber, formatPrice } from "../../utils/index.js";
import { alerts } from "../../utils/alerts";
import PackageHeight from "../../assets/icons/PackageHeight";
import PackageLength from "../../assets/icons/PackageLength";
import PackageWidth from "../../assets/icons/PackageWidth";
import PackageCod from "../../assets/icons/PackageCod";
import { ComponentToPrint } from "./componentToPrint";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import InfoCustomerForm from "./components/InfoCustomerForm.jsx";
import { useAddressStore } from "../../store/addressStore.js";
import ProductInCart from "./ProductInCart.jsx";
import styled from "styled-components";

const CartPageStyles = styled.div`
  .progress_main {
    background: white;
    padding: 0.5rem;
    margin-top: 0.5rem;
    height: 100px;
    position: relative;
  }
  .progress_main .cart-header {
    width: 1200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
  }
  .progress_main .title {
    color: #20409a;
    padding-top: 13px;
    padding-left: 20px;
    line-height: 40px;
    font-size: 30px;
  }
  .progress_main .form {
    line-height: 45px;
    padding: 0 10px;
    height: 45px;
    border: 2px solid #20409a;
    position: relative;
    width: 620px;
  }
  .progress_main .form input {
    width: 100%;
    font-size: 15px;
  }
  .progress_main .form button {
    width: 80px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #20409a;
  }
  .progress_main .form button img {
    width: 20px;
    height: 20px;
  }
  .bg_progress {
    padding: 40px;
    background-color: white;
    border-radius: 10px;
  }
  .cart-container {
    width: 100%;
    margin: 20px auto;
  }
  .product-image {
    display: flex;
    position: relative;
  }
  .progress_content {
    width: 60%;
    margin: 0 auto;
    .progress_info {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      color: #212121;
    }
    .progress {
      display: flex;
      justify-content: space-between;
      position: relative;
      width: 90%;
      margin: 35px auto 0;
      height: 2px;
      background-color: #e1e1e1;
      .progress_percent {
        position: absolute;
        top: 0;
        height: 100%;
      }
      .progress_item {
        width: 40px;
        height: 40px;
        border-radius: 100rem;
        overflow: hidden;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 6px 0 rgb(0 0 0 / 10%);
        &:nth-child(2) {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
        }
        &:nth-child(3) {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        &:nth-child(4) {
          position: absolute;
          top: 0;
          left: 100%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .content {
    column-gap: 20px;
    .box-cart {
      border: none;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      .info-shop {
        height: 60px;
        box-sizing: border-box;
        padding: 0 20px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.09);
        margin: 12px 0;
        img {
          width: 20px;
          height: 20px;
          margin-left: 5px;
          cursor: pointer;
        }
      }
      .item {
        padding: 15px 20px;
      }
      .list-order {
        background-color: white;
        border-bottom: 1px solid #ebebeb;
        padding: 1.25rem 1.5625rem;
        text-transform: uppercase;
        font-size: 16px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
      }
      .cart-item {
        padding: 1.25rem 1.5625rem;
        &:last-child {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        .distributes {
          & > div {
            border-radius: 4px;
          }
          button {
            cursor: pointer;
          }
        }
      }
    }
  }
  .paymentProcess {
    display: flex;
    justify-content: center;
    column-gap: 40px;
    margin: 20px 0 40px;
    .paymentProcess_btn {
      height: 40px;
      width: 220px;
      background-color: white;
      border-radius: 100rem;
      box-shadow: 0 0 13px 0 rgb(0 0 0 / 8%);
      button {
        cursor: pointer;
        display: flex;
        column-gap: 10px;
        font-weight: 700;
        align-items: center;
        width: 100%;
        height: 100%;
        justify-content: center;
      }
      &:first-child {
        button {
          color: #999;
        }
      }
      &:last-child {
        button {
          color: white;
        }
      }
    }
  }
  .order-info-mobile {
    width: 100%;
  }
  .shopee-button-solid {
    transition: all 0.3s;
    &:hover {
      transform: scale(1.2);
    }
  }
  .header-mobile {
    display: none;
  }
  .modal-showPopup {
    display: flex !important;
    transition: all 0.3s;
  }
  .product-info-mobile {
    display: none;
  }
  .order-deliveryInfo,
  .order-deliveryInfo form {
    .order-left {
      margin-left: 0 !important;
      padding-left: 0.5rem !important;
    }
  }
  .head {
    margin-top: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
    border-radius: 0.125rem;
    overflow: hidden;
    border-radius: 3px;
    height: 55px;
    font-size: 14px;
    background: #fff;
    color: #888;
    padding: 0 20px;
  }
  .check-box {
    flex-direction: row-reverse;
    min-width: 40px;
    box-sizing: border-box;
  }
  .product {
    color: rgba(0, 0, 0, 0.8);
    width: 300px;
  }
  .distribute {
    width: 300px;
    position: relative;
    .distribute-container {
      width: 400px;
      border-color: #00000017;
      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.09);
      background-color: #fff;
      position: absolute;
      top: 25px;
      right: 0;
      z-index: 1;
    }
  }
  .price {
    text-align: center;
    width: 140px;
  }
  .quantity {
    text-align: center;
    width: 15.4265%;
    .input-quantity {
      display: flex;
      border: 1px solid whitesmoke;
      width: 50%;
      margin: auto;
      button {
        font-size: 16px;
        width: 2em;
        height: 2em;
        background: whitesmoke;
      }
    }
  }
  .total {
    width: 10.43557%;
    text-align: center;
  }
  .operation {
    width: 12.70417%;
    text-align: center;
  }
  .zoXdNN {
    display: flex;
    align-items: center;
    padding: 20px;
    width: 100%;
    .delete {
      cursor: pointer;
    }
    .delete:hover {
      color: #20409a;
    }
  }
  .eUrDQm {
    box-sizing: border-box;
    position: relative;
    flex-direction: column;
    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
    }
  }
  .order-info {
    background-color: white;
    position: fixed;
    bottom: 0;
    left: 50%;
    width: 1200px;
    transform: translateX(-50%);
    box-shadow: 0px -5px 10px 0px lightgray;
    display: grid;
    grid-template-columns: 60% auto auto;
    img {
      width: 20px;
      height: 20px;
    }
    .voucher {
      grid-column-start: 2;
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      .text {
        margin: 0 5px;
        font-size: 16px;
      }
    }
    .choose-voucher {
      text-transform: capitalize;
      color: #20409a;
      padding: 0.75rem 0;
      cursor: pointer;
      font-size: 16px;
    }
    .coins {
      padding: 16px 0 15px;
      display: flex;
    }
    .coins > div {
      line-height: 21px;
      margin: 0 5px;
    }
    .coin-can-use {
      align-items: center;
      display: flex;
      justify-content: end;
    }
    .last-line {
      padding: 12px 0;
      display: flex;
      align-items: center;
    }
    .last-line > div {
      cursor: pointer;
    }
    .total-money {
      display: flex;
      align-items: center;
      font-size: 16px;
    }
    .buy {
      cursor: pointer;
      text-transform: capitalize;
      font-weight: 300;
      height: 2.5rem;
      box-sizing: border-box;
      font-size: 0.875rem;
      border-radius: 2px;
      width: 13.125rem;
      background: #20409a;
      text-align: center;
      line-height: 2.5rem;
      button {
        color: white;
        font-size: 0.875rem;
      }
    }
  }
  .order-info > div {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.09);
  }
`;

const statusOrder = [
  {
    id: 1,
    name: "Chờ xử lý",
    status_code: "WAITING_FOR_PROGRESSING",
  },
  {
    id: 2,
    name: "Đang chuẩn bị hàng",
    status_code: "PACKING",
  },
  {
    id: 3,
    name: "Đang giao hàng",
    status_code: "SHIPPING",
  },
  // {
  //   id: 4,
  //   name: "Đã nhận hàng",
  //   status_code: "RECEIVED_PRODUCT",
  // },
  {
    id: 5,
    name: "Đã hoàn thành",
    status_code: "COMPLETED",
  },
  {
    id: 6,
    name: "Hết hàng",
    status_code: "OUT_OF_STOCK",
  },
  {
    id: 7,
    name: "Shop đã hủy",
    status_code: "USER_CANCELLED",
  },
  {
    id: 8,
    name: "Khách đã hủy",
    status_code: "CUSTOMER_CANCELLED",
  },
  {
    id: 9,
    name: "Lỗi giao hàng",
    status_code: "DELIVERY_ERROR",
  },
  {
    id: 10,
    name: "Chờ trả hàng",
    status_code: "CUSTOMER_RETURNING",
  },
  {
    id: 11,
    name: "Đã trả hàng",
    status_code: "CUSTOMER_HAS_RETURNS",
  },
];

const statusPayment = [
  {
    id: 1,
    name: "Chưa thanh toán",
    status_code: "UNPAID",
  },
  // {
  //   id: 2,
  //   name: "Đã thanh toán một phần",
  //   status_code: "PARTIALLY_PAID",
  // },
  {
    id: 3,
    name: "Đã thanh toán",
    status_code: "PAID",
  },
  {
    id: 4,
    name: "Đã hoàn tiền",
    status_code: "REFUNDS",
  },
];

const OrderDetail = () => {
  const { order_code } = useParams();
  const { getDistrict, getWards, resetDistrictAndWard } = useAddressStore();

  const [orderStatusChecked, setOrderStatusChecked] = useState();
  const [orderStatusSelected, setOrderStatusSelected] = useState(null);
  const [isOpenModalOrderStatus, setOpenModalOrderStatus] = useState(false);

  const [paymentStatusChecked, setPaymentStatusChecked] = useState();
  const [paymentStatusSelected, setPaymentStatusSelected] = useState(null);
  const [shipfee, setShipFee] = useState(0);
  const [isOpenModalPaymentStatus, setOpenModalPaymentStatus] = useState(false);
  const [packageInfo, setPackageInfo] = useState({
    package_weight: 0,
    package_height: 0,
    package_width: 0,
    package_length: 0,
    cod: 0,
  });
  const [isEdit, setIsEdit] = useState(true);
  const [isModalOpenShippFee, setIsModalOpenShippFee] = useState(false);
  const [modalInfoCustomer, setModalInfoCustomer] = useState({
    isShow: false,
  });

  const [shipmentId, setShipmentId] = useState();

  const {
    getOrderById,
    loading,
    orderExists,
    getHistoryOrderById,
    historyOrderById,
    changeOrderStatus,
    loadingStatus,
    changePaymentStatus,
    listShipment,
    getListShipment,
    updatePackage,
    updateShipment,
    sendOrder,
    loadingOrder,
    cancelOrder,
    updateOrder,
    updateCart
  } = useOrderStore();
  const componentRef = useRef();

  useEffect(() => {
    getOrderInfo(order_code);
    getHistoryInfo(order_code);
    getListShipment();
  }, []);

  useEffect(() => {
    if (Object.keys(orderExists).length > 0) {
      setShipmentId(orderExists.partner_shipper_id);
      setPackageInfo({
        package_weight: orderExists.package_weight,
        package_height: orderExists.package_height,
        package_length: orderExists.package_length,
        package_width: orderExists.package_width,
        cod: orderExists.cod,
      });
    }
  }, [orderExists]);

  const listShipmentOption = () => {
    return listShipment.length > 0
      ? listShipment.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        })
      : [];
  };

  const openFormEdit = (item) => {
    setModalInfoCustomer((prev) => ({ ...prev, isShow: true }));
    getDistrict(orderExists.customer_address.province, () => {
      alerts.error("Có lỗi xảy ra");
    });
    getWards(orderExists.customer_address.district, () => {
      alerts.error("Có lỗi xảy ra");
    });
  };

  const getOrderInfo = (order_code) => {
    const onSuccess = (res) => {
      const { order_status_code, payment_status_code } = res;
      const itemSelectOrder = statusOrder.filter(
        (item) => item.status_code === order_status_code
      );
      const itemSelectPayment = statusPayment.filter(
        (item) => item.status_code === payment_status_code
      );
      if (itemSelectOrder && itemSelectOrder.length)
        setOrderStatusChecked(itemSelectOrder[0]);
      else setOrderStatusChecked(statusOrder[0]);
      if (itemSelectPayment && itemSelectPayment.length)
        setPaymentStatusChecked(itemSelectPayment[0]);
      else setPaymentStatusChecked(statusPayment[0]);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    getOrderById(order_code, onSuccess, onFail);
  };

  const onChangeOrderStatusChecked = (item) => {
    if (orderStatusChecked.id === item.id) return;
    setOpenModalOrderStatus(true);
    setOrderStatusSelected(item);
  };

  const handleChangePackageInfo = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPackageInfo((prevInfo) => ({
      ...prevInfo,
      [name]: parseInt(value),
    }));
  };

  const onChangePaymentStatusChecked = (item) => {
    if (paymentStatusChecked.id === item.id) return;
    setOpenModalPaymentStatus(true);
    setPaymentStatusSelected(item);
  };

  const confirmStatusChange = async (e, item) => {
    e.stopPropagation();
    setOpenModalOrderStatus(false);
    try {
      await changeOrderStatus(
        order_code,
        item.status_code,
        () => {},
        (err) => {
          alerts.error(err);
        }
      );
      setOrderStatusChecked(item);
      getOrderInfo(order_code);
      getHistoryInfo(order_code);
    } catch (err) {
      alerts.error(err);
    }
  };

  const confirmPaymentStatusChange = async (e, item) => {
    e.stopPropagation();
    setOpenModalPaymentStatus(false);

    try {
      await changePaymentStatus(
        order_code,
        item.status_code,
        () => {},
        (err) => {
          alerts.error(err);
        }
      );
      setPaymentStatusChecked(item);
      getOrderInfo(order_code);
      getHistoryInfo(order_code);
    } catch (err) {
      alerts.error(err);
    }
  };

  const getHistoryInfo = (order_code) => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };
    getHistoryOrderById(order_code, onSuccess, onFail);
  };

  const handleSendOrder = () => {
    const findStatus = statusOrder.find(
      (item) => item.status_code === "SHIPPING"
    );

    const onSuccess = () => {
      setOrderStatusChecked(findStatus);
      getOrderInfo(order_code);
      getHistoryInfo(order_code);
    };
    // const onSuccess = async () => {
    // changeOrderStatus(order_code,'SHIPPING')
    // getOrderInfo(order_code);
    // getHistoryInfo(order_code);
    // try {
    //   await changeOrderStatus(
    //     order_code,
    //     "SHIPPING",
    //     () => {},
    //     (err) => {
    //       alerts.error(err);
    //     }
    //   );
    //   setOrderStatusChecked(findStatus);
    //   getOrderInfo(order_code);
    //   getHistoryInfo(order_code);
    // } catch (err) {
    //   alerts.error(err);
    // }

    // };
    sendOrder({ order_code: order_code }, onSuccess);
  };

  const handleUpdatePackage = () => {
    const onSuccess = () => {
      getOrderInfo(order_code);
      setIsEdit(true);
    };
    updatePackage(packageInfo, orderExists.order_code, onSuccess);
  };

  const handleCancelOrder = () => {
    const onSuccess = () => {
      getOrderInfo(order_code);
    };
    cancelOrder(orderExists.order_code, onSuccess);
  };

  const onSubmitInfoCusForm = (value) => {
    console.log("value: ", value);
    const onSuccess = () => {
      getOrderInfo(order_code);
      setModalInfoCustomer((prev) => ({ ...prev, isShow: false }));
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    updateOrder(order_code, value, onSuccess, onFail);
  };

  const columnsHistoryStatusOrder = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, item, i) => <p>{i + 1}</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 17,
      }}
      spin
    />
  );

  const renderOrderAndPaymentStatus = () => {
    const disabledChangeStatusOrder =
      orderExists?.order_status_code == "COMPLETED";
    const disabledChangeStatusPayment =
      orderExists?.payment_status_code == "PAID";

    return (
      <div>
        <div
          className="text-[16px] rounded-md bg-white border-t-[4px] border-solid border-l-0 border-r-0 border-b-0 border-[#CF5763]"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
        >
          <p className="font-medium uppercase p-3 bg-white text-[#CF5763] rounded-t-md border-b-[#e7e7e7] border-solid border-[1px] border-l-0 border-t-0 border-r-0 mb-2">
            Trạng thái đơn hàng
          </p>
          <Spin spinning={loadingStatus}>
            <Radio.Group className="w-full" value={orderStatusChecked?.id}>
              <Scrollbars style={{ height: "300px" }}>
                {statusOrder && statusOrder.length
                  ? statusOrder.map((item) => {
                      const { id, name } = item ?? {};
                      return (
                        <div
                          key={id}
                          className="py-2 px-3 w-full hover:bg-[#f5f5f5] cursor-pointer"
                          style={{
                            background:
                              orderStatusChecked?.id === id ? "#FBF4F5" : "",
                          }}
                          onClick={() => {
                            if (disabledChangeStatusOrder == true) return;
                            onChangeOrderStatusChecked(item);
                          }}
                        >
                          <Radio
                            value={id}
                            className="text-[16px]"
                            disabled={disabledChangeStatusOrder}
                          >
                            <span
                              className={`${
                                orderStatusChecked?.id === id
                                  ? "font-medium text-[#CF5763]"
                                  : ""
                              } `}
                            >
                              {name}
                            </span>
                          </Radio>
                          {orderStatusSelected?.id === id && (
                            <Modal
                              title="Thông báo"
                              open={isOpenModalOrderStatus}
                              onOk={(e) => confirmStatusChange(e, item)}
                              onCancel={(e) => {
                                e.stopPropagation();
                                setOpenModalOrderStatus(false);
                              }}
                              cancelText="Hủy"
                              okText="Xác nhận"
                            >
                              Bạn muốn chuyển trạng thái đơn hàng thành{" "}
                              <span className="font-medium text-[#CF5763]">
                                {name}
                              </span>
                              ?
                            </Modal>
                          )}
                        </div>
                      );
                    })
                  : null}
              </Scrollbars>
            </Radio.Group>
          </Spin>
        </div>
        <div
          className="text-[16px] rounded-md bg-white mt-4 border-t-[4px] border-solid border-l-0 border-r-0 border-b-0 border-[#CF5763] pb-2"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
        >
          <p className="font-medium uppercase p-3 bg-white text-[#CF5763] rounded-t-md border-b-[#e7e7e7] border-solid border-[1px] border-l-0 border-t-0 border-r-0 mb-2">
            Trạng thái thanh toán
          </p>
          <Radio.Group className="w-full" value={paymentStatusChecked?.id}>
            {statusPayment && statusPayment.length
              ? statusPayment.map((item) => {
                  const { id, name } = item;
                  return (
                    <div
                      key={id}
                      className="py-2 px-3 w-full hover:bg-[#f5f5f5] cursor-pointer"
                      style={{
                        background:
                          paymentStatusChecked?.id === id ? "#FBF4F5" : "",
                      }}
                      onClick={() => {
                        if (disabledChangeStatusPayment) return;
                        onChangePaymentStatusChecked(item);
                      }}
                    >
                      <Radio
                        value={id}
                        className="text-[16px]"
                        disabled={disabledChangeStatusPayment}
                      >
                        <span
                          className={`${
                            paymentStatusChecked?.id === id
                              ? "font-medium text-[#CF5763]"
                              : ""
                          } `}
                        >
                          {name}
                        </span>
                      </Radio>
                      {paymentStatusSelected?.id === id && (
                        <Modal
                          title="Thông báo"
                          open={isOpenModalPaymentStatus}
                          onOk={(e) => {
                            confirmPaymentStatusChange(e, item);
                          }}
                          onCancel={(e) => {
                            e.stopPropagation();
                            setOpenModalPaymentStatus(false);
                          }}
                          cancelText="Hủy"
                          okText="Xác nhận"
                        >
                          Bạn muốn chuyển trạng thái thanh toán thành{" "}
                          <span className="font-medium text-[#CF5763]">
                            {name}
                          </span>
                          ?
                        </Modal>
                      )}
                    </div>
                  );
                })
              : null}
          </Radio.Group>
        </div>
      </div>
    );
  };

  const itemsTabs = [
    {
      key: "1",
      label: `Thông tin khách hàng`,
      children: (
        <div className="mt-[10px] text-[16px] mx-4 leading-8 ">
          <p className="font-bold ">Đơn này từ web</p>
          <div style={{ color: "rgb(207, 87, 99)" }} className="">
            Người đặt:{" "}
            <Link to={`/customers/${orderExists?.customer_id}`}>
              {orderExists?.customer?.name}
            </Link>
            <span className="text-[#A4A4A4]">
              {orderExists?.customer?.customer_role == "aff"
                ? " (Affiliate)"
                : orderExists?.customer?.customer_role == "seller"
                ? " (Seller)"
                : ""}
            </span>
          </div>

          {orderExists?.collaborator_by_customer_id != null &&
            (orderExists?.collaborator_by_customer_id !=
              orderExists?.customer?.id) !=
              null && (
              <p style={{ color: "green" }}>
                Người giới thiệu :{" "}
                <Link
                  to={`/customers/${orderExists?.collaborator_customer?.id}`}
                >
                  {orderExists?.collaborator_customer?.name}
                </Link>
                <span className="text-[#A4A4A4]">
                  {orderExists?.collaborator_customer?.customer_role == "aff"
                    ? " (Affiliate)"
                    : orderExists?.collaborator_customer?.customer_role ==
                      "seller"
                    ? " (Seller)"
                    : ""}
                </span>
              </p>
            )}

          <p>SĐT người đặt: {orderExists?.phone_number} </p>
          <p>Người nhận: {orderExists?.customer_name}</p>

          <p>SĐT người nhận : {orderExists?.customer_phone}</p>
          <p>
            Địa chỉ:{" "}
            {`${
              orderExists?.customer_address_detail
                ? orderExists?.customer_address_detail
                : ""
            }${", "}${
              orderExists?.customer_wards_name
                ? orderExists?.customer_wards_name
                : ""
            }${", "}${
              orderExists?.customer_district_name
                ? orderExists?.customer_district_name
                : ""
            }${", "}${
              orderExists?.customer_province_name
                ? orderExists?.customer_province_name
                : ""
            } `}
          </p>
          <p>Email: {orderExists?.customer_email}</p>
          <p>Thời gian: {orderExists?.created_at}</p>
          <p>Phương thức thanh toán: {orderExists?.payment_method_name}</p>
          <p>Ghi chú: {orderExists?.customer_note}</p>

          <p style={{ color: "rgb(207, 87, 99)" }}>
            Hoa hồng người đặt: {formatNumber(orderExists?.commission_buyer)}
          </p>
          <p style={{ color: "green" }}>
            Hoa hồng giới thiệu:{" "}
            {formatNumber(orderExists?.commission_referral)}
          </p>
        </div>
      ),
    },
    {
      key: "2",
      label: `Lịch sử đơn hàng`,
      children: (
        <Table
          columns={columnsHistoryStatusOrder}
          dataSource={historyOrderById?.length > 0 ? historyOrderById : []}
        />
      ),
    },
  ];

  const handleUpdateCart = (data) => {
    const onSuccess = () => {
      getOrderInfo(order_code);
    };
    updateCart(orderExists?.id, data, onSuccess);
  };

  const renderProductInfo = () => {
    return (
      <div>
        <div
          className="bg-white rounded-md p-4"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
        >
          <span className="flex justify-between">
            <span className="text-[16px]">
              Mã đơn : #{orderExists?.order_code} |{" "}
              {orderExists?.line_items_at_time?.length > 0
                ? orderExists?.line_items_at_time[0]?.quantity
                : ""}{" "}
              sản phẩm
            </span>
            <ReactToPrint
              trigger={() => {
                return (
                  <button
                    type="button"
                    className="p-[5px_10px] text-[#fff] bg-[#CF5763] border-none rounded-[5px] cursor-pointer"
                  >
                    In đơn hàng
                  </button>
                );
              }}
              content={() => componentRef.current}
            />
            <div style={{ display: "none" }}>
              <ComponentToPrint props={orderExists} ref={componentRef} />
            </div>
          </span>

          {/* map item info orders here */}
          {/* {orderExists?.line_items_at_time?.length > 0
            ? orderExists?.line_items_at_time?.map((item, index) => {
                return (
                  <div className="flex flex-1 pt-[20px]" key={index}>
                    <div>
                      <Image
                        style={{ width: 76, height: 76 }}
                        src={item.image_url || ImageDefault}
                        alt="ảnh sản phẩm"
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-[16px] text-[16px] flex flex-col justify-between">
                      <Link
                        to={`/products/edit/${item.id}`}
                        className="text-[#383838] text-[16px] font-medium uppercase hover:text-blue-500"
                      >
                        {item?.name}
                      </Link>
                      <p className="text-[#CF5763] font-medium">
                        {formatNumber(item.item_price)}đ
                      </p>
                      <div className="flex gap-3 items-center">
                        <p className="text-[#383838] text-[14px]">
                          Số lượng : {item.quantity}
                        </p>
                        <p>
                          <Tooltip title="Sửa số lượng" color={"blue"}>
                            <EditOutlined
                              className="cursor-pointer"
                              onClick={() => {
                                setIsModalOpenQuantity(true);
                                setQuantity(item?.quantity);
                              }}
                            ></EditOutlined>{" "}
                          </Tooltip>
                        </p>
                        <Modal
                          title="Thay đổi số lượng"
                          open={isModalOpenQuantity}
                          onOk={() => {
                            const onSuccess = () => {
                              getOrderInfo(order_code);
                            };
                            updateOrder(
                              order_code,
                              { product_id: item.id, quantity: quantity },
                              onSuccess
                            );
                            setIsModalOpenQuantity(false);
                          }}
                          onCancel={(e) => {
                            e.stopPropagation();
                            setIsModalOpenQuantity(false);
                          }}
                          cancelText="Hủy"
                          okText="Xác nhận"
                        >
                          Số lượng{" "}
                          <Input
                            className="font-medium text-[#CF5763]"
                            value={quantity}
                            onChange={(e) => {
                              setQuantity(e.target.value);
                            }}
                          ></Input>
                        </Modal>
                      </div>
                      <p className="text-[#7d2c37] text-[14px]">
                        Hoa hồng : {formatNumber(item.commission_item)}
                      </p>
                    </div>
                  </div>
                );
              })
            : ""} */}
          <CartPageStyles className="cart-page">
            <div className="cart-container">
              <>
                <div className="row content flex xs:flex-col">
                  <div className="cart-items-list w-full">
                    <div className="box-cart">
                      {orderExists?.line_items?.map((item, key) => {
                        return (
                          <div
                            key={key}
                            style={{
                              background: "white",
                            }}
                          >
                            <div>
                              <ProductInCart
                                branchId={orderExists?.branch_id}
                                v={item}
                                handleUpdateCart={handleUpdateCart}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            </div>
          </CartPageStyles>
        </div>
        <div
          className="bg-white rounded-md p-4 mt-[20px] relative"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
        >
          <Tabs
            style={{ background: "#fff" }}
            defaultActiveKey="1"
            type="card"
            items={itemsTabs}
            loading={loading}
          />
          <Button
            className="absolute top-3 right-3"
            type="primary"
            onClick={openFormEdit}
          >
            Chỉnh sửa thông tin
          </Button>
          {modalInfoCustomer.isShow && (
            <Modal
              title={"Chỉnh sửa thông tin khách hàng"}
              open={modalInfoCustomer.isShow}
              onCancel={() => {
                setModalInfoCustomer((prev) => ({ ...prev, isShow: false }));
                // setSelectedAddress(null);
                resetDistrictAndWard();
              }}
              footer={false}
              centered
              okText="Đồng ý"
              cancelText="Hủy"
              width={800}
            >
              <InfoCustomerForm
                orderExists={orderExists}
                selectedAddress={orderExists.customer_address}
                onSubmit={onSubmitInfoCusForm}
              />
            </Modal>
          )}
        </div>
      </div>
    );
  };

  const renderTotalPayAndTransform = () => {
    return (
      <div>
        <div
          className="bg-white rounded-md p-3"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
        >
          <p>Tổng tiền</p>
          <div className="flex justify-between mt-1">
            <p>Tạm tính :</p>
            <p>{formatNumber(orderExists?.total_before_discount)}đ</p>
          </div>
          <div className="flex justify-between mt-1">
            <p>Phí giao hàng :</p>
            <p>
              <EditOutlined
                className="cursor-pointer"
                onClick={() => {
                  setIsModalOpenShippFee(true);
                  setShipFee(orderExists?.total_shipping_fee);
                }}
              ></EditOutlined>{" "}
              {formatNumber(orderExists?.total_shipping_fee) || 0}đ
            </p>
            <Modal
              title="Thay đổi phí vận chuyển"
              open={isModalOpenShippFee}
              onOk={() => {
                const onSuccess = () => {
                  getOrderInfo(order_code);
                };
                updateOrder(
                  order_code,
                  { total_shipping_fee: shipfee },
                  onSuccess
                );
                setIsModalOpenShippFee(false);
              }}
              onCancel={(e) => {
                e.stopPropagation();
                setIsModalOpenShippFee(false);
              }}
              cancelText="Hủy"
              okText="Xác nhận"
            >
              Phí vận chuyển{" "}
              <Input
                className="font-medium text-[#CF5763]"
                value={shipfee}
                onChange={(e) => {
                  setShipFee(e.target.value);
                }}
              ></Input>
            </Modal>
          </div>
          <div className="flex justify-between mt-1">
            <p>Thành tiền :</p>
            <p>{formatNumber(orderExists?.total_final)}đ</p>
          </div>
        </div>
      </div>
    );
  };

  const renderTransportStatus = () => {
    if (orderExists.order_ship_code) {
      return (
        <div
          className="bg-[#fff] p-[12px] mt-[20px] rounded-[6px] flex flex-col gap-[10px]"
          style={{ boxShadow: " rgba(0, 0, 0, 0.12) 0px 1px 4px;" }}
        >
          <div className="font-medium text-[#CF5763] uppercase">
            Trạng thái giao vận
          </div>
          <div className="flex flex-col gap-[10px]">
            <div>
              <div className="text-[16px] text-[#808080]">
                Đơn vị vận chuyển
              </div>
              <div>{orderExists.partner_shipper_name}</div>
            </div>
            <div>
              <div className="text-[16px] text-[#808080]">Mã vận đơn</div>
              <div>{orderExists.order_ship_code.from_shipper_code}</div>
            </div>
            <div>
              <div className="text-[16px] text-[#808080]">
                Đã gửi cho đơn giao vận
              </div>
              <div>{orderExists.order_ship_code.updated_at}</div>
            </div>
            <div className="flex justify-center">
              <button
                className="p-[7px_10px] bg-[#cf5763] text-[#fff] border-none rounded-[6px] cursor-pointer w-[160px]"
                onClick={handleCancelOrder}
              >
                {loadingOrder ? (
                  <Spin
                    indicator={antIcon}
                    className="text-[#fff] w-[15px] h-[15px]"
                    size="small"
                  />
                ) : (
                  "Huỷ kết nối vận chuyển"
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderPushOrder = () => {
    return (
      <div
        className="bg-[#fff] p-[12px] mt-[20px] rounded-[6px] flex flex-col gap-[10px]"
        style={{ boxShadow: " rgba(0, 0, 0, 0.12) 0px 1px 4px;" }}
      >
        <div>
          <div className="text-[#cf5763] text-[16px]">Giao vận</div>
        </div>
        <div>Đơn vị vận chuyển</div>
        <Select
          value={shipmentId}
          className="w-full"
          options={listShipmentOption()}
          onChange={(e) => {
            setShipmentId(e);
            const onSuccess = () => {
              getOrderInfo(order_code);
            };
            updateShipment({ partner_shipper_id: e }, order_code, onSuccess);
          }}
        ></Select>
        <div className="flex justify-between">
          <div>Thông tin kiện hàng</div>
          {isEdit ? (
            <div
              className="cursor-pointer text-[#1677ff]"
              onClick={() => setIsEdit(false)}
            >
              Sửa
            </div>
          ) : (
            <div
              className="cursor-pointer text-[#1677ff]"
              onClick={handleUpdatePackage}
            >
              Lưu
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[10px]">
          <Input
            prefix={<PackageWeight />}
            name="package_weight"
            suffix="Khối lượng(g)"
            disabled={isEdit}
            value={packageInfo.package_weight || 0}
            onChange={handleChangePackageInfo}
          ></Input>
          <Input
            prefix={<PackageHeight />}
            suffix="cao(cm)"
            name="package_height"
            disabled={isEdit}
            value={packageInfo.package_height || 0}
            onChange={handleChangePackageInfo}
          ></Input>
          <Input
            prefix={<PackageLength />}
            name="package_length"
            suffix="dài(cm)"
            disabled={isEdit}
            value={packageInfo.package_length || 0}
            onChange={handleChangePackageInfo}
          ></Input>
          <Input
            suffix="rộng(cm)"
            prefix={<PackageWidth />}
            disabled={isEdit}
            name="package_width"
            value={packageInfo.package_width || 0}
            onChange={handleChangePackageInfo}
          ></Input>
          <Input
            prefix={<PackageCod />}
            name="cod"
            suffix="cod"
            disabled={isEdit}
            value={packageInfo.cod || 0}
            onChange={handleChangePackageInfo}
          ></Input>
        </div>
        <div className="text-center  ">
          <button
            className="p-[7px_10px] text-[#fff] bg-[#cf5763] border-none rounded-[6px] cursor-pointer w-[115px]"
            onClick={handleSendOrder}
            disabled={loadingOrder}
          >
            {loadingOrder ? (
              <Spin
                indicator={antIcon}
                className="text-[#fff] w-[15px] h-[15px]"
                size="small"
              />
            ) : (
              "Đăng đơn hàng"
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F5F5F5] pb-[20px] w-full h-[100vh]">
      <Row>
        <Col
          span={24}
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: -30,
          }}
        >
          <ContentHeader
            title={`Chi tiết đơn hàng #${orderExists?.order_code}`}
          />
        </Col>
      </Row>
      <div className="flex gap-4 w-full mt-3">
        <div className=" w-[20%]">{renderOrderAndPaymentStatus()}</div>
        <div className="w-[60%]">{renderProductInfo()}</div>
        <div className="w-[20%]">
          <div>{renderTotalPayAndTransform()}</div>
          <div>
            {orderExists.order_ship_code
              ? renderTransportStatus()
              : renderPushOrder()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
