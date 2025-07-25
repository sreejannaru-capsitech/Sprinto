import { Col, Form, Input, Modal, Row, Select } from "antd";
import { useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { createUser } from "~/lib/server";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
}

const roleOptions = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Employee",
    value: "employee",
  },
  {
    label: "Team Lead",
    value: "teamLead",
  },
];

/**
 * This component renders user-form section
 * @param {UserFormProps} props
 * @returns {ReactNode} The UserForm component
 */
const UserForm: FC<UserFormProps> = ({
  open,
  onClose,
}: UserFormProps): ReactNode => {
  const [form] = Form.useForm<UserRequest>();
  const [loading, setLoading] = useState<boolean>(false);

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
      const res = await createUser(values);
      if (res.status) {
        _api({
          message: "User created successfully",
          type: "success",
        });
        form.resetFields();
        onClose();
      } else {
        _api({ message: res.message, type: "error" });
      }
    } catch (error) {
      _api({ message: "Could not create user", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="CREATE NEW USER"
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
        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please enter user email",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            {/* Name */}
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "Please enter user name",
                },
                {
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    const trimmed = value?.trim();
                    if (!trimmed) {
                      return Promise.reject(
                        new Error("Name cannot be just whitespace")
                      );
                    }
                    if (trimmed.length < 3) {
                      return Promise.reject(
                        new Error("Name should be at least 3 characters long")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Role */}
            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "Please select user role",
                },
              ]}
            >
              <Select options={roleOptions} placeholder="Select a role" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserForm;
