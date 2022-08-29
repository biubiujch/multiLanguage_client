import { Button, Modal } from "antd";
import { useState } from "react";
import { Wrap } from "./index.styled";

function ProjectManage() {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <Wrap>
      <Button type="primary" onClick={() => setVisible(true)}>
        创建项目
      </Button>
      <div></div>
      <Modal visible={visible} onCancel={() => setVisible(false)} onOk={() => setVisible(false)}>
        <div>创建项目表单</div>
      </Modal>
    </Wrap>
  );
}

export default ProjectManage;
