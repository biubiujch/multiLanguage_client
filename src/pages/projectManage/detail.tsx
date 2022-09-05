import { Button, Input, message, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRequestList } from "src/hooks/useRequestList";
import { apis, request } from "src/utils/request";
import { translateAPI } from "src/utils/translate";
import { Wrap, TranslateWrap } from "./detail.styled";
import { TableWrap, TextBtn } from "./index.styled";

const src2dst = [
  {
    to: "en",
    from: "zh"
  },
  {
    to: "zh",
    from: "en"
  }
];

export default function ProjectDetail() {
  const [show, setShow] = useState<boolean>(false);
  const [originText, setOriginText] = useState<string>("");
  const [translateText, setTranslateText] = useState<string>("");
  const [translate, setTranslate] = useState<number>(0);
  const [params] = useSearchParams();
  const projectID = useMemo(() => params.get("id") || null, [params]);
  const { reFectch, data } = useRequestList(apis.getAllText, { projectID });
  const dataSource = useMemo(() => {
    return Array.isArray(data) ? data : data.data || [];
  }, [data]);

  const handleAddNew = async ({ src, dst, to, from }: { src: string; dst: string; to: string; from: string }) => {
    try {
      await request({
        ...apis.addText,
        params: {
          projectID,
          srcText: src,
          dstText: dst,
          to,
          from
        }
      });
      reFectch();
      message.success("add success");
    } catch (e) {}
  };
  const handleTranslate = async () => {
    if (originText.length === 0) {
      message.warning("please input text");
      return;
    }
    const { to, from } = src2dst[translate];
    const res = await translateAPI({ q: originText, to, from });
    if (res) {
      const { trans_result } = res;
      setTranslateText(trans_result[0]?.dst || "");
      await handleAddNew({ src: trans_result[0]?.src || "", dst: trans_result[0]?.dst || "", to, from });
    }
  };
  const handleClear = () => {
    setOriginText("");
    setTranslateText("");
  };
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    translateText.length > 0 && setTranslateText("");
    setOriginText(event.target.value);
  };
  const handleDelete = async (record: Record<string, any>) => {
    try {
      const { id } = record;
      if (!id) {
        message.error("delete fail,You don't have access.");
        return;
      }
      await request({
        ...apis.deleteText,
        params: {
          id
        }
      });
      reFectch();
    } catch (e) {}
  };

  const columns: ColumnsType<any> = [
    {
      title: "原始内容",
      dataIndex: "srcText"
    },
    {
      title: "翻译内容",
      dataIndex: "dstText"
    },
    {
      title: "操作",
      render: (record: Record<string, any>) => (
        <Space>
          <TextBtn onClick={() => handleDelete(record)}>删除</TextBtn>
          <TextBtn>修改</TextBtn>
        </Space>
      )
    }
  ];

  return (
    <Wrap>
      <Button type='primary' onClick={() => setShow(!show)}>
        {show ? "cancel" : " create new"}
      </Button>
      <TranslateWrap show={show}>
        <Space direction='horizontal'>
          <Select
            defaultValue={0}
            onChange={(e) => setTranslate(e)}
            options={[
              { label: "中文-en", value: 0 },
              { label: "en-中文", value: 1 }
            ]}
          />
          <Button type='primary' onClick={handleTranslate}>
            translate&amp;add
          </Button>
          <Button onClick={handleClear}>clear</Button>
        </Space>
        <div className='bottom'>
          <Input.TextArea value={originText} onChange={handleInput} />
          <Input.TextArea value={translateText} />
        </div>
      </TranslateWrap>
      <TableWrap>
        <Table rowKey={(record) => record.id} dataSource={dataSource} columns={columns} />
      </TableWrap>
    </Wrap>
  );
}
