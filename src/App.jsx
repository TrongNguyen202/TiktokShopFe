import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './components/loading';
import { PATH } from './constants/paths';
import MainLayout from './layouts/mainLayout/MainLayout';
import ForgotPassword from './pages/login/ForgotPassword';
import Login from './pages/login/index';
import Template from './pages/templates/index';
import { getToken } from './utils/auth';
import FlashDealForm from './pages/promotions/FlashDealForm';

const Sellers = lazy(() => import('./pages/sellers/index'));
const Home = lazy(() => import('./pages/home/index'));

const Stores = lazy(() => import('./pages/stores/index'));
const StoreDetail = lazy(() => import('./pages/stores/StoreDetail'));

const Products = lazy(() => import('./pages/products'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));
const ProductEdit = lazy(() => import('./pages/products/ProductEdit'));
const MultiAddProducts = lazy(() => import('./pages/stores/MultiAddProducts'));
const ProductCreate = lazy(() => import('./pages/products/ProductCreate'));

const CreateLabel = lazy(() => import('./pages/orders/CreateLabel'));
const Fulfillment = lazy(() => import('./pages/orders/Fulfillment'));

const Orders = lazy(() => import('./pages/orders'));
const OrderCheckBoughtLabel = lazy(() => import('./pages/orders/OrderCheckBoughtLabel'));
const OrderCheckDesign = lazy(() => import('./pages/orders/OrderCheckDesign'));
const OrderDetail = lazy(() => import('./pages/orders/OrderDetail'));
const OrderCompleteFulfillment = lazy(() => import('./pages/orders/OrderCompleteFulfillment'));

const DesignSku = lazy(() => import('./pages/designSku'));
const Users = lazy(() => import('./pages/users'));
const UserEdit = lazy(() => import('./pages/users/UserEdit'));
const Account = lazy(() => import('./pages/account'));
const PromotionFrom = lazy(() => import('./pages/promotions/PromotionForm'));
const Promotion = lazy(() => import('./pages/promotions'));
const Crawl = lazy(() => import('./pages/crawl'));

function PrivateRoute() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken();
      setAuthenticated(token !== null);
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return null;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function App() {
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

              {/* Sellers */}
              <Route
                path="/sellers"
                element={
                  <Suspense fallback={<Loading />}>
                    <Sellers />
                  </Suspense>
                }
              />
              <Route
                path="/crawl"
                element={
                  <Suspense fallback={<Loading />}>
                    <Crawl />
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
                path="/shops/:id/products/create"
                element={
                  <Suspense fallback={<Loading />}>
                    <ProductCreate />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/orders"
                element={
                  <Suspense fallback={<Loading />}>
                    <Orders />
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

              <Route
                path="/shops/:id/orders/create-label"
                element={
                  <Suspense fallback={<Loading />}>
                    <CreateLabel />
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
                path="/shops/:id/orders/fulfillment/completed"
                element={
                  <Suspense fallback={<Loading />}>
                    <OrderCompleteFulfillment />
                  </Suspense>
                }
              />

              {/* promotions */}
              <Route
                path="/shops/:id/orders/check-design"
                element={
                  <Suspense fallback={<Loading />}>
                    <OrderCheckDesign />
                  </Suspense>
                }
              />

              {/* Label */}
              <Route
                path="/check-label"
                element={
                  <Suspense fallback={<Loading />}>
                    <OrderCheckBoughtLabel />
                  </Suspense>
                }
              />

              {/* Design Sku */}
              <Route
                path="/shops/:id/promotions"
                element={
                  <Suspense fallback={<Loading />}>
                    <Promotion />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/promotions/discounts"
                element={
                  <Suspense fallback={<Loading />}>
                    <PromotionFrom />
                  </Suspense>
                }
              />

              <Route
                path="/shops/:id/promotions/flash-deal"
                element={
                  <Suspense fallback={<Loading />}>
                    <FlashDealForm />
                  </Suspense>
                }
              />

              {/* Users */}
              <Route
                path="/users"
                element={
                  <Suspense fallback={<Loading />}>
                    <Users />
                  </Suspense>
                }
              />

              <Route
                path="/users/edit/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <UserEdit />
                  </Suspense>
                }
              />
              <Route
                path="/account"
                element={
                  <Suspense fallback={<Loading />}>
                    <Account />
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
}
export default App;
