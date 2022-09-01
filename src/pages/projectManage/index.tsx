import { Button, Form, Input, message, Modal, Space, Table, Popconfirm } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useMemo, useState } from "react";
import { useRequestList } from "src/hooks/useRequestList";
import { apis, request } from "src/utils/request";
import { Wrap, TableWrap, TextBtn } from "./index.styled";

function ProjectManage() {
  const [visible, setVisible] = useState<boolean>(false);
  const [createForm] = Form.useForm();
  const { reFectch, data } = useRequestList(apis.getAllProject);
  const dataSource = useMemo(() => {
    return data.data || [];
  }, [data]);

  const handleSubmit = async () => {
    const res = createForm.getFieldsValue();
    try {
      await request({
        ...apis.createProject,
        params: {
          ...res,
          administrator: "admin",
          administratorID: "1",
        },
      });
      message.success("create success");
      reFectch();
      setVisible(false);
    } catch (e) {}
  };
  const handleDelete = async (record: Record<string, any>) => {
    try {
      const { id } = record;
      id && (await request({ ...apis.deleteProject, params: { id } }));
      reFectch();
      message.success("delete success");
    } catch (e) {}
  };

  const columns: ColumnsType<any> = [
    { title: "项目名称", dataIndex: "projectName", key: "id" },
    { title: "创建人", dataIndex: "administrator", key: "administratorID" },
    {
      title: "操作",
      key: "id",
      render: (record: Record<string, any>) => (
        <Space>
          <Popconfirm title="删除" okText="delete" cancelText="cancel" onConfirm={() => handleDelete(record)}>
            <TextBtn>删除</TextBtn>
          </Popconfirm>
          <TextBtn>编辑</TextBtn>
        </Space>
      ),
    },
  ];

  return (
    <Wrap>
      <Button type="primary" onClick={() => setVisible(true)}>
        创建项目
      </Button>
      <TableWrap>
        <Table columns={columns} dataSource={dataSource} rowKey={(record) => record.id} />
      </TableWrap>
      <Modal title="创建项目" visible={visible} onCancel={() => setVisible(false)} onOk={handleSubmit}>
        <Form form={createForm}>
          <Form.Item label="项目名称" name="projectName">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Wrap>
  );
}

export default ProjectManage;
