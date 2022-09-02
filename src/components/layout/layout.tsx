import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Wrap } from "./Layout.styled";
import { useRedirect } from "src/hooks";
import { menuList } from "src/route/route";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Header, Sider, Content } = Layout;

function PageLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const redirect = useRedirect();
  const isLogin = useSelector((state: RootState) => state.administrator.isLogin);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login", { replace: true });
    } else if (location.pathname == "/dashbord") {
      redirect("/", "/dashbord/projectManage");
    }
  }, [location, isLogin]);

  return (
    <Wrap>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className='logo' />
          <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={[menuList[0].key]}
            items={menuList}
            onClick={({ key }) => navigate(`/dashbord${key}`, { replace: true })}
          />
        </Sider>
        <Layout className='site-layout'>
          <Header className='site-layout-background' style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed)
            })}
          </Header>
          <Content
            className='site-layout-background'
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Wrap>
  );
}

export default PageLayout;
