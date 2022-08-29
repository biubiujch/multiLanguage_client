import { Wrap, Card } from "./index.styled";
import { Form, Input, Checkbox, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form] = Form.useForm();
  const [loginStatus, setLoginStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFinish = (value: Record<string, any>) => {
    console.log(value);
    setLoginStatus(true);
    // jump to project
  };

  useEffect(() => {
    if (loginStatus) navigate("/dashbord", { replace: true });
  }, [loginStatus]);

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
