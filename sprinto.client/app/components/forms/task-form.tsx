import { DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useMemo, useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { useStatusesQuery } from "~/lib/server/services";
import {
  getNonWhitespaceValidator,
  getRequiredSelectRule,
  getRequiredStringRule,
} from "~/lib/validators";

interface TaskFormProps {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
}

interface TaskFormType {
  title: string;
  description: string;
  projectId: string;
  assignees: string[];
  dueDate: string;
  status: string;
  priority: TaskPriority;
}

const priorityOptions = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
];

/**
 * This component renders task-form section
 * @param {TaskFormProps} props
 * @returns {ReactNode} The TaskForm component
 */
const TaskForm: FC<TaskFormProps> = ({
  isNew = false,
  open,
  onClose,
}: TaskFormProps): ReactNode => {
  const [form] = Form.useForm<TaskFormType>();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: statuses, isPending: statusesPending } = useStatusesQuery();

  const statusOptions = useMemo(() => {
    return (
      statuses?.result?.map((status) => ({
        label: status.title,
        value: status.id,
      })) ?? []
    );
  }, [statuses]);

  const { _api, contextHolder } = useAntNotification();

  const handleSubmit = async () => {};

  return (
    <Modal
      title="CREATE NEW TASK"
      okText="Create"
      open={open}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      {contextHolder}
      <Form layout="vertical" form={form} requiredMark="optional">
        {/* Title */}
        <Form.Item<TaskFormType>
          label="Title"
          name="title"
          rules={[
            getRequiredStringRule("title"),
            getNonWhitespaceValidator("title"),
          ]}
        >
          <Input placeholder="Task Title" />
        </Form.Item>

        {/* Description */}
        <Form.Item<TaskFormType>
          label="Description"
          name="description"
          rules={[getRequiredStringRule("description")]}
        >
          <Input.TextArea placeholder="Task Description" rows={3} />
        </Form.Item>

        {/* Project */}
        <Form.Item<TaskFormType>
          label="Project"
          name="projectId"
          rules={[getRequiredSelectRule("project")]}
        >
          <Select
            loading={statusesPending}
            options={statusOptions}
            placeholder="Select a project"
          />
        </Form.Item>

        {/* Assignees */}
        <Form.Item<TaskFormType> label="Assignees" name="assignees">
          <Select
            mode="multiple"
            loading={statusesPending}
            placeholder="Select assignees"
            options={statusOptions}
          />
        </Form.Item>

        {/* Due Date */}
        <Form.Item<TaskFormType>
          label="Due Date"
          name="dueDate"
          rules={[getRequiredSelectRule("duedate")]}
        >
          <DatePicker style={{ width: "100%" }} minDate={dayjs()} />
        </Form.Item>

        {/* Status */}
        <Form.Item<TaskFormType>
          label="Status"
          name="status"
          rules={[getRequiredSelectRule("task status")]}
        >
          <Select
            loading={statusesPending}
            options={statusOptions}
            placeholder="Select status"
          />
        </Form.Item>

        {/* Priority */}
        <Form.Item<TaskFormType>
          label="Priority"
          name="priority"
          rules={[getRequiredSelectRule("task priority")]}
        >
          <Select options={priorityOptions} placeholder="Select priority" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
