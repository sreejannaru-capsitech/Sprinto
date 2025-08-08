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
import { useEffect, useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { USER_EMPLOYEE, USER_TEAM_LEAD } from "~/lib/const";
import { checkAlias } from "~/lib/server";
import {
  useCreateProject,
  useUpdateProject,
  useUserSearchQuery,
} from "~/lib/server/services";
import { getAliasFromTitle, getOptionsFromTeam } from "~/lib/utils";
import {
  getNonWhitespaceValidator,
  getRequiredSelectRule,
  getRequiredStringRule,
} from "~/lib/validators";

interface ProjectFormProps {
  isNew?: boolean;
  project?: Project;
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
  project,
  open,
  onClose,
}: ProjectFormProps): ReactNode => {
  const [form] = Form.useForm<ProjectFormType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [alias, setAlias] = useState<string>("");
  const [empQuery, setEmpQuery] = useState<string>("");
  const [tlQuery, setTlQuery] = useState<string>("");

  const { data: employees, isPending: employeesPending } = useUserSearchQuery(
    empQuery,
    USER_EMPLOYEE
  );

  const { data: teamLeads, isPending: teamLeadsPending } = useUserSearchQuery(
    tlQuery,
    USER_TEAM_LEAD
  );

  const { _api, contextHolder } = useAntNotification();

  const { mutateAsync: createProject } = useCreateProject(_api);
  const { mutateAsync: updateProject } = useUpdateProject(_api);

  useEffect(() => {
    if (!isNew && project) {
      form.setFieldsValue({
        title: project.title,
        alias: project.alias,
        description: project.description,
        isCompleted: project.isCompleted,
        teamLead: project.teamLead.id,
        assignees: project.assignees.map((a) => a.id),
      });
      setAlias(project.alias);
      form.setFieldValue(
        "deadline",
        project.deadline ? dayjs(project.deadline) : undefined
      );
      form.setFieldValue(
        "startDate",
        project.startDate ? dayjs(project.startDate) : undefined
      );
    }
  }, [project, open]);

  /**
   * Checks if the project alias is available.
   * If it is, displays a success message.
   * If it is not, displays an error message.
   *
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the availability of the alias.
   */
  const isAvailableAlias = async (): Promise<boolean> => {
    // Check if Editing
    if (!isNew) return true;

    // Check if valid alias
    if (!alias || alias.length < 3) return false;
    try {
      const data = await checkAlias(alias);
      if (!data.result) {
        _api({ message: "Alias already exists", type: "error" });
      }
      return data.result ?? false;
    } catch (error) {
      if (error instanceof AxiosError) {
        _api({ message: error.message, type: "error" });
      } else {
        _api({ message: "Could not check alias", type: "error" });
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return error;
    }

    if (alias.length < 3) {
      _api({ message: "Alias must be at least 3 characters", type: "error" });
      return;
    }

    // Check if alias already exists
    const check = await isAvailableAlias();
    if (!check) return;

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
      teamLead: values.teamLead,
      assignees: values.assignees,
    };

    setLoading(true);
    try {
      if (isNew) await createProject(payload);
      else await updateProject({ projectId: project?.id!, project: payload });
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isNew ? "CREATE NEW PROJECT" : "EDIT PROJECT"}
      okText={isNew ? "Create" : "Save"}
      centered
      open={open}
      onCancel={onClose}
      afterClose={() => form.resetFields()}
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
                onBlur={isAvailableAlias}
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
                minDate={isNew ? dayjs().subtract(6, "weeks") : undefined}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<ProjectFormType> label="Deadline" name="deadline">
              <DatePicker
                style={{ width: "100%" }}
                minDate={isNew ? dayjs() : undefined}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            {/* Team Lead */}
            <Form.Item<ProjectFormType>
              label="Team Lead"
              name={USER_TEAM_LEAD}
              rules={[getRequiredSelectRule("TL")]}
            >
              <Select
                showSearch
                onSearch={(value) => {
                  if (value) setTlQuery(value);
                  else setTlQuery("");
                }}
                optionFilterProp="label"
                loading={teamLeadsPending}
                options={getOptionsFromTeam(teamLeads?.result ?? [])}
                placeholder="Select TL"
              />
            </Form.Item>
          </Col>

          <Col span={16}>
            {/* Assignees */}
            <Form.Item<ProjectFormType> label="Assignees" name="assignees">
              <Select
                showSearch
                onSearch={(value) => {
                  if (value) setEmpQuery(value);
                  else setEmpQuery("");
                }}
                optionFilterProp="label"
                mode="multiple"
                maxTagCount="responsive"
                loading={employeesPending}
                placeholder="Select assignees"
                options={getOptionsFromTeam(employees?.result ?? [])}
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
