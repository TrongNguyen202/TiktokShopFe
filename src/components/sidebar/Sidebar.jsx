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
  CloseOutlined
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
  VoucherIcon,
} from "../../assets/icons";
import StartIcon from "../../assets/icons/StartIcon";
import Logo from "../../assets/images/text_logo_FLN.png";
import LogoCollapse from "../../assets/images/favicon.png"
import { StyledLogo, StyledSidebar } from "./Sidebar.style";

const Sidebar = ({ collapsed }) => {
  // const badges = JSON.parse(localStorage.getItem('badges'))
  const path = window.location.pathname;
  const navigate = useNavigate();
  const [showMenuMobile, setShowMenuMobile] = useState(false)

  useEffect(() => {
    window.addEventListener("beforeunload", () => {});
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, [navigate]);
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
      key: "/",
      icon: <DashboardOutlined style={{ color: "#4595ef" }} />,
      label: (
        <Link className="flex justify-between" to="/">
          Tổng quan
        </Link>
      ),
    },
    // {
    //   key: "/order",
    //   icon: <OrderIcon style={{ color: "#4595ef" }} className="w-[16px]" />,
    //   label: (
    //     <Link className="flex justify-between" to="order">
    //       Đơn hàng
    //     </Link>
    //   ),
    // },
    // {
    //   key: "/sellers",
    //   icon: <SellerIcon style={{ color: "#ff98aa" }} className="w-[16px]" />,
    //   label: (
    //     <Link to="sellers" className="flex justify-between">
    //       Seller{" "}
    //       <div>
    //         {/* ( <span className='font-medium'>{total_sellers}</span> ) */}
    //       </div>
    //     </Link>
    //   ),
    // },
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
    },
    {
      key: "/users",
      icon: <UsergroupAddOutlined style={{ color: "#52dc07" }} />,
      label: (
        <Link className="flex justify-between" to="users">Quản lý user</Link>
      ),
    },
    // {
    //   key: "/products",
    //   icon: <ProductIcon style={{ color: "#ff6900" }} className="w-[16px]" />,
    //   label: (
    //     <Link className="flex justify-between" to={path}>
    //       Sản phẩm
    //     </Link>
    //   ),
    //   children: [
    //     {
    //       key: "/products",
    //       label: (
    //         <Link className="flex justify-between" to="/products">
    //           Tất cả{" "}
    //           <div>
    //           </div>
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "/products/status/2",
    //       label: (
    //         <Link
    //           className="flex justify-between text-[#27AE60]"
    //           to="/products/status/2"
    //           style={{ color: "#27AE60" }}
    //         >
    //           Đang hiển thị{" "}
    //           <div>
    //             {/* ( <span className='font-medium'>{product_approved}</span> ) */}
    //           </div>
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "/products/status/0",
    //       label: (
    //         <Link
    //           className="flex justify-between"
    //           to="/products/status/0"
    //           style={{ color: "#218ECB" }}
    //         >
    //           Cần duyệt{" "}
    //           <div>
    //             {/* ( <span className='font-medium'>{product_progressing}</span> ) */}
    //           </div>
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "/products/status/1",
    //       label: (
    //         <Link
    //           className="flex justify-between"
    //           to="/products/status/1"
    //           style={{ color: "#E83A2F" }}
    //         >
    //           Vi phạm{" "}
    //           <div>
    //             {/* ( <span className='font-medium'>{product_violation}</span> ) */}
    //           </div>
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "/products/status/3",
    //       label: (
    //         <Link
    //           className="flex justify-between"
    //           to="/products/status/3"
    //           style={{ color: "#F0AD00" }}
    //         >
    //           Từ chối{" "}
    //           <div>
    //             {/* ( <span className='font-medium'>{product_unapproved}</span> ) */}
    //           </div>
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "/products/status/4",
    //       label: (
    //         <Link
    //           className="flex justify-between"
    //           to="/products/status/4"
    //           style={{ color: "#FF833D" }}
    //         >
    //           Đã xóa{" "}
    //           <div>
    //             {/* ( <span className='font-medium'>{product_delete}</span> ) */}
    //           </div>
    //         </Link>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   key: "/vouchers",
    //   icon: <VoucherIcon style={{ color: "red" }} className="w-[16px]" />,
    //   label: (
    //     <Link className="flex justify-between" to="/vouchers">
    //       Vouchers{" "}
    //       <div>
    //         {/* ( <span className='font-medium'>{total_voucher}</span> ) */}
    //       </div>
    //     </Link>
    //   ),
    // },
    // {
    //   key: "/categories",
    //   icon: <ShoppingOutlined style={{ color: "#03aaff" }} />,
    //   label: (
    //     <Link className="flex justify-between" to="/categories">
    //       Danh mục
    //     </Link>
    //   ),
    // },
    {
      key: "/finance",
      icon: <FinanceIcon style={{ color: "#230fff" }} className="w-[16px]" />,
      label: (
        <Link className="flex justify-between" to={path}>
          Tài chính
        </Link>
      ),
      children: [
        {
          key: "subFinance1",
          label: (
            <Link className="flex justify-between" to="/#">
              tổng quan tài chính
            </Link>
          ),
        },
        {
          key: "subFinance2",
          label: (
            <Link className="flex justify-between" to="/#">
              Yêu cầu rút tiền (64)
            </Link>
          ),
        },
        {
          key: "subFinance3",
          label: (
            <Link className="flex justify-between" to="/#">
              Lịch sử thanh toán
            </Link>
          ),
        },
      ],
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
    },
  ];

  const handleShowMenu = () => {}

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
      <div class={`${showMenuMobile ? 'block absolute top-[60px] left-[0] right-[0] z-20 bg-white pb-10 md:pb-0 md:static' : 'hidden'} md:block`}>
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
            items={menuSidebar}
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
