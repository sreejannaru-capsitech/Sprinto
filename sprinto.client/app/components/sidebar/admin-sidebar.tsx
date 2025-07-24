import { Menu, type MenuProps } from "antd";
import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { ADMIN_ROUTES } from "~/lib/const";
import {
  AdminIcon,
  CalenderIcon,
  PlusIcon,
  ProjectIcon,
  SearchIcon,
  TaskIcon,
  TeamLeadIcon,
  UserIcon,
  UsersIcon
} from "~/lib/icons";
import SidebarHeader from "./sidebar-header";

import "~/styles/sidebar.css";
import { isCurrentPath, menuItemStyle } from ".";

/**
 * This component renders admin-sidebar section
 * @returns {ReactNode} The AdminSidebar component
 */
const AdminSidebar = (): ReactNode => {
  const upperMenuItems: MenuProps["items"] = [
    {
      icon: <SearchIcon size={22} />,
      label: <span style={menuItemStyle}>Search</span>,
      key: "0",
    },
    {
      icon: <CalenderIcon size={22} />,
      label: (
        <NavLink
          to={"/" + ADMIN_ROUTES[0].toLowerCase()}
          style={menuItemStyle}
        >
          {ADMIN_ROUTES[0]}
        </NavLink>
      ),
      className: isCurrentPath(ADMIN_ROUTES[0].toLowerCase()),
      key: "1",
    },
    {
      icon: <PlusIcon size={22} />,
      popupClassName: "menu-popup",
      label: <span style={menuItemStyle}>Create</span>,
      children: [
        {
          icon: <UserIcon size={22} />,
          label: <span style={menuItemStyle}>User</span>,
          key: "1.1",
        },
        {
          icon: <ProjectIcon size={22} />,
          label: <span style={menuItemStyle}>Project</span>,
          key: "1.2",
        }
      ],
      key: "2",
    }
  ];

  const lowerMenuItems: MenuProps["items"] = [
    {
      icon: <ProjectIcon size={22} />,
      label: (
        <NavLink
          to={"/" + ADMIN_ROUTES[1].toLowerCase()}
          style={menuItemStyle}
        >
          {ADMIN_ROUTES[1]}
        </NavLink>
      ),
      className: isCurrentPath(ADMIN_ROUTES[1].toLowerCase()),
      key: "2",
    },
    {
      icon: <TaskIcon size={22} />,
      label: (
        <NavLink
          to={"/" + ADMIN_ROUTES[2].toLowerCase()}
          style={menuItemStyle}
        >
          {ADMIN_ROUTES[2]}
        </NavLink>
      ),
      className: isCurrentPath(ADMIN_ROUTES[2].toLowerCase()),
      key: "3",
    },
    {
      icon: <UsersIcon size={22} />,
      label: (
        <NavLink
          to={"/" + ADMIN_ROUTES[3].toLowerCase()}
          style={menuItemStyle}
        >
          {ADMIN_ROUTES[3]}
        </NavLink>
      ),
      className: isCurrentPath(ADMIN_ROUTES[3].toLowerCase()),
      key: "4",
    },
    {
      icon: <TeamLeadIcon size={22} />,
      label: (
        <NavLink
          to={"/" + ADMIN_ROUTES[4].toLowerCase()}
          style={menuItemStyle}
        >
          Team Leaders
        </NavLink>
      ),
      className: isCurrentPath(ADMIN_ROUTES[4].toLowerCase()),
      key: "5",
    },
    {
      icon: <AdminIcon size={22} />,
      label: (
        <NavLink
          to={"/" + ADMIN_ROUTES[5].toLowerCase()}
          style={menuItemStyle}
        >
          {ADMIN_ROUTES[5]}
        </NavLink>
      ),
      className: isCurrentPath(ADMIN_ROUTES[5].toLowerCase()),
      key: "6",
    },
  ];

  return (
    <>
      <SidebarHeader />
      <Menu
        mode="vertical"
        style={{ marginTop: "80px", background: "none" }}
        items={upperMenuItems}
        
      />

      <Menu
        mode="inline"
        style={{ marginTop: "80px", background: "none" }}
        items={lowerMenuItems}
      />
    </>
  );
};

export default AdminSidebar;
