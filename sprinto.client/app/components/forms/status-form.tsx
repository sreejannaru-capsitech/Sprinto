import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  type FormProps,
} from "antd";
import { useState, type ReactNode } from "react";
import {
  AlertIcon,
  CloseRoundedIcon,
  DeleteIcon,
  PencilIcon,
} from "~/lib/icons";
import {
  useCreateStatus,
  useDeleteStatus,
  useStatusesQuery,
  useUpdateStatus,
} from "~/lib/server/services";
import { getRequiredStringRule } from "~/lib/validators";
import Spinner from "../ui/spinner";

import "~/styles/items.css";
import { useAntNotification } from "~/hooks";

const disabled = ["Done", "In Progress", "Todo"];

/**
 * This component renders status-form section
 * @returns {ReactNode} The TaskStatusForm component
 */
const TaskStatusForm = (): ReactNode => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | undefined>(undefined);

  const [form] = Form.useForm<StatusRequest>();

  const { data, isPending } = useStatusesQuery();

  const onEdit = (status: Status) => {
    setStatus(status);
    form.setFieldsValue(status);
  };

  const { _api, contextHolder } = useAntNotification();

  const { mutateAsync: updateStatus } = useUpdateStatus(_api);
  const { mutateAsync: createStatus } = useCreateStatus(_api);
  const { mutateAsync: deleteStatus } = useDeleteStatus(_api);

  const onFinish: FormProps<StatusRequest>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      if (status) {
        await updateStatus({ ...status, title: values.title });
      } else {
        await createStatus(values);
      }
      form.resetFields();
      setStatus(undefined);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Button onClick={() => setOpen(true)}>Statuses</Button>
      <Modal
        title={`TASK STATUSES`}
        open={open}
        width={500}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
      >
        <Row justify="center">
          <Form
            form={form}
            onFinish={onFinish}
            requiredMark="optional"
            layout="inline"
          >
            <Form.Item
              name="title"
              rules={[getRequiredStringRule("status title")]}
            >
              <Input placeholder="Status Title" />
            </Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              style={{ width: 120 }}
            >
              {status ? "Update" : "Add Status"}
            </Button>
            {status && (
              <Button
                style={{ marginLeft: 12 }}
                icon={<CloseRoundedIcon size={18} />}
                onClick={() => {
                  setStatus(undefined);
                  form.resetFields();
                }}
              />
            )}
          </Form>
        </Row>

        <div className="statuses-container-parent">
          <Spinner isActive={isPending}>
            <Space
              direction="vertical"
              size={16}
              className="statuses-container"
            >
              {data?.result?.map((status) => (
                <Card
                  hoverable
                  size="small"
                  key={status.id}
                  style={{
                    width: 250,
                    backgroundColor: "var(--primary-light-color)",
                  }}
                >
                  <Flex align="center" justify="space-between">
                    <span>{status.title}</span>
                    {disabled.includes(status.title) ? null : (
                      <Flex align="center" gap={6}>
                        <Button
                          icon={<PencilIcon size={16} />}
                          size="small"
                          onClick={() => onEdit(status)}
                        />
                        <Popconfirm
                          icon={<AlertIcon size={16} />}
                          title="Delete this status?"
                          onConfirm={async () => await deleteStatus(status.id)}
                        >
                          <Button
                            icon={<DeleteIcon size={16} />}
                            size="small"
                          />
                        </Popconfirm>
                      </Flex>
                    )}
                  </Flex>
                </Card>
              ))}
            </Space>
          </Spinner>
        </div>
      </Modal>
    </>
  );
};

export default TaskStatusForm;
