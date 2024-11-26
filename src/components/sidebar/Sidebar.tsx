import {
  CarOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  HomeOutlined,
  ShopOutlined,
  ShoppingOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { useEffect } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  FinanceIcon,
  NewsIcon,
  ProductIcon,
  SellerIcon,
  SettingIcon,
  VoucherIcon,
} from '../../assets/icons'
import StartIcon from '../../assets/icons/StartIcon'
import LOGO from '../../assets/images/logo.svg'
import { StyledLogo, StyledSidebar } from './Sidebar.style'

const Sidebar = ({ collapsed }) => {
  // const badges = JSON.parse(localStorage.getItem('badges'))
  const path = window.location.pathname
  const navigate = useNavigate()

  useEffect(() => {
    window.addEventListener('beforeunload', () => {})
    return () => {
      window.removeEventListener('beforeunload', () => {})
    }
  }, [navigate])
  // const {
  //   product_progressing,
  //   product_approved,
  //   product_delete,
  //   product_unapproved,
  //   product_violation,
  //   total_voucher,
  //   total_products,
  //   total_sellers,
  //   total_identify_profile,
  //   total_stores,
  // } = badges ?? {}

  const menuSidebar = [
    {
      key: '/',
      icon: <DashboardOutlined style={{ color: '#4595ef' }} />,
      label: (
        <Link className="flex justify-between" to="/">
          Tổng quan
        </Link>
      ),
    },
    {
      key: '/all-packages',
      icon: <AppstoreOutlined style={{ color: '#ff9001' }} />,
      label: (
        <Link className="flex justify-between" to="/all-packages">
          All Packages
          <div>{/* Uncomment and add content here if needed */}</div>
        </Link>
      ),
    },
    {
      key: '/identity-request',
      icon: <FileDoneOutlined style={{ color: '#9a10d0' }} />,
      label: (
        <Link className="flex justify-between" to="/all-packages/status">
          Quản lý Xưởng
          <div>{/* Uncomment and add content here if needed */}</div>
        </Link>
      ),
    },
  ];
  
   

  

  return (
    <StyledSidebar trigger={null} collapsible collapsed={!collapsed} width={300} theme='light'>
      <StyledLogo>
        <img src={LOGO} alt='logo cms' width={!collapsed ? 35 : 100} height={35} />
      </StyledLogo>
      <Scrollbars
        style={{ height: 'calc(100vh - 64px)' }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <Menu
          items={menuSidebar}
          theme='light'
          mode='inline'
          defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          style={{
            margin: '16px 0',
            minHeight: '100vh - 80px',
            background: '#fff',
          }}
        />
      </Scrollbars>
    </StyledSidebar>
  )
}

export default Sidebar

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
}

Sidebar.defaultProps = {
  collapsed: false,
}
