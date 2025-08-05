import { Button, Flex } from "antd";
import type { ReactNode } from "react";
import { PlusIcon } from "~/lib/icons";
import { useProfileQuery } from "~/lib/server/services";

/**
 * This component is used to add assignees to a project
 * @returns {ReactNode} The AddAssignee component
 */
const AddAssignee = (): ReactNode => {
  const { data } = useProfileQuery();
  return (
    <>
      {/* Only show the button if the user is not an employee */}
      {data?.result?.user.role === "employee" ? null : (
        <Button type="default">
          <Flex align="center" gap={5}>
            <PlusIcon size={20} />
            <span style={{ marginTop: "-1px" }}>Add Member</span>
          </Flex>
        </Button>
      )}
    </>
  );
};

export default AddAssignee;
