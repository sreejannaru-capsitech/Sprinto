import { Menu, type MenuProps } from "antd";
import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { SIDEBAR_ROUTES } from "~/lib/const";
import {
  CalenderIcon,
  InboxIcon,
  ProjectIcon,
  SearchIcon,
  TodayIcon,
} from "~/lib/icons";

import "~/styles/sidebar.css";
import SidebarHeader from "./sidebar-header";
import { isCurrentPath, menuItemStyle } from ".";

/**
 * This component renders sidebar section
 * @returns {ReactNode} The EmployeeSidebar component
 */
const EmployeeSidebar = (): ReactNode => {
  const menuItems: MenuProps["items"] = [
    {
      icon: <SearchIcon size={22} />,
      label: <span style={menuItemStyle}>Search</span>,
      key: "0",
    },
    {
      icon: <TodayIcon size={22} />,
      label: (
        <NavLink
          to={"/" + SIDEBAR_ROUTES[0].toLowerCase()}
          style={menuItemStyle}
        >
          {SIDEBAR_ROUTES[0]}
        </NavLink>
      ),
      className: isCurrentPath(SIDEBAR_ROUTES[0].toLowerCase()),
      key: "1",
    },
    {
      icon: <InboxIcon size={22} />,
      label: (
        <NavLink
          to={"/" + SIDEBAR_ROUTES[1].toLowerCase()}
          style={menuItemStyle}
        >
          {SIDEBAR_ROUTES[1]}
        </NavLink>
      ),
      className: isCurrentPath(SIDEBAR_ROUTES[1].toLowerCase()),
      key: "2",
    },
    {
      icon: <CalenderIcon size={22} />,
      label: (
        <NavLink
          to={"/" + SIDEBAR_ROUTES[2].toLowerCase()}
          style={menuItemStyle}
        >
          {SIDEBAR_ROUTES[2]}
        </NavLink>
      ),
      className: isCurrentPath(SIDEBAR_ROUTES[2].toLowerCase()),
      key: "3",
    },
    {
      icon: <ProjectIcon size={22} />,
      label: (
        <NavLink
          to={"/" + SIDEBAR_ROUTES[3].toLowerCase()}
          style={menuItemStyle}
        >
          {SIDEBAR_ROUTES[3]}
        </NavLink>
      ),
      className: isCurrentPath(SIDEBAR_ROUTES[3].toLowerCase()),
      key: "4",
    },
  ];

  return (
    <>
      <SidebarHeader />
      <Menu
        mode="inline"
        style={{ marginTop: "80px", background: "none" }}
        items={menuItems}
      />
    </>
  );
};

export default EmployeeSidebar;
