import { Button, Form, Input, message, Modal, Popconfirm, Select, Space, Table } from "antd";
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
  const dataSource = useMemo(() => {
    return Array.isArray(data) ? data : data.data || [];
  }, [data.length]);

  const handleTranslate = async ({ q, to, from, srcID }: { q: string; to: string; from: string; srcID: string }) => {
    const res = await translateAPI({ q, to, from });
    if (res) {
      const { trans_result } = res;
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
      // reFectch();
    } catch (e) {}
  };

  const handleSave = (row: DataType) => {};

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string; translateCell?: boolean })[] = [
    {
      title: "key",
      dataIndex: "key",
      width: "30%",
      editable: true
    },
    {
      title: "源文案",
      dataIndex: "src",
      width: "30%",
      editable: true
    },
    {
      title: "翻译文案",
      dataIndex: "dst",
      translateCell: true,
      editable: true
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: Record<string, any>) => (
        <Space>
          <Popconfirm title='delete?' onConfirm={() => handleDelete(record)} okText='del' cancelText='cancel'>
            <TextBtn>delete</TextBtn>
          </Popconfirm>
          <TextBtn>update</TextBtn>
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
        handleSave
      })
    };
  });

  return (
    <div>
      <Space>
        <Button type='primary'>create new</Button>
      </Space>
      <TableWrap>
        <Table
          components={editCellComponents}
          rowKey={(record: Record<string, any>) => record.id}
          dataSource={[
            { key: "1", src: "1", dst: "1", id: "00" },
            { key: "1", src: "1", dst: "1", id: "01" },
            { key: "1", src: "1", dst: "1", id: "02" },
            { key: "1", src: "1", dst: "1", id: "30" }
          ]}
          columns={columns as ColumnTypes}
        />
      </TableWrap>
    </div>
  );
}
