import { Button, Input, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";
import { Wrap, TranslateWrap } from "./detail.styled";
import { TableWrap, TextBtn } from "./index.styled";

export default function ProjectDetail() {
  const [show, setShow] = useState<boolean>(false);

  const columns: ColumnsType<any> = [
    {
      title: "翻译方式",
      dataIndex: "translateMethod"
    },
    {
      title: "原始内容",
      dataIndex: "originContent"
    },
    {
      title: "翻译内容",
      dataIndex: "translateContent"
    },
    {
      title: "操作",
      render: (record: Record<string, any>) => (
        <Space>
          <TextBtn>删除</TextBtn>
          <TextBtn>修改</TextBtn>
        </Space>
      )
    }
  ];

  return (
    <Wrap>
      <Button type='primary' onClick={() => setShow(!show)}>
        create new
      </Button>
      <TranslateWrap show={show}>
        <Space direction='horizontal'>
          <Select
            defaultValue={"1"}
            options={[
              { label: "中文-en", value: "1" },
              { label: "en-中文", value: "2" }
            ]}
          />
          <Button type='primary'>translate</Button>
          <Button>clear</Button>
        </Space>
        <div className='bottom'>
          <Input.TextArea />
          <Input.TextArea />
        </div>
      </TranslateWrap>
      <TableWrap>
        <Table dataSource={[]} columns={columns} />
      </TableWrap>
    </Wrap>
  );
}
