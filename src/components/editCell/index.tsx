import { InputRef, Select, Space } from "antd";
import { Form, Input } from "antd";
import type { FormInstance } from "antd/es/form";
import React, { useContext, useEffect, useRef, useState } from "react";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  [x: string]: any;
}

interface EditableRowProps {
  index: number;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  form: FormInstance;
  editKey?: string;
  disabled?: boolean;
  translateCell?: boolean;
  changLang?: (
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
  ) => void;
  langsOptions: { label: string; value: string }[];
  handleTranslate?: () => void;
  handleSave: (record: Item) => void;
}

export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  translateCell,
  editKey,
  form,
  changLang,
  langsOptions,
  handleTranslate,
  disabled,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  // const form = useContext(EditableContext);\

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  useEffect(() => {
    if (editKey !== undefined) {
      if (editKey === record?.id) {
        setEditing(true);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      } else {
        setEditing(false);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      }
    }
  }, [editKey]);

  // const save = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     setEditing(false);
  //     form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  //   } catch (errInfo) {
  //     console.log("Save failed:", errInfo);
  //   }
  // };

  const handleBlur = () => {
    handleTranslate && handleTranslate();
  };

  const handlechange = (
    value: string,
    option:
      | {
          label: string;
          value: string;
        }
      | {
          label: string;
          value: string;
        }[]
  ) => {
    changLang && changLang(value, option, record);
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <div>
        {translateCell && (
          <Space style={{ marginBottom: "10px" }}>
            <span>?????????</span>
            <Select defaultValue={"en"} options={langsOptions} onChange={handlechange} />
          </Space>
        )}
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
          {translateCell ? (
            <Input.TextArea ref={inputRef} />
          ) : (
            <Input ref={inputRef} onBlur={handleBlur} disabled={disabled} />
          )}
        </Form.Item>
      </div>
    ) : (
      <div style={{ paddingRight: 24 }}>{children}</div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default {
  body: {
    // row: EditableRow,
    cell: EditableCell
  }
};
