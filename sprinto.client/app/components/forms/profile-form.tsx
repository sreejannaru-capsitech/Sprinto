import { Form, Input, Modal } from "antd";
import { useEffect, type FC, type ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store/store";
import {
  getNonWhitespaceValidator,
  getRequiredStringRule,
} from "~/lib/validators";

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
}

interface ProfileFormType {
  name: string;
}

/**
 * This component renders profile-form section
 * @returns {ReactNode} The ProfileFormModal component
 */
const ProfileFormModal: FC<ProfileFormProps> = ({
  open,
  onClose,
}: ProfileFormProps): ReactNode => {
  const [form] = Form.useForm<ProfileFormType>();

  const user = useSelector((state: RootState) => state.user.user) as User;

  useEffect(() => {
    form.setFieldValue("name", user.name);
  }, [user]);

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return error;
    }
  };

  return (
    <Modal
      title="EDIT PROFILE"
      open={open}
      onCancel={onClose}
      okText="Save"
      onOk={handleSubmit}
      centered
    >
      <Form form={form} requiredMark="optional" layout="vertical">
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
      </Form>
    </Modal>
  );
};

export default ProfileFormModal;
