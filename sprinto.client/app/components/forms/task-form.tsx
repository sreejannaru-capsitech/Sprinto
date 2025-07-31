import { Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import {
  useAssignedProjectsQuery,
  useCreateTask,
  useStatusesQuery,
  useUpdateTask,
} from "~/lib/server/services";
import {
  getNonWhitespaceValidator,
  getRequiredSelectRule,
  getRequiredStringRule,
} from "~/lib/validators";

interface TaskFormProps {
  isNew?: boolean;
  task?: Task;
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

const priorityOptions: SelectOptions[] = [
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
  task,
  open,
  onClose,
}: TaskFormProps): ReactNode => {
  const [form] = Form.useForm<TaskFormType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [assignees, setAssignees] = useState<SelectOptions[]>([]);

  useEffect(() => {
    if (task && !isNew) {
      changeAssignees(task.projectId);

      form.setFieldValue("title", task.title);
      form.setFieldValue("description", task.description);
      form.setFieldValue("projectId", task.projectId);
      form.setFieldValue(
        "assignees",
        task.assignees.map((a) => a.id)
      );
      form.setFieldValue("dueDate", dayjs(task.dueDate));
      form.setFieldValue("status", task.status.id);
      form.setFieldValue("priority", task.priority);
    }
  }, [task, isNew]);

  const { data: statuses, isPending: statusesPending } = useStatusesQuery();
  const { data: projects, isPending: projectsPending } =
    useAssignedProjectsQuery();

  const statusOptions: SelectOptions[] = useMemo(() => {
    return (
      statuses?.result?.map((status) => ({
        label: status.title,
        value: status.id,
      })) ?? []
    );
  }, [statuses]);

  const projectOptions: SelectOptions[] = useMemo(() => {
    return (
      projects?.result?.map((project) => ({
        label: project.title,
        value: project.id,
      })) ?? []
    );
  }, [projects]);

  /**
   * Updates the list of assignees for a given project.
   * - If no project ID is provided or the project isn't found, resets the assignees list.
   * - Otherwise, populates assignees from the project's current assignees and includes the team lead.
   *
   * @param value - The ID of the selected project.
   */
  const changeAssignees = (value: string) => {
    if (!value) {
      setAssignees([]);
      return;
    }

    const project = projects?.result?.find((project) => project.id === value);
    if (!project) {
      setAssignees([]);
      return;
    }

    const options = project.assignees.map((assignee) => ({
      label: assignee.name,
      value: assignee.id,
    }));

    options.push({
      label: project.teamLead.name,
      value: project.teamLead.id,
    });

    setAssignees(options);
  };

  const { _api, contextHolder } = useAntNotification();

  const { mutateAsync: createTask } = useCreateTask(_api);
  const { mutateAsync: updateTask } = useUpdateTask(_api);

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return error;
    }

    // Extracts ID and Name of assignees from the assignees list
    const getAssignees = (
      assignees: string[] | undefined,
      project: string
    ): Assignee[] => {
      const _proj = projects?.result?.find((proj) => proj.id === project);
      if (!_proj || !assignees) return [];

      const _assignees = _proj.assignees.map((assignee) => ({
        id: assignee.id,
        name: assignee.name,
      }));

      const asg = _assignees.filter((assignee) =>
        assignees.includes(assignee.id)
      );

      if (assignees.includes(_proj.teamLead.id)) {
        asg.push({
          id: _proj.teamLead.id,
          name: _proj.teamLead.name,
        });
      }

      return asg;
    };

    // Inject assignee names with their ids
    const payload: TaskItemRequest = {
      title: values.title,
      description: values.description,
      projectId: values.projectId,
      assignees: getAssignees(values.assignees, values.projectId),
      dueDate: dayjs(values.dueDate).format("YYYY-MM-DD"),
      status: statuses?.result?.find((status) => status.id === values.status)!, // get the status object from the id
      priority: values.priority,
    };

    setLoading(true);
    try {
      if (isNew) await createTask(payload);
      else await updateTask({ id: task?.id!, task: payload });
      form.resetFields();
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isNew ? "CREATE NEW TASK" : "EDIT TASK"}
      okText={isNew ? "Create" : "Save"}
      centered
      open={open}
      onCancel={() => {
        onClose();
      }}
      afterOpenChange={() => {
        if (open) return;
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
        <Form.Item<TaskFormType> label="Description" name="description">
          <Input.TextArea placeholder="Task Description" rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            {/* Project */}
            <Form.Item<TaskFormType>
              label="Project"
              name="projectId"
              rules={[getRequiredSelectRule("project")]}
            >
              <Select
                loading={projectsPending}
                options={projectOptions}
                placeholder="Select a project"
                disabled={!isNew}
                onChange={(value: string) => {
                  changeAssignees(value);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {/* Due Date */}
            <Form.Item<TaskFormType>
              label="Due Date"
              name="dueDate"
              rules={[getRequiredSelectRule("duedate")]}
            >
              <DatePicker
                style={{ width: "100%" }}
                minDate={isNew ? dayjs() : undefined}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Assignees */}
        <Form.Item<TaskFormType>
          label="Assignees"
          name="assignees"
          dependencies={["projectId"]}
          rules={[
            ({ getFieldValue }) => ({
              validator() {
                if (!getFieldValue("projectId")) {
                  return Promise.reject(
                    new Error("Please select a project to assign users")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Select
            mode="multiple"
            loading={projectsPending}
            maxTagCount="responsive"
            placeholder="Select assignees"
            options={assignees}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            {/* Priority */}
            <Form.Item<TaskFormType>
              label="Priority"
              name="priority"
              rules={[getRequiredSelectRule("task priority")]}
            >
              <Select options={priorityOptions} placeholder="Select priority" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TaskForm;
