import React, { useState } from "react"
import {
  CarOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  HomeOutlined,
  ShopOutlined,
  ShoppingOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  MenuOutlined,
  CloseOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FinanceIcon,
  NewsIcon,
  OrderIcon,
  ProductIcon,
  SellerIcon,
  SettingIcon,
  StoreIcon,
  VoucherIcon,
} from "../../assets/icons";
import StartIcon from "../../assets/icons/StartIcon";
import Logo from "../../assets/images/text_logo_FLN.png";
import LogoCollapse from "../../assets/images/favicon.png"
import { StyledLogo, StyledSidebar } from "./Sidebar.style";
import { hasManagerPermission, hasSellerPermission } from "../../utils/permission";

const Sidebar = ({ collapsed }) => {
  // const badges = JSON.parse(localStorage.getItem('badges'))
  const path = window.location.pathname;
  const navigate = useNavigate();
  const [showMenuMobile, setShowMenuMobile] = useState(false)
  const [menuSidebar, setMenuSidebar] = useState([])

  useEffect(() => {
    window.addEventListener("beforeunload", () => {});
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, [navigate]);

  useEffect(() => {
    setMenuSidebar(initMenuSidebar)
  }, [JSON.stringify(localStorage.getItem("user"))])

  const initMenuSidebar = [
    {
      key: "/",
      icon: <DashboardOutlined style={{ color: "#4595ef" }} />,
      label: (
        <Link className="flex justify-between" to="/">
          Tổng quan
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/shops",
      // icon: <StoreIcon classNstyle={{color: "#ff98aa"}}ame="w-[16px]"/>,
      icon: <ShopOutlined style={{ color: "red" }} />,
      label: (
        <Link className="flex justify-between" to="shops">
          Cửa hàng{" "}
          <div>
            {/* ( <span className='font-medium'>{total_stores}</span> ) */}
          </div>
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/templates",
      icon: <FileDoneOutlined style={{ color: "#9a10d0" }} />,
      label: (
        <Link className="flex justify-between" to="templates">
          Quản lý template
          <div>
            {/* ( <span className='font-medium'>{total_identify_profile}</span> ) */}
          </div>
        </Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/users",
      icon: <UsergroupAddOutlined style={{ color: "#52dc07" }} />,
      label: (
        <Link className="flex justify-between" to="users">Quản lý user</Link>
      ),
      hasPer: hasManagerPermission()
    },
    {
      key: "/crawl",
      icon: <FinanceIcon style={{ color: "#230fff" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to="crawl">Listings</Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/check-label",
      icon: <SearchOutlined style={{ color: "#ff800f" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to="/check-label">Kiếm tra Label đã mua</Link>
      ),
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/transport",
      icon: <CarOutlined style={{ color: "#0c5f20" }} />,
      label: (
        <Link className="flex justify-between" to={path}>
          Vận chuyển
        </Link>
      ),
      children: [
        {
          key: "subTransport1",
          label: (
            <Link className="flex justify-between" to="/#">
              Đơn vị vẫn chuyển
            </Link>
          ),
        },
        {
          key: "subTransport2",
          label: (
            <Link className="flex justify-between" to="/#">
              Cài đặt vận chuyển
            </Link>
          ),
        },
      ],
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/supplierWarehouse",
      icon: <HomeOutlined style={{ color: "#2d72aa" }} />,
      label: (
        <Link className="flex justify-between" to={path}>
          Kho NCC
        </Link>
      ),
      children: [
        {
          key: "subSupplierWarehouse1",
          label: (
            <Link className="flex justify-between" to="/#">
              Thống kê
            </Link>
          ),
        },
        {
          key: "subSupplierWarehouse2",
          label: (
            <Link className="flex justify-between" to="/#">
              Cài đặt kho
            </Link>
          ),
        },
        {
          key: "subSupplierWarehouse3",
          label: (
            <Link className="flex justify-between" to="/#">
              Quy tắc kho
            </Link>
          ),
        },
      ],
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/productReviews",
      icon: <StartIcon style={{ color: "#F0AD00" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to={path}>
          Đánh giá sản phẩm
        </Link>
      ),
      children: [
        {
          key: "subProductReviews1",
          label: (
            <Link className="flex justify-between" to="/#">
              Tổng quan đánh giá
            </Link>
          ),
        },
        {
          key: "subProductReviews2",
          label: (
            <Link className="flex justify-between" to="/#">
              Quy tắc đánh giá
            </Link>
          ),
        },
        {
          key: "subProductReviews3",
          label: (
            <Link className="flex justify-between" to="/#">
              Làm nhiệm vụ cải thiện
            </Link>
          ),
        },
      ],
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/news",
      icon: <NewsIcon style={{ color: "#f78b0c" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to={path}>
          Tin tức
        </Link>
      ),
      children: [
        {
          key: "subNews1",
          label: (
            <Link className="flex justify-between" to="/#">
              Danh mục
            </Link>
          ),
        },
        {
          key: "subNews2",
          label: (
            <Link className="flex justify-between" to="/#">
              Bài đăng
            </Link>
          ),
        },
      ],
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
    {
      key: "/settings",
      icon: <SettingIcon style={{ color: "#3341da" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to={path}>
          Cài đặt chung
        </Link>
      ),
      children: [
        {
          key: "/theme",
          label: (
            <Link className="flex justify-between" to="/theme">
              Cài đặt giao diện
            </Link>
          ),
        },
        {
          key: "subSettings1",
          label: (
            <Link className="flex justify-between" to="/#">
              Ngôn ngữ
            </Link>
          ),
        },
        {
          key: "subSettings2",
          label: (
            <Link className="flex justify-between" to="/#">
              Tiền tệ
            </Link>
          ),
        },
        {
          key: "subSettings3",
          label: (
            <Link className="flex justify-between" to="/#">
              Phân quyền
            </Link>
          ),
        },
        {
          key: "subSettings4",
          label: (
            <Link className="flex justify-between" to="/#">
              Hình thức vận chuyển
            </Link>
          ),
        },
        {
          key: "subSettings5",
          label: (
            <Link className="flex justify-between" to="/#">
              Hình thức thanh toán
            </Link>
          ),
        },
        {
          key: "subSettings6",
          label: (
            <Link className="flex justify-between" to="/#">
              Danh mục sản phẩm
            </Link>
          ),
        },
      ],
      hasPer: hasManagerPermission() || hasSellerPermission()
    },
  ];

  if (!hasManagerPermission() && !hasSellerPermission()) {
    return null
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
      <span className="inline-block w-[30px] h-[30px] leading-[28px] border-[1px] border-[#d9d9d9] border-solid text-center text-lg md:hidden absolute top-[19px] left-[15px] z-20" onClick={() => setShowMenuMobile(!showMenuMobile)}>
        {showMenuMobile ?  <CloseOutlined /> : <MenuOutlined/>}
      </span>
      <div className={`${showMenuMobile ? 'block absolute top-[60px] left-[0] right-[0] z-20 bg-white pb-10 md:pb-0 md:static' : 'hidden'} md:block`}>
        <StyledLogo className="!hidden md:!flex">
          {collapsed ?
            <img 
              src={Logo}
              alt="logo cms"
              width={200}
            />
          :
            <img 
              src={LogoCollapse}
              alt="logo cms"
              width={35}
            />
          }
        
        </StyledLogo>
        <Scrollbars
          style={{ height: "calc(100vh - 64px)" }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
        >
          <Menu
            items={menuSidebar.filter((item) => item.hasPer)}
            theme="light"
            mode="inline"
            defaultSelectedKeys={[path]}
            selectedKeys={[path]}
            style={{
              margin: "16px 0",
              minHeight: "100vh - 80px",
              background: "#fff",
            }}
          />
        </Scrollbars>
      </div>
    </StyledSidebar>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};

Sidebar.defaultProps = {
  collapsed: false,
};
