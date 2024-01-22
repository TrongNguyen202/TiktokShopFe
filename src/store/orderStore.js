import { create } from "zustand";
import { RepositoryRemote } from "../services";
import { toast } from "react-toastify";

export const useOrderStore = create((set) => ({
  orders: {},
  orderExists: {},
  historyOrderById: [],
  tableInfo: {},
  perpage: {},
  loading: false,
  loadingStatus: false,
  shippingCode: {},
  linkPDF: {},
  totalRevenue: 0,
  listShipment: [],
  loadingOrder: false,
  getAllOrders: async (query, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getAllOrders(query);
      set({ orders: response.data.data.data });
      set({
        totalRevenue: response.data.data.data.reduce(
          (accumulator, currentValue) => {
            return accumulator + currentValue.total_after_pay_community;
          },
          0
        ),
      });
      set({ tableInfo: response.data.data });
      set({ perpage: response?.data?.data?.per_page });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getOrderById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getOrderById(id);
      set({ orderExists: response?.data?.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getHistoryOrderById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getHistoryOrderById(id);
      set({ historyOrderById: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  changeOrderStatus: async (
    orderCode,
    status,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loadingStatus: true });
      const response = await RepositoryRemote.orders.changeOrderStatus(
        orderCode,
        { order_code: orderCode, order_status_code: status }
      );
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingStatus: false });
  },
  sendOrderToShipper: async (
    orderCode,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.sendOrderToShipper(
        orderCode,
        { order_code: orderCode }
      );
      set({ shippingCode: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getLinkPDF: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.getLinkPDF(id);
      set({ linkPDF: response?.data?.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  changePaymentStatus: async (
    orderId,
    status_code,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      const response = await RepositoryRemote.orders.changePaymentStatus(
        orderId,
        status_code
      );
      onSuccess(response.data.data);
    } catch (error) {
      console.log(error);
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loading: false });
  },
  getListShipment: async () => {
    try {
      const response = await RepositoryRemote.orders.getListShipment();
      set({ listShipment: response?.data?.data });
    } catch (error) {
      console.log("error", error);
    }
  },
  sendOrder: async (order_code, onSuccess) => {
    try {
      set({ loadingOrder: true });
      const response = await RepositoryRemote.orders.sendOrder(order_code);
      if (response.data.code === 200 || response.data.code === 201) {
        onSuccess();
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.msg);
    }
    set({ loadingOrder: false });
  },
  updatePackage: async (data, order_code, onSuccess = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.updatePackage(
        data,
        order_code
      );
      if (response.data.code === 200 || response.data.code === 201) {
        toast.success("Cập nhật thông tin đơn hàng thành công");
        onSuccess();
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Có lỗi xảy ra");
    }
  },
  updateShipment: async (data, order_code, onSuccess = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.updateShipment(
        data,
        order_code
      );
      if (response.data.code === 200 || response.data.code === 201) {
        toast.success("Cập nhật đơn vị vận chuyển thành công");
        onSuccess();
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.msg);
    }
  },
  cancelOrder: async (order_code, onSuccess = () => {}) => {
    try {
      set({ loadingOrder: true });
      const response = await RepositoryRemote.orders.cancelOrder(order_code);
      if (response.data.code === 200 || response.data.code === 201) {
        toast.success("Huỷ đơn vị vận chuyển thành công");
        onSuccess();
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.msg);
    }
    set({ loadingOrder: false });
  },
  updateOrder: async(order_code,data,onSuccess=()=>{})=>{
    try {
      const response = await RepositoryRemote.orders.updateOrder(order_code,data);
      if (response.data.code === 200 || response.data.code === 201) {
        toast.success("Cập nhật đơn hàng thành công");
        onSuccess();
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.msg);
    }
  },
  updateCart: async (orderId, data, onSuccess = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.updateCart(orderId, data);
      // set({cartInfo:response.data.data})
      onSuccess();
    } catch (error) {
      console.log("error", error);
    }
  },
}));
