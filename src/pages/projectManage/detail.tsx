import { Button, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRequestList } from "src/hooks/useRequestList";
import { apis, request } from "src/utils/request";
import { translateAPI } from "src/utils/translate";
import { TableWrap, TextBtn } from "./index.styled";
import editCellComponents from "src/components/editCell";

const translate = [
  { from: "zh", to: "en" },
  { from: "en", to: "zh" },
];

type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
interface DataType {
  id: React.Key;
  key: string;
  src: string;
  dst: string;
}

export default function ProjectDetail() {
  const [params] = useSearchParams();
  const projectID = useMemo(() => params.get("id") || null, [params]);
  const { reFectch, data } = useRequestList(apis.getAllText, { projectID });
  const [editKey, setEditKey] = useState("");
  const [lang, setLang] = useState("en");
  const [dataLength, setDataLength] = useState(0);
  const [dstList, setDstList] = useState<{ text: string; to: string }[]>([]);
  const dataSource = useMemo(() => {
    const d: any[] = data.map((item: Record<string, any>) => ({
      ...item,
      target: (item.dst || []).filter((el: any) => el.to === lang)[0]?.text,
    }));
    if (dataLength > data.length) {
      d.push({
        ...(d[0] || {}),
        id: "-1",
        key: "",
        target: "",
        text: "",
      });
    }
    return d;
  }, [data.length, lang, dataLength]);
  const [tableForm] = Form.useForm();

  useEffect(() => {
    if (data) {
      setDataLength(data.length);
    }
  }, [data]);

  const handleTranslate = async () => {
    const q = tableForm.getFieldValue("text");
    if (q) {
      const dsts = [];
      const res = await translateAPI({ q, to: "en", from: "zh" });
      if (res) {
        const { trans_result } = res;
        tableForm.setFieldValue("target", trans_result[0]?.dst);
        dsts.push({
          to: "en",
          text: trans_result[0]?.dst,
        });
      }
      setDstList(dsts);
    }
  };

  const handleDelete = async (record: Record<string, any>) => {
    try {
      const { id } = record;
      await request({
        ...apis.deleteText,
        params: {
          id,
        },
      });
      // reFectch();
    } catch (e) {}
  };

  const handleSave = async (record: Record<string, any>) => {
    try {
      setEditKey("");
      const value = await tableForm.getFieldsValue();
      if (Object.values(value).filter((i) => !i).length) {
        message.warning("exsit empty text");
        setDataLength(data.length);
        return;
      }
      if (record.id === "-1") {
        const { key, text } = value;
        const res = await request({
          ...apis.createText,
          data: {
            key,
            text,
            dst: dstList,
            from: "zh",
            projectID,
          },
        });
      } else {
      }
      reFectch();
    } catch (e) {
      setEditKey("");
      setDataLength(data.length);
    }
  };
  const handleCancel = (record: Record<string, any>) => {
    setEditKey("");
    setDataLength(data.length);
  };
  const handleCreate = () => {
    setEditKey("-1");
    setDataLength(dataLength + 1);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string; translateCell?: boolean })[] = [
    {
      title: "key",
      dataIndex: "key",
      width: "30%",
      editable: true,
    },
    {
      title: "源文案",
      dataIndex: "text",
      width: "30%",
      editable: true,
    },
    {
      title: "翻译文案",
      dataIndex: "target",
      translateCell: true,
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: Record<string, any>) => (
        <Space>
          {editKey === record?.id ? (
            <>
              <TextBtn onClick={() => handleSave(record)}>save</TextBtn>
              <TextBtn onClick={() => handleCancel(record)}>cancel</TextBtn>
            </>
          ) : (
            <>
              <Popconfirm title="delete?" onConfirm={() => handleDelete(record)} okText="del" cancelText="cancel">
                <TextBtn>delete</TextBtn>
              </Popconfirm>
              <TextBtn>update</TextBtn>
              <TextBtn onClick={() => setEditKey(record?.id)}>edit</TextBtn>
            </>
          )}
        </Space>
      ),
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        translateCell: col.translateCell,
        dataIndex: col.dataIndex,
        title: col.title,
        form: tableForm,
        handleTranslate: col.dataIndex === "text" ? handleTranslate : undefined,
        editKey,
      }),
    };
  });

  return (
    <div>
      <Space>
        <Button type="primary" disabled={!!editKey} onClick={handleCreate}>
          create new
        </Button>
      </Space>
      <TableWrap>
        <Form form={tableForm} component={false}>
          <Table
            components={editCellComponents}
            rowKey={(record: Record<string, any>) => record.id}
            dataSource={dataSource}
            columns={columns as ColumnTypes}
          />
        </Form>
      </TableWrap>
    </div>
  );
}
