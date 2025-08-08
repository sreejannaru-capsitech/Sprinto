import { useState, type FC, type ReactNode } from "react";
import TaskForm from "./forms/task-form";
import { Button, Flex } from "antd";
import { PencilIcon, PlusIcon } from "~/lib/icons";

interface CreateTaskProps {
  block?: boolean;
  plusIcon?: boolean;
}

/**
 * This component renders create-task section
 * @returns {ReactNode} The CreateTask component
 */
const CreateTask: FC<CreateTaskProps> = ({
  block = false,
  plusIcon = false,
}: CreateTaskProps): ReactNode => {
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);

  return (
    <>
      <TaskForm
        isNew
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
      />
      {block ? (
        <Button type="default" onClick={() => setTaskModalOpen(true)}>
          <Flex align="center" gap={5}>
            <PlusIcon size={20} />
            <span style={{ marginTop: "-1px" }}>Create New</span>
          </Flex>
        </Button>
      ) : (
        <Button
          className="header-button"
          onClick={() => setTaskModalOpen(true)}
          type={plusIcon ? "dashed" : "text"}
          icon={plusIcon ? <PlusIcon size={20} /> : <PencilIcon size={20} />}
        />
      )}
    </>
  );
};

export default CreateTask;
