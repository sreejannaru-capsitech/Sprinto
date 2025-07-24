import { useQuery } from "@tanstack/react-query";
import { Flex, Space, Avatar, Dropdown, Button, type MenuProps } from "antd";
import type { ReactNode } from "react";
import { PROFILE_KEY } from "~/lib/const";
import { DownArrow, PencilIcon } from "~/lib/icons";
import { getMe } from "~/lib/server/auth.api";
import { getInitials } from "~/lib/utils";

/**
 * This component renders sidebar-header section
 * @returns {ReactNode} The SidebarHeader component
 */
const SidebarHeader = (): ReactNode => {
  const { data } = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getMe,
    staleTime: 55 * 60 * 1000, // 55 minutes
  });

  const items: MenuProps["items"] = [
    {
      label: (
        <a href="/profile" rel="noopener noreferrer">
          Profile
        </a>
      ),
      key: "0",
      style: { width: "100px" },
    },
    {
      label: "Log out",
      onClick: () => window.location.reload(),
      style: { width: "100px" },
      key: "1",
    },
  ];

  return (
    <Flex align="center" justify="space-between">
      <Space>
        <Avatar style={{ backgroundColor: "var(--primary-color)" }}>
          {getInitials(data?.result?.user.name ?? "")}
        </Avatar>
        <Dropdown trigger={["click"]} menu={{ items }} placement="bottomLeft">
          <span style={{ cursor: "pointer" }}>
            {data?.result?.user.name}

            <DownArrow size={16} />
          </span>
        </Dropdown>
      </Space>
      {data?.result?.user.role !== "admin" && (
        <Button className="header-button" type="text" icon={<PencilIcon />} />
      )}
    </Flex>
  );
};

export default SidebarHeader;
