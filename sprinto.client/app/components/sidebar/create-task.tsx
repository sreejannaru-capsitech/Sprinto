import { useState, type ReactNode } from "react";
import TaskForm from "../forms/task-form";
import { Button } from "antd";
import { PencilIcon } from "~/lib/icons";

/**
 * This component renders create-task section
 * @returns {ReactNode} The CreateTask component
 */
const CreateTask = (): ReactNode => {
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);

  return (
    <>
      <TaskForm open={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
      <Button
        className="header-button"
        onClick={() => setTaskModalOpen(true)}
        type="text"
        icon={<PencilIcon />}
      />
    </>
  );
};

export default CreateTask;
