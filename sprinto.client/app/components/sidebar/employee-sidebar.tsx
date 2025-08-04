import { Menu, type MenuProps } from "antd";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import { SIDEBAR_ROUTES } from "~/lib/const";
import {
  ArchiveIcon,
  CalenderIcon,
  DashboardIcon,
  InboxIcon,
  ProjectIcon,
  SearchIcon,
  TaskIcon,
  TodayIcon,
  UsersIcon,
} from "~/lib/icons";

import { useProjectsQuery } from "~/lib/server/services";
import "~/styles/sidebar.css";
import { menuItemStyle } from ".";
import ToolTip from "../ui/tooltip";
import SidebarHeader from "./sidebar-header";

/**
 * This component renders sidebar section
 * @returns {ReactNode} The EmployeeSidebar component
 */
const EmployeeSidebar = (): ReactNode => {
  const { data: projs } = useProjectsQuery();

  const [staticSelectedKey, setStaticSelectedKey] = useState<string[]>([]);
  const [dynamicSelectedKey, setDynamicSelectedKey] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const path = window.location.pathname.split("/");

    if (path.length === 2) {
      setStaticSelectedKey([path[1]]);
      setDynamicSelectedKey([]);
      // setOpenKeys([]);
    } else if (path.length === 3) {
      setStaticSelectedKey([]);
      setDynamicSelectedKey([`${path[2]}-overview`]);
      setOpenKeys([path[2]]);
    } else if (path.length > 3) {
      setStaticSelectedKey([]);
      setDynamicSelectedKey([`${path[2]}-${path[3]}`]);
      setOpenKeys([path[2]]);
    }
  }, [window.location.pathname]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    // only one submenu
    const latest = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latest ? [latest] : []);
  };

  const onStaticSelect: MenuProps["onSelect"] = ({ key }) => {
    setStaticSelectedKey([key]);
    setDynamicSelectedKey([]);
    // setOpenKeys([]);
  };

  const onDynamicSelect: MenuProps["onSelect"] = ({ key, keyPath }) => {
    setStaticSelectedKey([]);
    setDynamicSelectedKey([key]);
    setOpenKeys([keyPath[1]]); // parent key of submenu
  };

  const menuItems: MenuProps["items"] = [
    {
      icon: <SearchIcon size={22} />,
      label: <span style={menuItemStyle}>Search</span>,
      key: "search",
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
      key: SIDEBAR_ROUTES[0].toLowerCase(),
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
      key: SIDEBAR_ROUTES[1].toLowerCase(),
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
      key: SIDEBAR_ROUTES[2].toLowerCase(),
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
      key: SIDEBAR_ROUTES[3].toLowerCase(),
    },
  ];

  const dynamicMenuItems: MenuProps["items"] = useMemo(() => {
    if (!projs?.result?.length) return [];

    return projs?.result.map((project) => ({
      key: project.id,
      icon: <ArchiveIcon size={22} />,
      label: (
        <ToolTip title={project.title}>
          <span style={menuItemStyle}>{project.alias}</span>
        </ToolTip>
      ),
      children: [
        {
          key: `${project.id}-overview`,
          label: (
            <NavLink style={menuItemStyle} to={"/projects/" + project.id}>
              Overview
            </NavLink>
          ),
          icon: <DashboardIcon size={20} />,
        },
        {
          key: `${project.id}-tasks`,
          label: (
            <NavLink
              style={menuItemStyle}
              to={"/projects/" + project.id + "/tasks"}
            >
              Tasks
            </NavLink>
          ),
          icon: <TaskIcon size={20} />,
        },
        {
          key: `${project.id}-team`,
          label: (
            <NavLink
              style={menuItemStyle}
              to={"/projects/" + project.id + "/team"}
            >
              Team
            </NavLink>
          ),
          icon: <UsersIcon size={20} />,
        },
      ],
    }));
  }, [projs]);

  return (
    <>
      <SidebarHeader />
      <Menu
        mode="inline"
        style={{ marginTop: "80px", background: "none" }}
        items={menuItems}
        selectedKeys={staticSelectedKey}
        onSelect={onStaticSelect}
      />

      <Menu
        mode="inline"
        style={{ marginTop: "40px", background: "none" }}
        items={dynamicMenuItems}
        openKeys={openKeys}
        selectedKeys={dynamicSelectedKey}
        onOpenChange={onOpenChange}
        onSelect={onDynamicSelect}
      />
    </>
  );
};

export default EmployeeSidebar;
