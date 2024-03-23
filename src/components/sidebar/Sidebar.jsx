import {
  AntDesignOutlined,
  CloseOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  GoogleOutlined,
  MenuOutlined,
  SearchOutlined,
  ShopOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, useNavigate } from 'react-router-dom';
import { FinanceIcon } from '../../assets/icons';
import LogoCollapse from '../../assets/images/favicon.png';
import Logo from '../../assets/images/text_logo_FLN.png';
import { hasDesignerPermission, hasManagerPermission, hasSellerPermission } from '../../utils/permission';
import { StyledLogo, StyledSidebar } from './Sidebar.style';
import { useAuthStore } from '../../store/authStore';

function Sidebar({ collapsed }) {
  const path = window.location.pathname;
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [showMenuMobile, setShowMenuMobile] = useState(false);
  const [menuSidebar, setMenuSidebar] = useState([]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {});
    return () => {
      window.removeEventListener('beforeunload', () => {});
    };
  }, [navigate]);

  const initMenuSidebar = [
    {
      key: '/',
      icon: <DashboardOutlined style={{ color: '#4595ef' }} />,
      label: (
        <Link className="flex justify-between" to="/">
          Tổng quan
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission() || hasDesignerPermission(),
    },
    {
      key: '/shops',
      icon: <ShopOutlined style={{ color: 'red' }} />,
      label: (
        <Link className="flex justify-between" to="shops">
          Cửa hàng{' '}
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission(),
      // children: initialChildrenShopTab()
    },
    {
      key: '/templates',
      icon: <FileDoneOutlined style={{ color: '#9a10d0' }} />,
      label: (
        <Link className="flex justify-between" to="templates">
          Quản lý template
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission(),
    },
    {
      key: '/users',
      icon: <UsergroupAddOutlined style={{ color: '#52dc07' }} />,
      label: (
        <Link className="flex justify-between" to="users">
          Quản lý user
        </Link>
      ),
      hasPer: hasManagerPermission(),
    },
    {
      key: '/crawl',
      icon: <FinanceIcon style={{ color: '#230fff' }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to="crawl">
          Crawl products
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission(),
    },
    {
      key: '/google-trends',
      icon: <GoogleOutlined style={{ color: '#230fff' }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to="google-trends">
          Google Trends
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission(),
    },
    {
      key: '/check-label',
      icon: <SearchOutlined style={{ color: '#ff800f' }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to="/check-label">
          Kiếm tra Label đã mua
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission(),
    },
    {
      key: '/design-sku',
      icon: <AntDesignOutlined style={{ color: '#0f2aff' }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to="/design-sku">
          Design Sku
        </Link>
      ),
      hasPer: hasDesignerPermission(),
    },
  ];

  useEffect(() => {
    setMenuSidebar(initMenuSidebar);
  }, [profile]);

  if (!hasManagerPermission() && !hasSellerPermission() && !hasDesignerPermission()) {
    return null;
  }

  return (
    <StyledSidebar
      trigger={null}
      collapsible
      collapsed={!collapsed}
      theme="light"
      width={300}
      className="!w-full !max-w-full md:w-[300px] !static"
    >
      <span
        className="inline-block w-[30px] h-[30px] leading-[28px] border-[1px] border-[#d9d9d9] border-solid text-center text-lg md:hidden absolute top-[19px] left-[15px] z-20"
        onClick={() => setShowMenuMobile(!showMenuMobile)}
      >
        {showMenuMobile ? <CloseOutlined /> : <MenuOutlined />}
      </span>
      <div
        className={`${
          showMenuMobile
            ? 'block absolute top-[60px] left-[0] right-[0] z-20 bg-white pb-10 md:pb-0 md:static'
            : 'hidden'
        } md:block`}
      >
        <StyledLogo className="!hidden md:!flex">
          {collapsed ? (
            <img src={Logo} alt="logo cms" width={200} />
          ) : (
            <img src={LogoCollapse} alt="logo cms" width={35} />
          )}
        </StyledLogo>
        <Scrollbars style={{ height: 'calc(100vh - 64px)' }} autoHide autoHideTimeout={1000} autoHideDuration={200}>
          <Menu
            items={menuSidebar.filter((item) => item.hasPer)}
            theme="light"
            mode="inline"
            defaultSelectedKeys={[path]}
            selectedKeys={[path]}
            style={{
              margin: '16px 0',
              minHeight: '100vh - 80px',
              background: '#fff',
            }}
          />
        </Scrollbars>
      </div>
    </StyledSidebar>
  );
}

export default Sidebar;

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};

Sidebar.defaultProps = {
  collapsed: false,
};
