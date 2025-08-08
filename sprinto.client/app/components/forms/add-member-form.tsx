import { Form, Modal, Select } from "antd";
import { useState, type FC, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useAntNotification } from "~/hooks";
import { useAddMembers, useUserSearchQuery } from "~/lib/server/services";
import type { RootState } from "~/lib/store";
import { getOptionsFromUsers } from "~/lib/utils";
import { getRequiredSelectRule } from "~/lib/validators";

interface AddMemberFormProps {
  open: boolean;
  onClose: () => void;
}

interface MemberFormType {
  members: string[];
}

/**
 * This component renders add-member-form section
 * @returns {ReactNode} The AddMemberForm component
 */
const AddMemberForm: FC<AddMemberFormProps> = ({
  open,
  onClose,
}): ReactNode => {
  const { _api, contextHolder } = useAntNotification();
  const [form] = Form.useForm<MemberFormType>();

  const proj = useSelector(
    (state: RootState) => state.project.project
  ) as Project;

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data, isPending, isFetching } = useUserSearchQuery(query);

  const { mutateAsync: addMembers } = useAddMembers(_api);

  const onSearch = (value?: string) => {
    if (!value) setQuery("");
    else setQuery(value);
  };

  const handleSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return error;
    }

    setLoading(true);
    try {
      await addMembers({ projectId: proj.id, memberIds: values.members });
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="ADD NEW MEMBERS"
      okText="Save"
      centered
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      afterOpenChange={() => {
        if (open) return;
        form.resetFields();
      }}
      confirmLoading={loading}
    >
      {contextHolder}

      <Form layout="vertical" form={form} requiredMark="optional">
        <Form.Item<MemberFormType>
          label="Employees"
          name="members"
          rules={[getRequiredSelectRule("members")]}
        >
          <Select
            showSearch
            allowClear
            loading={isPending || isFetching}
            options={getOptionsFromUsers(data?.result ?? [], [
              ...proj.assignees, // Exclude assignees from the list
              proj.teamLead, // Team lead is also an assignee
            ])}
            onSearch={onSearch}
            optionFilterProp="label"
            maxTagCount="responsive"
            mode="multiple"
            placeholder="Select members"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMemberForm;
