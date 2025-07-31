import {
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useMemo, useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { createProject } from "~/lib/server/project.api";
import { useEmployeesQuery, useTeamLeadsQuery } from "~/lib/server/services";
import { getAliasFromTitle } from "~/lib/utils";
import {
  getNonWhitespaceValidator,
  getRequiredStringRule,
} from "~/lib/validators";

interface ProjectFormProps {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
}

interface ProjectFormType {
  title: string;
  alias: string;
  description: string;
  isCompleted: boolean;
  startDate?: string;
  deadline?: string;
  teamLead: string;
  assignees: string[];
}

/**
 * This component renders project-form section
 * @returns {ReactNode} The ProjectForm component
 */
const ProjectForm: FC<ProjectFormProps> = ({
  isNew = false,
  open,
  onClose,
}: ProjectFormProps): ReactNode => {
  const [form] = Form.useForm<ProjectFormType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [alias, setAlias] = useState<string>("");

  const { data: employees, isPending: employeesPending } = useEmployeesQuery();

  const { data: teamLeads, isPending: teamLeadsPending } = useTeamLeadsQuery();

  const assigneeOptions = useMemo(() => {
    return (
      employees?.result?.items?.map((employee) => ({
        label: employee.name,
        value: employee.id,
      })) ?? []
    );
  }, [employees]);

  const teamLeadOptions = useMemo(() => {
    return (
      teamLeads?.result?.items?.map((teamLead) => ({
        label: teamLead.name,
        value: teamLead.id,
      })) ?? []
    );
  }, [teamLeads]);

  const { _api, contextHolder } = useAntNotification();

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return error;
    }

    // Inject assignee names with their ids
    const payload: ProjectRequest = {
      title: values.title,
      description: values.description,
      alias: alias,
      isCompleted: values.isCompleted,
      deadline: values.deadline
        ? dayjs(values.deadline).format("YYYY-MM-DD")
        : undefined,
      startDate: values.startDate
        ? dayjs(values.startDate).format("YYYY-MM-DD")
        : undefined,
      teamLead: teamLeads?.result?.items.find(
        (e) => e.id === values.teamLead
      ) ?? {
        id: values.teamLead,
        name: values.teamLead,
      },
      assignees:
        employees?.result?.items
          ?.filter((employee) => values.assignees?.includes(employee.id))
          .map((employee) => ({ id: employee.id, name: employee.name })) ?? [],
    };

    setLoading(true);
    try {
      await createProject(payload);
      _api({
        message: "Project created successfully",
        type: "success",
      });
      form.resetFields();
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        _api({ message: error.message, type: "error" });
      } else {
        _api({ message: "Could not create project", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="CREATE NEW PROJECT"
      okText="Create"
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
        <Row gutter={16}>
          <Col span={18}>
            {/* Title */}
            <Form.Item<ProjectFormType>
              label="Title"
              name="title"
              rules={[
                getRequiredStringRule("title"),
                getNonWhitespaceValidator("title"),
              ]}
            >
              <Input
                placeholder="Project Title"
                onChange={(e) => setAlias(getAliasFromTitle(e.target.value))}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<ProjectFormType> label="Alias" required>
              <Input disabled placeholder="Alias" value={alias} />
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}
        <Form.Item<ProjectFormType>
          label="Description"
          name="description"
          rules={[getRequiredStringRule("description")]}
        >
          <Input.TextArea placeholder="Project Description" rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<ProjectFormType> label="Start Date" name="startDate">
              <DatePicker
                style={{ width: "100%" }}
                minDate={dayjs().subtract(6, "weeks")}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<ProjectFormType> label="Deadline" name="deadline">
              <DatePicker style={{ width: "100%" }} minDate={dayjs()} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            {/* Team Lead */}
            <Form.Item<ProjectFormType>
              label="Team Lead"
              name="teamLead"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "Please select TL",
                },
              ]}
            >
              <Select
                loading={teamLeadsPending}
                options={teamLeadOptions}
                placeholder="Select TL"
              />
            </Form.Item>
          </Col>

          <Col span={16}>
            {/* Assignees */}
            <Form.Item<ProjectFormType> label="Assignees" name="assignees">
              <Select
                mode="multiple"
                loading={employeesPending}
                placeholder="Select assignees"
                options={assigneeOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        {!isNew && (
          <Flex align="center" gap={8}>
            <Typography.Text>Mark As Completed?</Typography.Text>
            <Form.Item<ProjectFormType>
              name="isCompleted"
              valuePropName="checked"
              initialValue={false}
              style={{ marginBottom: 0 }}
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Flex>
        )}
      </Form>
    </Modal>
  );
};

export default ProjectForm;
