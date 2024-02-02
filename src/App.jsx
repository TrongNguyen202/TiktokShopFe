import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/loading/Index";
import { PATH } from "./constants/paths";
import MainLayout from "./layouts/mainLayout/MainLayout";
import Login from "./pages/login";
import ForgotPassword from "./pages/login/ForgotPassword";
import Template from "./pages/templates/index.jsx";
import VoucherForm from "./pages/vouchers/VoucherForm";
import { useBadgesStore } from "./store/badgesStore";
import { getToken } from "./utils/auth";

const Sellers = lazy(() => import("./pages/sellers/Index"));
const Home = lazy(() => import("./pages/home/Index.jsx"));
const Stores = lazy(() => import("./pages/stores/index"));
const Vouchers = lazy(() => import("./pages/vouchers"));
const Products = lazy(() => import("./pages/products"));
const ProductDetail = lazy(() => import("./pages/products/ProductDetail.jsx"));
const ProductEdit = lazy(() => import("./pages/products/ProductEdit.jsx"));
const Brands = lazy(() => import("./pages/brands"));
const Orders = lazy(() => import("./pages/orders"));
const Fulfillment = lazy(() => import("./pages/orders/Fulfillment.jsx"));
const OrderCheckDesign= lazy(() => import("./pages/orders/OrderCheckDesign.jsx"));
const OrderFlashShip= lazy(() => import("./pages/orders/OrderFlashShip.jsx"));
const Customers = lazy(() => import("./pages/customers"));
const Categories = lazy(() => import("./pages/categories"));
const HomepageInterface = lazy(
  () => import("./pages/settings/homepageInterface")
);
const IdentityRequest = lazy(() => import("./pages/identityRequest/Index"));
const StoreDetail = lazy(() => import("./pages/stores/StoreDetail.jsx"));
const MultiAddProducts = lazy(
  () => import("./pages/stores/MultiAddProducts.jsx")
);
const Order = lazy(() => import("./pages/orders/index.jsx"));
const OrderDetail = lazy(() => import("./pages/orders/OrderDetail.jsx"));
const ProductCreate = lazy(() => import ('./pages/products/ProductCreate.jsx'))

const PrivateRoute = () => {
  const { getAllBadges } = useBadgesStore();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken();
      setAuthenticated(token !== null);
      setLoading(false);
    };

    checkAuthentication();
    // getAllBadges()
  }, []);

  if (loading) {
    return null;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route
                path={PATH.HOME}
                element={
                  <Suspense fallback={<Loading />}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path="/templates"
                element={
                  <Suspense fallback={<Loading />}>
                    <Template />
                  </Suspense>
                }
              />
              <Route
                path="shops/:shop_id/orders"
                element={
                  <Suspense fallback={<Loading />}>
                    <Order />
                  </Suspense>
                }
              ></Route>
              <Route
                path="shops/:shop_id/order/:order_code"
                element={
                  <Suspense fallback={<Loading />}>
                    <OrderDetail />
                  </Suspense>
                }
              ></Route>
              {/* Sellers */}
              <Route
                path="/sellers"
                element={
                  <Suspense fallback={<Loading />}>
                    <Sellers />
                  </Suspense>
                }
              />
              {/* Stores */}
              <Route
                path="/shops"
                element={
                  <Suspense fallback={<Loading />}>
                    <Stores />
                  </Suspense>
                }
              />
              <Route
                path="/shops/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <StoreDetail />
                  </Suspense>
                }
              />
              <Route
                path="/shops/:id/add-many-products"
                element={
                  <Suspense fallback={<Loading />}>
                    <MultiAddProducts />
                  </Suspense>
                }
              />
              {/* Products */}
              <Route
                path="/shops/:id/products"
                element={
                  <Suspense fallback={<Loading />}>
                    <Products />
                  </Suspense>
                }
              />
              <Route
                path="/products/status/:productStatus"
                element={
                  <Suspense fallback={<Loading />}>
                    <Products />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/products/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <ProductDetail />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/products/:id/edit"
                element={
                  <Suspense fallback={<Loading />}>
                    <ProductEdit />
                  </Suspense>
                }
              />

              <Route
                path='/shops/:id/products/create'
                element={
                  <Suspense fallback={<Loading />}>
                    <ProductCreate />
                  </Suspense>
                }
              />

              {/* brands */}
              <Route
                path="/shops/:id/brands"
                element={
                  <Suspense fallback={<Loading />}>
                    <Brands />
                  </Suspense>
                }
              />

              {/* orders */}
              <Route
                path="/shops/:id/orders"
                element={
                  <Suspense fallback={<Loading />}>
                    <Orders />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/orders/fulfillment"
                element={
                  <Suspense fallback={<Loading />}>
                    <Fulfillment />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/orders/check-design"
                element={
                  <Suspense fallback={<Loading />}>
                    <OrderCheckDesign />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/orders/order-flash-ship"
                element={
                  <Suspense fallback={<Loading />}>
                    <OrderFlashShip />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/orders/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <OrderDetail />
                  </Suspense>
                }
              />

              {/* Vouchers */}
              <Route
                path="/vouchers"
                element={
                  <Suspense fallback={<Loading />}>
                    <Vouchers />
                  </Suspense>
                }
              />
              <Route path="/vouchers/create" element={<VoucherForm />} />
              <Route path="/vouchers/:voucherId" element={<VoucherForm />} />

              {/* Customers */}
              <Route
                path="/customers"
                element={
                  <Suspense fallback={<Loading />}>
                    <Customers />
                  </Suspense>
                }
              />

              {/* Categories */}
              <Route
                path="shops/:id/categories"
                element={
                  <Suspense fallback={<Loading />}>
                    <Categories />
                  </Suspense>
                }
              />

              {/* Settings */}
              <Route
                path="/theme"
                element={
                  <Suspense fallback={<Loading />}>
                    <HomepageInterface />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
export default App;
