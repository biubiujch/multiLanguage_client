import { IRoute } from ".";
import Login from "src/pages/login";
import PageLayout from "src/components/layout/layout";
import ProjectManage from "src/pages/projectManage";
import UserManage from "src/pages/userManage";
import { Route } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

export const routes: IRoute[] = [
  { path: "/login", element: <Login /> },
  {
    path: "/dashBord",
    element: <PageLayout />,
    child: [
      {
        path: "projectManage",
        index: true,
        name: "项目管理",
        element: <ProjectManage />
      },
      {
        path: "userManage",
        name: "用户管理",
        element: <UserManage />
      }
    ]
  }
];

export const menuList = [
  {
    key: "/projectManage",
    label: "项目管理",
    icon: <UserOutlined />
  },
  {
    key: "/userManage",
    label: "用户管理",
    icon: <UserOutlined />
  }
];

export const renderPage = (route: IRoute) => {
  const { element, path, child } = route;

  return element ? (
    <Route key={path} element={element} path={path}>
      {child ? child.map((r) => renderPage(r)) : null}
    </Route>
  ) : null;
};
