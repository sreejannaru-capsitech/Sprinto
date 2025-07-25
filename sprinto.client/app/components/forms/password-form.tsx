import { Form, Input, Modal } from "antd";
import { useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { changePassword } from "~/lib/server";
import {
  getRequiredEmailRule,
  getRequiredPasswordRule,
} from "~/lib/validators";

interface PasswordFormProps {
  open: boolean;
  onClose: () => void;
}

/**
 * This component renders password-form section
 * @returns {ReactNode} The PasswordForm component
 */
const PasswordForm: FC<PasswordFormProps> = ({
  open,
  onClose,
}: PasswordFormProps): ReactNode => {
  const [form] = Form.useForm<PasswordChangeRequest>();
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
      const res = await changePassword(values);
      if (res.status) {
        _api({
          message: "Password changed successfully",
          type: "success",
        });
        form.resetFields();
        onClose();
      } else {
        _api({ message: res.message, type: "error" });
      }
    } catch (error) {
      _api({ message: "Could not change password", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Change"
      title="CHANGE PASSWORD"
    >
      {contextHolder}
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item<PasswordChangeRequest>
          label="Email"
          name="email"
          rules={[getRequiredEmailRule()]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        {/* Password */}
        <Form.Item<PasswordChangeRequest>
          label="Old Password"
          name="oldPassword"
          rules={getRequiredPasswordRule()}
        >
          <Input.Password placeholder="Old Password" />
        </Form.Item>

        {/* New Password */}
        <Form.Item<PasswordChangeRequest>
          label="New Password"
          name="newPassword"
          rules={getRequiredPasswordRule()}
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordForm;
