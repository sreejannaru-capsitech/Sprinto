import { Upload } from "antd";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { UploadIcon } from "~/lib/icons";
import { convertToBase64, type FileType } from "~/lib/utils";

interface ImageUploaderProps {
  user: User;
  setBase64Image: Dispatch<SetStateAction<string | null>>;
}

/**
 * This component renders image-uploader section
 * @param {ImageUploaderProps} props
 * @returns {ReactNode} The ImageUploader component
 */
const ImageUploader: FC<ImageUploaderProps> = ({
  user,
  setBase64Image,
}: ImageUploaderProps): ReactNode => {
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

  return (
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
  );
};

export default ImageUploader;
