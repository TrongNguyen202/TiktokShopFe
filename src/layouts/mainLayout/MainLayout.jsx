import { Layout } from "antd";
import React, { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Outlet } from "react-router-dom";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar/Sidebar";
import { StyledContent } from "./MainLayout.style";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Scrollbars
        style={{ height: "100vh" }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <Layout>
          <Header
            changeCollapsed={() => setCollapsed(!collapsed)}
            collapsed={collapsed}
          />
          <StyledContent>
            <Outlet />
          </StyledContent>
        </Layout>
      </Scrollbars>
    </Layout>
  );
};
export default MainLayout;
