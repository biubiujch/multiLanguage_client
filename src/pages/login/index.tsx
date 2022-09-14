import { Wrap, Card } from "./index.styled";
import { Form, Input, Checkbox, Button, message, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request, apis } from "src/utils/request";
import type { RootState } from "src/store/index";
import { useDispatch, useSelector } from "react-redux";
import { login } from "src/store/administrator";

function Login() {
  const [form] = Form.useForm();
  const islogin = useSelector((state: RootState) => state.administrator.isLogin);
  const [loginStatus, setLoginStatus] = useState<boolean>(islogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFinish = async (value: Record<string, any>) => {
    try {
      const { username, password } = value;
      const res = await request({
        ...apis.login,
        params: {
          name: username,
          password,
        },
      });
      setLoginStatus(true);
      dispatch(login(res));
    } catch (e) {}
  };
  const handleRegist = async () => {
    try {
      const { username, password } = form.getFieldsValue();
      if (!username || !password) {
        message.warning("name and password not be empty");
        return;
      }
      const res = await request({
        ...apis.regist,
        data: {
          name: username,
          password,
        },
      });
      setLoginStatus(true);
      dispatch(login(res));
    } catch (e) {}
  };

  useEffect(() => {
    if (loginStatus || islogin) navigate("/dashbord", { replace: true });
  }, [loginStatus, islogin]);

  return (
    <Wrap>
      <Card>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
              <Button type="primary" onClick={handleRegist}>
                regist
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Wrap>
  );
}

export default Login;
