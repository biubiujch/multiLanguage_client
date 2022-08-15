import { Wrap, Card } from "./index.styled";
import { Form, Input, Checkbox, Button } from "antd";

function Login() {
  const [form] = Form.useForm();

  const handleFinish = (value: Record<string, any>) => {
    console.log(value);
    // jump to project
  };

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
