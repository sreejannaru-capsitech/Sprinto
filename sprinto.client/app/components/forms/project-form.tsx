import { Col, DatePicker, Form, Input, Modal, Row, Switch } from "antd";
import { useState, type FC, type ReactNode } from "react";
import dayjs from "dayjs";

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
}

/**
 * This component renders project-form section
 * @returns {ReactNode} The ProjectForm component
 */
const ProjectForm: FC<ProjectFormProps> = ({ open, onClose }) => {
  const [form] = Form.useForm<ProjectRequest>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Modal
      title="CREATE NEW PROJECT"
      okText="Create"
      open={open}
      onCancel={onClose}
      onOk={async () => {
        try {
          setLoading(true);
          await form.validateFields();
          console.log(form.getFieldsValue());
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }}
      confirmLoading={loading}
      okButtonProps={{ style: { minWidth: "100px" } }}
      cancelButtonProps={{ style: { minWidth: "100px" } }}
    >
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
        </Row>

        <Row gutter={16}>
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
              <Input placeholder="Team Lead" />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Assignees */}
            <Form.Item
              label="Assignees"
              name="assignees"
            >
              <Input.TextArea placeholder="Assignees" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
