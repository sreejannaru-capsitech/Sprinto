import { Avatar, Button, Dropdown, Flex, Space, type MenuProps } from "antd";
import { isAxiosError } from "axios";
import type { ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import { DownArrow, PencilIcon } from "~/lib/icons";
import { logOut } from "~/lib/server/auth.api";
import { useProfileQuery } from "~/lib/server/services";
import { getInitials } from "~/lib/utils";

/**
 * This component renders sidebar-header section
 * @returns {ReactNode} The SidebarHeader component
 */
const SidebarHeader = (): ReactNode => {
  const { data } = useProfileQuery();

  const { _api, contextHolder } = useAntNotification();

  const handleLogout = async () => {
    try {
      const res = await logOut();
      if (!res.status) {
        _api({ message: "Failed to log out", type: "error" });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        _api({
          message: error.cause?.message ?? error.message,
          type: "error",
        });
      } else {
        _api({ message: "Failed to log out", type: "error" });
      }
    }
    window.location.href = "/";
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <a href="/profile" rel="noopener noreferrer">
          Profile
        </a>
      ),
      key: "0",
      style: { width: "150px" },
    },
    {
      label: "Change Password",
      onClick: () => window.location.reload(),
      style: { width: "150px" },
      key: "1",
    },
    {
      label: "Log out",
      onClick: () => handleLogout(),
      style: { width: "150px" },
      danger: true,
      key: "2",
    },
  ];

  return (
    <Flex align="center" justify="space-between">
      {contextHolder}
      <Space>
        <Avatar style={{ backgroundColor: "var(--primary-color)" }}>
          {getInitials(data?.result?.user.name ?? "")}
        </Avatar>
        <Dropdown trigger={["click"]} menu={{ items }} placement="bottomRight">
          <Flex align="center" style={{ cursor: "pointer" }}>
            <span>{data?.result?.user.name}</span>

            <DownArrow size={16} />
          </Flex>
        </Dropdown>
      </Space>
      {data?.result?.user.role !== "admin" && (
        <Button className="header-button" type="text" icon={<PencilIcon />} />
      )}
    </Flex>
  );
};

export default SidebarHeader;
