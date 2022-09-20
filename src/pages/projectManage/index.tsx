import { Button, Form, Input, message, Modal, Space, Table, Popconfirm, Select, Checkbox } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRequestList } from "src/hooks/useRequestList";
import { RootState } from "src/store";
import { apis, request } from "src/utils/request";
import { Wrap, TableWrap, TextBtn } from "./index.styled";

function ProjectManage() {
  const [visible, setVisible] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(true);
  const [createForm] = Form.useForm();
  const { reFectch, data: dataSource } = useRequestList(apis.getAllProject, {});
  const project = useRef<Record<string, any>>({});
  const user = useSelector((state: RootState) => state.administrator.user);
  const navigate = useNavigate();

  const handleCreate = () => {
    createForm.resetFields();
    setIsCreate(true);
    setVisible(true);
  };
  const handleSubmit = async () => {
    try {
      const value = createForm.getFieldsValue();
      const dstLang = Array.from(new Set([value.srcLang, ...value.dstLang])).join();
      await request({
        ...apis.createProject,
        params: {
          ...value,
          dstLang,
          administrator: user.username,
          administratorID: user.id,
        },
      });
      message.success("create success");
      reFectch();
      setVisible(false);
    } catch (e) {
      console.log(e);
    }
  };
  const handleUpdate = async (record: Record<string, any>) => {
    try {
      const value = createForm.getFieldsValue();
      const dstLang = Array.from(new Set([value.srcLang, ...value.dstLang])).join();
      const { id } = project.current;
      if (!id) {
        message.error("update fail");
        return;
      }
      await request({
        ...apis.updateProject,
        params: {
          id,
          ...value,
          dstLang,
        },
      });
      message.success("update success");
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
    } catch {}
  };
  const handleEdit = (record: Record<string, any>) => {
    project.current = record;
    const { projectName, dstLang } = record;
    setIsCreate(false);
    setVisible(true);
    createForm.setFieldsValue({
      projectName,
      dstLang: (dstLang as string).split(","),
    });
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
          {record.state !== 1 && <TextBtn onClick={() => handleEdit(record)}>编辑</TextBtn>}
          <TextBtn onClick={() => navigate(`/dashbord/projectDetail?id=${record.id}`)}>进入项目</TextBtn>
        </Space>
      ),
    },
  ];

  return (
    <Wrap>
      <Button type="primary" onClick={handleCreate}>
        create project
      </Button>
      <TableWrap>
        <Table columns={columns} dataSource={dataSource} rowKey={(record) => record.id} />
      </TableWrap>
      <Modal
        title={isCreate ? "创建项目" : "编辑项目"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={isCreate ? handleSubmit : handleUpdate}
      >
        <Form form={createForm} labelCol={{ span: 6 }}>
          <Form.Item label="项目名称" name="projectName">
            <Input />
          </Form.Item>
          <Form.Item label="源文案语言" name="srcLang" initialValue={"zh"}>
            <Select options={[{ label: "zh" }, { label: "en" }, { label: "jp" }, { label: "fra" }]} />
          </Form.Item>
          <Form.Item label="翻译文案语言" name="dstLang">
            <Checkbox.Group options={[ "en", "jp", "fra"]} />
          </Form.Item>
        </Form>
      </Modal>
    </Wrap>
  );
}

export default ProjectManage;
