import { Wrap, Card } from "./index.styled";
import { Form, Input, Checkbox, Button, message } from "antd";
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
          password
        }
      });
      setLoginStatus(true);
      dispatch(login(res.data));
    } catch (e) {}
  };

  useEffect(() => {
    console.log(islogin)
    if (loginStatus || islogin) navigate("/dashbord", { replace: true });
  }, [loginStatus, islogin]);

  return (
    <Wrap>
      <Card>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete='off'
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            label='Username'
            name='username'
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name='remember' valuePropName='checked' wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Wrap>
  );
}

export default Login;
