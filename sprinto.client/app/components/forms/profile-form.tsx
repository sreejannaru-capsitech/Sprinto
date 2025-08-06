import {
  Flex,
  Form,
  Input,
  Modal,
  Upload,
  type GetProp,
  type UploadProps,
} from "antd";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useAntNotification } from "~/hooks";
import { UploadIcon } from "~/lib/icons";
import { useProfileUpdate } from "~/lib/server/services";
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

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

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
    form.setFieldValue("name", user.name);
  }, [user]);

  const convertToBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleBeforeUpload = async (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (isJpgOrPng && isLt2M) {
      const base64 = await convertToBase64(file);
      setBase64Image(base64);
    }

    return false; // Prevent default upload
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <UploadIcon size={24} />
      <div style={{ marginTop: 6 }}>Upload</div>
    </button>
  );

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
      afterOpenChange={() => {
        if (open) return;
        form.resetFields();
      }}
      centered
    >
      {contextHolder}
      <Form form={form} requiredMark="optional" layout="vertical">
        <Flex vertical align="center" justify="center" gap={8}>
          <Upload
            name="avatar"
            listType="picture-circle"
            beforeUpload={handleBeforeUpload}
            accept="image/png, image/jpeg"
            showUploadList={false}
          >
            {user.displayPic ? (
              <img
                src={user.displayPic}
                style={{ width: "100%", borderRadius: "50%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>

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
