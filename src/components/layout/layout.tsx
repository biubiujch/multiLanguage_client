import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Wrap } from "./Layout.styled";
import { useRedirect } from "src/hooks";
import { menuList } from "src/route/route";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { logout } from "src/store/administrator";
import { UserOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

function PageLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const redirect = useRedirect();
  const isLogin = useSelector((state: RootState) => state.administrator.isLogin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLogin) {
      navigate("/login", { replace: true });
    } else if (location.pathname == "/dashbord") {
      redirect("/", "/dashbord/projectManage");
    }
  }, [location, isLogin]);

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: <span onClick={() => dispatch(logout())}>logout</span>
        }
      ]}
    />
  );

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
          <Header className='site-layout-background flex-header' style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed)
            })}
            <Dropdown overlay={userMenu} placement='bottomLeft' arrow>
              <Avatar size={36} icon={<UserOutlined />} className="profile-photo" />
            </Dropdown>
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
