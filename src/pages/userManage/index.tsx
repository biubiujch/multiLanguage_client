import { Steps, Modal, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { logout } from "src/store/administrator";
import { apis, request } from "src/utils/request";
import { Title, InfoPanel, TextBtn } from "./index.styled";

const { Step } = Steps;

function UserManage() {
  const user = useSelector((state: RootState) => state.administrator.user);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleCommit = async () => {
    try {
      const { oldpsw, newpsw, confirmpsw } = await form.validateFields();
      if (oldpsw === newpsw) {
        message.warning("The new password is the same as the old one");
        throw new Error("same psw");
      }
      if (newpsw !== confirmpsw) {
        message.warning("Inconsistent passwords");
        throw new Error("Inconsistent passwords");
      }
      await request({
        ...apis.changepsw,
        data: {
          id: user.id,
          password: newpsw
        }
      });
      message.success("change success");
      setTimeout(() => {
        dispatch(logout());
      }, 1000);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const changePSW = async () => {
    Modal.confirm({
      title: "change password",
      content: (
        <Form labelCol={{ span: 5 }} form={form}>
          <Form.Item rules={[{ required: true, message: "old password is empty" }]} label='old' name='oldpsw'>
            <Input.Password />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: "new password is empty" }]} label='new' name='newpsw'>
            <Input.Password />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "confirm password is empty" }]}
            label='confirm'
            name='confirmpsw'
          >
            <Input.Password />
          </Form.Item>
        </Form>
      ),
      onOk: handleCommit
    });
  };

  return (
    <div>
      <Title>用户信息</Title>
      <InfoPanel>
        <span>用户名：</span> <span>{user.username}</span>
      </InfoPanel>
      <div>
        <TextBtn onClick={changePSW}>修改密码</TextBtn>
      </div>
    </div>
  );
}

export default UserManage;
