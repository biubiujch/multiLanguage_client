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
  const [params] = useSearchParams();
  const projectID = useMemo(() => params.get("id") || null, [params]);
  const { reFectch, data } = useRequestList(apis.getAllText, { projectID });
  const dataSource = useMemo(() => {
    return Array.isArray(data) ? data : data.data || [];
  }, [data.length]);
  const [visible, setVisible] = useState<boolean>(false);

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
  const handleCreate = () => {
    setVisible(true);
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
      // reFectch();
    } catch (e) {}
  };

  const columns: ColumnsType<any> = [
    {
      title: "key",
      dataIndex: "key"
    },
    {
      title: "源文案",
      dataIndex: "content"
    },
    {
      title: "翻译文案",
      dataIndex: "dstConent"
    },
    {
      title: "操作",
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
        <Button type='primary' onClick={handleCreate}>
          create new
        </Button>
      </Space>
      <TableWrap>
        <Table rowKey={(record) => record.id} dataSource={[]} columns={columns} />
      </TableWrap>
      <Modal title='添加文案' visible={visible} onCancel={() => setVisible(false)}>
        <Form labelCol={{ span: 4 }}>
          <Form.Item label='key' name='key'>
            <Input />
          </Form.Item>
          <Form.Item label='源文案' name='src'>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
