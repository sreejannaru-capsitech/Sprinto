import { Flex, Input, Modal, Select, Space } from "antd";
import { useState, type FC, type ReactNode } from "react";
import CenteredLayout from "~/layouts/centered-layout";
import {
  useProjectsSearchQuery,
  useTasksSearchQuery,
} from "~/lib/server/services";

import "~/styles/items.css";
import SearchedTask from "../ui/searched-task";
import Spinner from "../ui/spinner";
import SearchedProject from "../ui/searched-project";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store";
import { USER_ADMIN } from "~/lib/const";

interface SearchFormProps {
  open: boolean;
  onClose: () => void;
}

type OptionValueType = "task" | "project" | "user";

const options = [
  {
    label: "Task",
    value: "task",
  },
  {
    label: "Project",
    value: "project",
  },
  // {
  //   label: "User",
  //   value: "user",
  // },
];

/**
 * This component renders search-form section
 * @returns {ReactNode} The SearchForm component
 */
const SearchForm: FC<SearchFormProps> = ({
  open,
  onClose,
}: SearchFormProps): ReactNode => {
  const user = useSelector((state: RootState) => state.user.user) as User;

  const [queryInput, setQueryInput] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<OptionValueType>("task");
  const { data, isFetching } = useTasksSearchQuery(query);

  const { data: projects, isFetching: projectsFetching } =
    useProjectsSearchQuery(query, user.role === USER_ADMIN);

  return (
    <Modal
      title={`SEARCH IN SPRINTO`}
      open={open}
      onCancel={onClose}
      width={600}
      confirmLoading={isFetching}
      okText="Search"
      onOk={() => setQuery(queryInput)}
      afterClose={() => setQuery("")}
      centered
    >
      <Flex align="center" gap={6}>
        <Input
          placeholder={`Search for ${selected}s`}
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          style={{ marginBottom: 80 }}
        />
        <Select
          placeholder="Search By"
          defaultValue={selected}
          onChange={(value) => setSelected(value)}
          options={user.role === USER_ADMIN ? options : options.slice(0, 1)}
          style={{ marginBottom: 80, width: 200 }}
        />
      </Flex>

      <CenteredLayout>
        {isFetching ? (
          <Spinner isActive={isFetching || projectsFetching}>{null}</Spinner>
        ) : (
          <>
            {selected === "task" ? (
              <Space
                direction="vertical"
                size={16}
                className="search-container"
              >
                {data?.result?.map((task) => (
                  <SearchedTask task={task} key={task.id} onClose={onClose} />
                ))}
              </Space>
            ) : (
              <Space
                direction="vertical"
                size={16}
                className="search-container"
              >
                {projects?.result?.map((project) => (
                  <SearchedProject
                    project={project}
                    key={project.id}
                    onClose={onClose}
                  />
                ))}
              </Space>
            )}
          </>
        )}
      </CenteredLayout>
    </Modal>
  );
};

export default SearchForm;
