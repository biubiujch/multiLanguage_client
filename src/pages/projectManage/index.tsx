import { Button, Modal, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";
import { Wrap, TableWrap } from "./index.styled";

function ProjectManage() {
  const [visible, setVisible] = useState<boolean>(false);

  const columns: ColumnsType<any> = [
    { title: "项目名称", dataIndex: "projectName", key: "id" },
    { title: "创建人", dataIndex: "administrator", key: "administratorID" },
    { title: "操作", render: () => <span>删除 详情</span> }
  ];

  return (
    <Wrap>
      <Button type='primary' onClick={() => setVisible(true)}>
        创建项目
      </Button>
      <TableWrap>
        <Table columns={columns} dataSource={[]} />
      </TableWrap>
      <Modal visible={visible} onCancel={() => setVisible(false)} onOk={() => setVisible(false)}>
        <div>创建项目表单</div>
      </Modal>
    </Wrap>
  );
}

export default ProjectManage;
