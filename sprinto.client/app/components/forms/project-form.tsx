import { Col, DatePicker, Form, Input, Modal, Row, Select, Switch } from "antd";
import { useMemo, useState, type FC, type ReactNode } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { EMPLOYEES_KEY, TEAM_LEADS_KEY } from "~/lib/const";
import { getEmployees, getTeamLeads } from "~/lib/server/user.api";
import { useAntNotification } from "~/hooks";
import { createProject } from "~/lib/server/project.api";

interface ProjectFormProps {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
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
  const [form] = Form.useForm<ProjectRequest>();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: employees, isPending: employeesPending } = useQuery({
    queryKey: [EMPLOYEES_KEY],
    queryFn: getEmployees,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: teamLeads, isPending: teamLeadsPending } = useQuery({
    queryKey: [TEAM_LEADS_KEY],
    queryFn: getTeamLeads,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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

    setLoading(true);
    try {
      const res = await createProject(values);
      if (res.status) {
        _api({
          message: "Project created successfully",
          type: "success",
        });
        form.resetFields();
        onClose();
      } else {
        _api({ message: res.message, type: "error" });
      }
    } catch (error) {
      _api({ message: "Could not create project", type: "error" });
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
      okButtonProps={{ style: { minWidth: "100px" } }}
      cancelButtonProps={{ style: { minWidth: "100px" } }}
    >
      {contextHolder}
      <Form layout="vertical" form={form} requiredMark="optional">
        {/* Title */}
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              type: "string",
              required: true,
              message: "Please enter title",
            },
            {
              validator(_, value) {
                if (!value) return Promise.resolve();
                const trimmed = value?.trim();
                if (!trimmed) {
                  return Promise.reject(
                    new Error("Title cannot be just whitespace")
                  );
                }
                if (trimmed.length < 3) {
                  return Promise.reject(
                    new Error("Title should be at least 3 characters long")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Project Title" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              type: "string",
              required: true,
              message: "Please enter project description",
            },
          ]}
        >
          <Input.TextArea placeholder="Project Description" rows={3} />
        </Form.Item>

        <Row gutter={16}>
          {!isNew && (
            <Col span={12}>
              <Form.Item
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
            <Form.Item
              label="Deadline"
              name="deadline"
              rules={[
                { required: true, message: "Please select project deadline" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} minDate={dayjs()} />
            </Form.Item>
          </Col>

          {isNew && (
            <Col span={12}>
              <Form.Item
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
        </Row>

        <Row gutter={16}>
          {!isNew && (
            <Col span={12}>
              {/* Team Lead */}
              <Form.Item
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
            <Form.Item label="Assignees" name="assignees">
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
