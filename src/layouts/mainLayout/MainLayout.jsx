import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Outlet } from 'react-router-dom';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar/Sidebar';
import { StyledContent } from './MainLayout.style';
import { useAuthStore } from '../../store/authStore';

function MainLayout() {
  const { getProfileInfo } = useAuthStore();
  const [collapsed, setCollapsed] = useState(true);
  useEffect(() => {
    const onSuccess = (res) => {
      localStorage.setItem('user', JSON.stringify(res.data));
    };
    const onFail = (err) => {
      console.log(err);
    };

    getProfileInfo(onSuccess, onFail);
  }, []);

  return (
    <Layout className="block md:flex">
      <Sidebar collapsed={collapsed} />
      <Scrollbars style={{ height: '100vh' }} autoHide autoHideTimeout={1000} autoHideDuration={200}>
        <Layout>
          <Header changeCollapsed={() => setCollapsed(!collapsed)} collapsed={collapsed} />
          <StyledContent>
            <Outlet />
          </StyledContent>
        </Layout>
      </Scrollbars>
    </Layout>
  );
}
export default MainLayout;
