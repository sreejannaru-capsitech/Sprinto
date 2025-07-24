import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Menu,
  Space,
  type MenuProps,
} from "antd";
import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { PROFILE_KEY, SIDEBAR_ROUTES } from "~/lib/const";
import {
  CalenderIcon,
  DownArrow,
  PencilIcon,
  SearchIcon,
  TodayIcon,
  InboxIcon,
  ProjectIcon,
} from "~/lib/icons";
import { getMe } from "~/lib/server/auth.api";
import { getInitials } from "~/lib/utils";

import "~/styles/sidebar.css";

/**
 * This component renders sidebar section
 * @returns {ReactNode} The EmployeeSidebar component
 */
const EmployeeSidebar = (): ReactNode => {
  const { data } = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getMe,
    staleTime: 55 * 60 * 1000, // 55 minutes
  });

  const isSelected = (path: string): string => {
    if (window.location.pathname.split("/")[1] === path) {
      return "ant-menu-item-selected";
    }
    return "";
  };

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

  const menuItems: MenuProps["items"] = [
    {
      icon: <SearchIcon size={22} />,
      label: <span style={{ marginLeft: "10px" }}>Search</span>,
      key: "0",
    },
    {
      icon: <TodayIcon size={22} />,
      label: (
        <NavLink
          to={"/" + SIDEBAR_ROUTES[0].toLowerCase()}
          style={{ marginLeft: "10px" }}
        >
          {SIDEBAR_ROUTES[0]}
        </NavLink>
      ),
      className: isSelected(SIDEBAR_ROUTES[0].toLowerCase()),
      key: "1",
    },
    {
      icon: <InboxIcon size={22} />,
      label: (
        <NavLink
          to={"/" + SIDEBAR_ROUTES[1].toLowerCase()}
          style={{ marginLeft: "10px" }}
        >
          {SIDEBAR_ROUTES[1]}
        </NavLink>
      ),
      className: isSelected(SIDEBAR_ROUTES[1].toLowerCase()),
      key: "2",
    },
    {
      icon: <CalenderIcon size={22} />,
      label: (
        <NavLink
          to={"/" + SIDEBAR_ROUTES[2].toLowerCase()}
          style={{ marginLeft: "10px" }}
        >
          {SIDEBAR_ROUTES[2]}
        </NavLink>
      ),
      className: isSelected(SIDEBAR_ROUTES[2].toLowerCase()),
      key: "3",
    },
    {
      icon: <ProjectIcon size={22} />,
      label: (
        <NavLink
          to={"/" + SIDEBAR_ROUTES[3].toLowerCase()}
          style={{ marginLeft: "10px" }}
        >
          {SIDEBAR_ROUTES[3]}
        </NavLink>
      ),
      className: isSelected(SIDEBAR_ROUTES[3].toLowerCase()),
      key: "4",
    },
  ];

  console.log(window.location.pathname.split("/")[1]);

  return (
    <>
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
        <Button className="header-button" type="text" icon={<PencilIcon />} />
      </Flex>
      {/* <Space direction="vertical" size={24} style={{ marginTop: "80px", width: "100%" }}>
        <Button block type="text">Search</Button>

        <NavLink to="/today">Today</NavLink>
        <NavLink to="/inbox">Inbox</NavLink>
        <NavLink to="/upcoming">Upcoming</NavLink>
        <NavLink to="/projects">Projects</NavLink>
      </Space> */}
      <Menu
        mode="inline"
        style={{ marginTop: "80px", background: "none" }}
        items={menuItems}
      ></Menu>
    </>
  );
};

export default EmployeeSidebar;
