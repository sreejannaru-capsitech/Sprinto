import { Col, Form, Input, Modal, Row, Select } from "antd";
import { useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { roleOptions, USER_ADMIN, USER_EMPLOYEE, USER_TEAM_LEAD } from "~/lib/const";
import { createUser } from "~/lib/server";
import { capitalizeFirst } from "~/lib/utils";
import {
  getNonWhitespaceValidator,
  getRequiredEmailRule,
  getRequiredSelectRule,
  getRequiredStringRule,
} from "~/lib/validators";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
}

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
      }}
      centered
      afterOpenChange={() => {
        if (open) return;
        form.resetFields();
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      {contextHolder}
      <Form layout="vertical" form={form} requiredMark="optional">
        {/* Email */}
        <Form.Item<UserRequest>
          label="Email"
          name="email"
          rules={[getRequiredEmailRule()]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            {/* Name */}
            <Form.Item<UserRequest>
              label="Name"
              name="name"
              rules={[
                getRequiredStringRule("name"),
                getNonWhitespaceValidator("name"),
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Role */}
            <Form.Item<UserRequest>
              label="Role"
              name="role"
              rules={[getRequiredSelectRule("user role")]}
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
