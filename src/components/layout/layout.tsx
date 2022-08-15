import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Wrap } from "./Layout.styled";
import { useRedirect } from "src/hooks";
import { routes, menuList } from "src/route/route";

const { Header, Sider, Content } = Layout;

function PageLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const redirect = useRedirect();

  useEffect(() => {
    routes.forEach((r) => {
      r.child && redirect(r.path, r.child[0].path);
    });
  }, [location]);

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
