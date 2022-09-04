import { Button, Input, message, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";
import { translateAPI } from "src/utils/translate";
import { Wrap, TranslateWrap } from "./detail.styled";
import { TableWrap, TextBtn } from "./index.styled";

const src2dst = [
  {
    to: "en",
    from: "zh",
  },
  {
    to: "zh",
    from: "en",
  },
];

export default function ProjectDetail() {
  const [show, setShow] = useState<boolean>(false);
  const [originText, setOriginText] = useState<string>("");
  const [translateText, setTranslateText] = useState<string>("");
  const [translate, setTranslate] = useState<number>(0);

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
    }
  };
  const handleClear = () => {
    setOriginText("");
    setTranslateText("");
  };

  const columns: ColumnsType<any> = [
    {
      title: "翻译方式",
      dataIndex: "translateMethod",
    },
    {
      title: "原始内容",
      dataIndex: "originContent",
    },
    {
      title: "翻译内容",
      dataIndex: "translateContent",
    },
    {
      title: "操作",
      render: (record: Record<string, any>) => (
        <Space>
          <TextBtn>删除</TextBtn>
          <TextBtn>修改</TextBtn>
        </Space>
      ),
    },
  ];

  return (
    <Wrap>
      <Button type="primary" onClick={() => setShow(!show)}>
        create new
      </Button>
      <TranslateWrap show={show}>
        <Space direction="horizontal">
          <Select
            defaultValue={0}
            onChange={(e) => setTranslate(e)}
            options={[
              { label: "中文-en", value: 0 },
              { label: "en-中文", value: 1 },
            ]}
          />
          <Button type="primary" onClick={handleTranslate}>
            translate
          </Button>
          <Button onClick={handleClear}>clear</Button>
        </Space>
        <div className="bottom">
          <Input.TextArea value={originText} onChange={(event) => setOriginText(event.target.value)} />
          <Input.TextArea value={translateText} />
        </div>
      </TranslateWrap>
      <TableWrap>
        <Table dataSource={[]} columns={columns} />
      </TableWrap>
    </Wrap>
  );
}
