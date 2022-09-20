import { Button, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRequestList } from "src/hooks/useRequestList";
import { apis, request } from "src/utils/request";
import { translateAPI } from "src/utils/translate";
import { TableWrap, TextBtn } from "./index.styled";
import editCellComponents from "src/components/editCell";
import { timeOut } from "src/utils";

const translate = [
  { from: "zh", to: "en" },
  { from: "en", to: "zh" }
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
  const [lang, setLang] = useState<string>("");
  const [projectDetail, setProjectDetail] = useState<Record<string, any>>({});
  const [dataLength, setDataLength] = useState(0);
  const [saving, setSaving] = useState(false);
  const dataSource = useMemo(() => {
    const d: any[] = data.map((item: Record<string, any>) => ({
      ...item,
      target: (item.dst || []).filter((el: any) => el.to === (lang || "en"))[0]?.text
    }));
    if (dataLength > data.length) {
      d.push({
        ...(d[0] || {}),
        id: "-1",
        key: "",
        target: "",
        text: ""
      });
    }
    return d;
  }, [data, lang, dataLength]);
  const [tableForm] = Form.useForm();

  const getProjectDetail = useCallback(async () => {
    try {
      const data = await request({ ...apis.detailProject, params: { id: projectID } });
      const { dstLang, srcLang } = data as any;
      if (dstLang && srcLang) {
        setProjectDetail(data);
        const langs = (dstLang as string).split(",").filter((l) => l !== srcLang);
        setLang(langs[0] || "");
      }
    } catch (e) {
      console.error(e);
    }
  }, [projectID]);
  const handleTranslate = async (language?: string) => {
    try {
      const q = tableForm.getFieldValue("text");
      if (q) {
        const res = await translate(q, language || lang, projectDetail.srcLang || "zh");
        tableForm.setFieldValue("target", res?.text || "");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const translate = async (q: string, to: string, from: string) => {
    const res = await translateAPI({ q, to, from });
    if (res) {
      const { trans_result } = res;
      return trans_result
        ? {
            to,
            text: trans_result[0]?.dst as string
          }
        : null;
    }
    return null;
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
  const handleSave = async (record: Record<string, any>) => {
    try {
      setSaving(true);
      setEditKey("");
      const { key, text } = await tableForm.getFieldsValue();
      const from = projectDetail.srcLang || "zh";
      if (!key || !text) {
        message.warning("exsit empty text or key");
        setDataLength(data.length);
        return;
      }
      if (record.id === "-1") {
        const dst: { text: string; to: string }[] = [];
        const langs = projectDetail.dstLang.split(",");
        for await (let to of langs) {
          const res = await translate(text, to, from);
          await timeOut(800);
          res && dst.push(res);
        }
        const res = await request({
          ...apis.createText,
          data: {
            key,
            text,
            dst,
            from,
            projectID
          }
        });
      } else {
        const dst: { text: string; id: string }[] = [];
        const { dst: dstList } = record;
        for await (let item of dstList) {
          const res = await translate(text, item.to, from);
          await timeOut(800);
          res &&
            dst.push({
              id: item.id,
              text: res.text
            });
        }
        console.log(dst);
        await request({
          ...apis.updateText,
          data: {
            id: record.id,
            text,
            dst
          }
        });
      }
      reFectch();
    } catch (e) {
      setEditKey("");
      setDataLength(data.length);
    } finally {
      setSaving(false);
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
  const handleChangLang = (
    value: string,
    option:
      | {
          label: string;
          value: string;
        }
      | {
          label: string;
          value: string;
        }[],
    record: any
  ) => {
    if (record.id !== "-1") {
      const target = record.dst.filter(({ to }: any) => to === value);
      tableForm.setFieldValue("target", target[0]?.text || "");
    } else {
      handleTranslate(value);
    }
  };
  const handleDeployment = async () => {
    const res = await request({ ...apis.deployment, params: { projectID } });
    Modal.info({
      title: "url link",
      content: <Input readOnly value={res as any} />,
      okText: "copy",
      onOk: () => {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", res as any);
        input.select();
        if (document.execCommand("copy")) {
          document.execCommand("copy");
        }
        document.body.removeChild(input);

        return Promise.resolve();
      }
    });
  };

  useEffect(() => {
    if (data) {
      setDataLength(data.length);
    }
  }, [data]);
  useEffect(() => {
    projectID && getProjectDetail();
  }, [projectID, getProjectDetail]);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string; translateCell?: boolean })[] = [
    {
      title: "key",
      dataIndex: "key",
      width: "30%",
      editable: true
    },
    {
      title: "源文案",
      dataIndex: "text",
      width: "30%",
      editable: true
    },
    {
      title: "翻译文案",
      dataIndex: "target",
      translateCell: true,
      editable: true
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
              <Popconfirm title='delete?' onConfirm={() => handleDelete(record)} okText='del' cancelText='cancel'>
                <TextBtn>delete</TextBtn>
              </Popconfirm>
              <TextBtn onClick={() => setEditKey(record?.id)}>edit</TextBtn>
            </>
          )}
        </Space>
      )
    }
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
        langsOptions: projectDetail.dstLang?.split(",").map((l: string) => ({ value: l, label: l })) || [],
        form: tableForm,
        disabled: record.id !== "-1" && col.dataIndex === "key",
        changLang: handleChangLang,
        handleTranslate: col.dataIndex === "text" ? handleTranslate : undefined,
        editKey
      })
    };
  });

  return (
    <div>
      <Spin spinning={saving}>
        <Space>
          <Button type='primary' disabled={!!editKey} onClick={handleCreate}>
            create new
          </Button>
          <Button type='primary' disabled={!dataSource.length} onClick={handleDeployment}>
            deployment
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
      </Spin>
    </div>
  );
}
