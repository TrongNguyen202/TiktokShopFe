import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import React, { Suspense, lazy, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import Login from './pages/login'
import { PATH } from './constants/paths'
import { getToken } from './utils/auth'
import 'react-toastify/dist/ReactToastify.css'
import ForgotPassword from './pages/login/ForgotPassword'
import IdentityDetail from './pages/identityRequest/IdentityDetail'
import Loading from './components/loading/Index'
import MainLayout from './layouts/mainLayout/MainLayout'
import ProductDetail from './pages/products/ProductDetail'
import VoucherForm from './pages/vouchers/VoucherForm'
import { useBadgesStore } from './store/badgesStore'

const Sellers = lazy(() => import('./pages/sellers/Index'))
const Home = lazy(() => import('./pages/home/Index.jsx'))
const Stores = lazy(() => import('./pages/stores/index'))
const Vouchers = lazy(() => import('./pages/vouchers'))
const Products = lazy(() => import('./pages/products'))
const Customers = lazy(() => import('./pages/customers'))
const Categories = lazy(() => import('./pages/categories'))
const AllPackages = lazy(() => import('./pages/all-packages'))
const PackagesStatus = lazy(() => import('./pages/all-packages/status'))
const HomepageInterface = lazy(() => import('./pages/settings/homepageInterface'))
const IdentityRequest = lazy(() => import('./pages/identityRequest/Index'))
const StoreDetail = lazy(() => import('./pages/stores/StoreDetail.jsx'))

const PrivateRoute = () => {
  const { getAllBadges } = useBadgesStore()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken()
      setAuthenticated(token !== null)
      setLoading(false)
    }

    checkAuthentication()
    getAllBadges()
  }, [])

  if (loading) {
    return null
  }

  if (!authenticated) {
    return <Navigate to='/login' />
  }

  return <Outlet />
}

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/' element={<MainLayout />}>
              <Route
                path={PATH.HOME}
                element={
                  <Suspense fallback={<Loading />}>
                    <Home />
                  </Suspense>
                }
              />
              {/* Yêu cầu định danh */}
              <Route
                path='/identity-request'
                element={
                  <Suspense fallback={<Loading />}>
                    <IdentityRequest />
                  </Suspense>
                }
              />
              <Route path='/identity-request/:identityId' element={<IdentityDetail />} />
              {/* Sellers */}
              <Route
                path='/sellers'
                element={
                  <Suspense fallback={<Loading />}>
                    <Sellers />
                  </Suspense>
                }
              />
              {/* Stores */}
              <Route
                path='/shops'
                element={
                  <Suspense fallback={<Loading />}>
                    <Stores />
                  </Suspense>
                }
              />
              <Route
                path='/shops/:id'
                element={
                  <Suspense fallback={<Loading />}>
                    <StoreDetail />
                  </Suspense>
                }
              />

              {/* all packages */}
              <Route
                path='/all-packages'
                element={
                  <Suspense fallback={<Loading />}>
                    <AllPackages />
                  </Suspense>
                }
              />

              <Route
                path='/all-packages/status'
                element={
                  <Suspense fallback={<Loading />}>
                    <PackagesStatus />
                  </Suspense>
                }
              />
              

              {/* Products */}
              <Route
                path='/products'
                element={
                  <Suspense fallback={<Loading />}>
                    <Products />
                  </Suspense>
                }
              />
              <Route
                path='/products/status/:productStatus'
                element={
                  <Suspense fallback={<Loading />}>
                    <Products />
                  </Suspense>
                }
              />
              <Route path='/products/:productId' element={<ProductDetail />} />
              {/* Vouchers */}
              <Route
                path='/vouchers'
                element={
                  <Suspense fallback={<Loading />}>
                    <Vouchers />
                  </Suspense>
                }
              />
              <Route path='/vouchers/create' element={<VoucherForm />} />
              <Route path='/vouchers/:voucherId' element={<VoucherForm />} />
              {/* Customers */}
              <Route
                path='/customers'
                element={
                  <Suspense fallback={<Loading />}>
                    <Customers />
                  </Suspense>
                }
              />
              {/* Categories */}
              <Route
                path='/categories'
                element={
                  <Suspense fallback={<Loading />}>
                    <Categories />
                  </Suspense>
                }
              />
              
              {/* Settings */}
              <Route
                path='/theme'
                element={
                  <Suspense fallback={<Loading />}>
                    <HomepageInterface />
                  </Suspense>
                }
              />
            </Route>
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}
export default App
