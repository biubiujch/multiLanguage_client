import { Button, Form, Input, message, Modal, Popconfirm, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRequestList } from "src/hooks/useRequestList";
import { apis, request } from "src/utils/request";
import { translateAPI } from "src/utils/translate";
import { TableWrap, TextBtn } from "./index.styled";

const translate = [
  { from: "zh", to: "en" },
  { from: "en", to: "zh" }
];

export default function ProjectDetail() {
  const [show, setShow] = useState<boolean>(false);
  const [params] = useSearchParams();
  const projectID = useMemo(() => params.get("id") || null, [params]);
  const [addForm] = Form.useForm();
  const { reFectch, data } = useRequestList(apis.getAllText, { projectID });
  const dataSource = useMemo(() => {
    return Array.isArray(data) ? data : data.data || [];
  }, [data]);

  const openAddModal = () => {
    addForm.resetFields();
    setShow(!show);
  };
  const handleTranslate = async ({ q, to, from, srcID }: { q: string; to: string; from: string; srcID: string }) => {
    const res = await translateAPI({ q, to, from });
    if (res) {
      const { trans_result } = res;
      await request({
        ...apis.addDstText,
        params: {
          to,
          srcID,
          content: trans_result[0]?.dst || ""
        }
      });
    }
  };
  const handleDelete = async (record: Record<string, any>) => {
    try {
      const { id } = record;
      await request({
        ...apis.deleteText,
        params: {
          id
        }
      });
      reFectch();
    } catch (e) {}
  };
  const handleAdd = async () => {
    try {
      const { trans, content, key } = await addForm.validateFields();
      const { from, to } = translate[trans || 0];
      const res: any = await request({
        ...apis.addText,
        params: {
          key,
          content,
          from,
          projectID
        }
      });
      const { id } = res;
      await handleTranslate({ q: content, srcID: id, from, to });
      reFectch();
      message.success("add success");
      setShow(false);
    } catch (e) {}
  };

  const columns: ColumnsType<any> = [
    {
      title: "key",
      dataIndex: "key"
    },
    {
      title: "source",
      dataIndex: "content"
    },
    {
      title: "destination",
      dataIndex: "dstConent"
    },
    {
      title: "action",
      render: (record: Record<string, any>) => (
        <Space>
          <Popconfirm title='delete?' onConfirm={() => handleDelete(record)} okText='del' cancelText='cancel'>
            <TextBtn>delete</TextBtn>
          </Popconfirm>
          <TextBtn>update</TextBtn>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Space>
        <Button type='primary' onClick={openAddModal}>
          create new
        </Button>
      </Space>
      <TableWrap>
        <Table rowKey={(record) => record.id} dataSource={dataSource} columns={columns} />
      </TableWrap>
      <Modal title='Add text' visible={show} onCancel={() => setShow(false)} onOk={handleAdd}>
        <Form form={addForm} labelCol={{ span: 4 }}>
          <Form.Item label='key' name='key' required>
            <Input />
          </Form.Item>
          <Form.Item label='content' name='content' required>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label='translate' name='trans' initialValue={0}>
            <Select
              options={[
                { label: "中文-en", value: 0 },
                { label: "en-中文", value: 1 }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
