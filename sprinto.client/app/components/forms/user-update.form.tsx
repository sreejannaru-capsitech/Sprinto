import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { useUserUpdate } from "~/lib/server/services";
import {
  getNonWhitespaceValidator,
  getRequiredEmailRule,
  getRequiredPasswordRule,
  getRequiredSelectRule,
  getRequiredStringRule,
} from "~/lib/validators";
import ImageUploader from "../ui/image-uploader";
import { roleOptions } from "~/lib/const";

interface UserUpdateFormProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

/**
 * This component renders user-update.form section
 * @param {UserUpdateFormProps} props
 * @returns {ReactNode} The UserUpdateForm component
 */
const UserUpdateForm: FC<UserUpdateFormProps> = ({
  user,
  open,
  onClose,
}: UserUpdateFormProps): ReactNode => {
  const [form] = Form.useForm<AdminUpdate>();
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const { _api, contextHolder } = useAntNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync: updateUser } = useUserUpdate(_api);

  useEffect(() => {
    if (!open || !user) return;
    form.setFieldValue("name", user.name);
    form.setFieldValue("email", user.email);
    form.setFieldValue("role", user.role);

    setBase64Image(user.displayPic ?? null);
  }, [open, user]);

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return error;
    }

    setLoading(true);
    try {
      await updateUser({
        id: user?.id ?? "",
        user: {
          name: values.name,
          email: values.email,
          role: values.role,
          password: values.password,
          displayPic: base64Image ? base64Image : undefined,
        },
      });
      form.resetFields();
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="EDIT PROFILE"
      open={open}
      onCancel={onClose}
      okText="Update"
      confirmLoading={loading}
      onOk={handleSubmit}
      afterClose={() => form.resetFields()}
      centered
    >
      {contextHolder}

      <Form form={form} requiredMark="optional" layout="vertical">
        {user && (
          <ImageUploader
            user={user}
            base64Image={base64Image}
            setBase64Image={setBase64Image}
          />
        )}

        <Row style={{ marginTop: 8 }} gutter={16}>
          <Col span={10}>
            <Form.Item
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
          <Col span={14}>
            <Form.Item
              label="Email"
              name="email"
              rules={[getRequiredEmailRule()]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[getNonWhitespaceValidator("password")]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<UserRequest>
              label="Role"
              name="role"
              rules={[getRequiredSelectRule("user role")]}
            >
              <Select options={roleOptions} placeholder="Select a role" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <Form.Item label="Default Password" required>
              <Button
                block
                type="primary"
                onClick={() => form.setFieldValue("password", "welcome")}
              >
                Set Default
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserUpdateForm;
