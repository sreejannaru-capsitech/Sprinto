import { Col, DatePicker, Form, Input, Modal, Row, Select, Switch } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useMemo, useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { createProject } from "~/lib/server/project.api";
import { useEmployeesQuery, useTeamLeadsQuery } from "~/lib/server/services";
import {
  getNonWhitespaceValidator,
  getRequiredSelectRule,
  getRequiredStringRule,
} from "~/lib/validators";

interface ProjectFormProps {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
}

interface ProjectFormType {
  title: string;
  description: string;
  isCompleted: boolean;
  deadline: Date;
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
      isCompleted: values.isCompleted,
      deadline: values.deadline,
      teamLead: values.teamLead,
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
        form.resetFields();
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      {contextHolder}
      <Form layout="vertical" form={form} requiredMark="optional">
        {/* Title */}
        <Form.Item<ProjectFormType>
          label="Title"
          name="title"
          rules={[
            getRequiredStringRule("title"),
            getNonWhitespaceValidator("title"),
          ]}
        >
          <Input placeholder="Project Title" />
        </Form.Item>

        {/* Description */}
        <Form.Item<ProjectFormType>
          label="Description"
          name="description"
          rules={[getRequiredStringRule("description")]}
        >
          <Input.TextArea placeholder="Project Description" rows={3} />
        </Form.Item>

        <Row gutter={16}>
          {!isNew && (
            <Col span={12}>
              <Form.Item<ProjectFormType>
                label={"Completed?"}
                name="isCompleted"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item<ProjectFormType>
              label="Deadline"
              name="deadline"
              rules={[getRequiredSelectRule("project deadline")]}
            >
              <DatePicker style={{ width: "100%" }} minDate={dayjs()} />
            </Form.Item>
          </Col>

          {isNew && (
            <Col span={12}>
              <Form.Item<ProjectFormType>
                label="Team Lead"
                name="teamLead"
                rules={[getRequiredSelectRule("team lead")]}
              >
                <Select
                  loading={teamLeadsPending}
                  options={teamLeadOptions}
                  placeholder="Select Team Lead"
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={16}>
          {!isNew && (
            <Col span={12}>
              {/* Team Lead */}
              <Form.Item<ProjectFormType>
                label="Team Lead"
                name="teamLead"
                rules={[
                  {
                    type: "string",
                    required: true,
                    message: "Please select Team Lead",
                  },
                ]}
              >
                <Select
                  loading={teamLeadsPending}
                  options={teamLeadOptions}
                  placeholder="Select Team Lead"
                />
              </Form.Item>
            </Col>
          )}

          <Col span={isNew ? 24 : 12}>
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
      </Form>
    </Modal>
  );
};

export default ProjectForm;
