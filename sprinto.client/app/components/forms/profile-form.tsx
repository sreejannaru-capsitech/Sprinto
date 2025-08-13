import {
  Flex,
  Form,
  Input,
  Modal
} from "antd";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useAntNotification } from "~/hooks";
import { useProfileUpdate } from "~/lib/server/services";
import type { RootState } from "~/lib/store";
import {
  getNonWhitespaceValidator,
  getRequiredStringRule,
} from "~/lib/validators";
import ImageUploader from "../ui/image-uploader";

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
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user.user) as User;
  const { _api, contextHolder } = useAntNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync: updateProfile } = useProfileUpdate(_api);

  useEffect(() => {
    if (!open) return;
    form.setFieldValue("name", user.name);
  }, [open]);

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return error;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: values.name,
        displayPic: base64Image ? base64Image : undefined,
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
      okText="Save"
      confirmLoading={loading}
      onOk={handleSubmit}
      afterClose={() => form.resetFields()}
      centered
    >
      {contextHolder}
      <Form form={form} requiredMark="optional" layout="vertical">
        <Flex vertical align="center" justify="center" gap={8}>
          <ImageUploader user={user} setBase64Image={setBase64Image} />

          <p className="no-margin">Profile Picture</p>
        </Flex>
        <Form.Item
          label="Name"
          name="name"
          style={{ marginTop: 8 }}
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
