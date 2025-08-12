import { Menu, type MenuProps } from "antd";
import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  UsersIcon,
} from "~/lib/icons";
import SidebarHeader from "./sidebar-header";

import "~/styles/sidebar.css";
import { menuItemStyle } from ".";
import ProjectForm from "../forms/project-form";
import UserForm from "../forms/user-form";
import SearchForm from "../forms/search-form";
import TaskForm from "../forms/task-form";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store";

/**
 * This component renders admin-sidebar section
 * @returns {ReactNode} The AdminSidebar component
 */
const AdminSidebar = (): ReactNode => {
  const proj = useSelector((state: RootState) => state.project.project);

  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  useEffect(() => {
    const path = window.location.pathname.split("/");

    if (path.length === 2) {
      console.log(path[1]);
      setSelectedKey([path[1]]);
    }
    // else if (path.length === 3) {
    //   setSelectedKey([path[1]]);
    // }
    else if (path.length > 3) {
      setSelectedKey([path[3]]);
    }
  }, [window.location.pathname]);

  const onKeySelect: MenuProps["onSelect"] = ({ key }) => {
    setSelectedKey([key]);
  };

  const isInsideProject = useMemo(() => {
    const path = window.location.pathname.split("/");
    return path.length >= 3 && path[1] === "projects";
  }, [window.location.pathname]);

  const upperMenuItems: MenuProps["items"] = [
    {
      icon: <SearchIcon size={22} />,
      label: <span style={menuItemStyle}>Search</span>,
      onClick: () => setSearchFormOpen(true),
      key: "search",
    },
    {
      icon: <CalenderIcon size={22} />,
      label: (
        <NavLink to={"/" + ADMIN_ROUTES[0].toLowerCase()} style={menuItemStyle}>
          {ADMIN_ROUTES[0]}
        </NavLink>
      ),
      key: ADMIN_ROUTES[0].toLowerCase(),
    },
    {
      icon: <PlusIcon size={22} />,
      popupClassName: "menu-popup",
      label: <span style={menuItemStyle}>Create</span>,
      children: [
        {
          icon: <UserIcon size={22} />,
          label: <span style={menuItemStyle}>User</span>,
          onClick: () => setUserOpen(true),
          key: "1.1",
        },
        {
          icon: <ProjectIcon size={22} />,
          label: <span style={menuItemStyle}>Project</span>,
          onClick: () => setProjectOpen(true),
          key: "1.2",
        },
        {
          icon: <TaskIcon size={22} />,
          label: <span style={menuItemStyle}>Task</span>,
          onClick: () => setTaskformOpen(true),
          key: "1.3",
        },
      ],
      key: "2",
    },
  ];

  const lowerMenuItems: MenuProps["items"] = [
    {
      icon: <ProjectIcon size={22} />,
      label: (
        <NavLink to={"/" + ADMIN_ROUTES[1].toLowerCase()} style={menuItemStyle}>
          {isInsideProject
            ? ADMIN_ROUTES[1] + " | " + proj?.alias
            : ADMIN_ROUTES[1]}
        </NavLink>
      ),

      key: ADMIN_ROUTES[1].toLowerCase(),
    },
    {
      icon: <TaskIcon size={22} />,
      label: (
        <NavLink to={"/" + ADMIN_ROUTES[2].toLowerCase()} style={menuItemStyle}>
          {ADMIN_ROUTES[2]}
        </NavLink>
      ),
      key: ADMIN_ROUTES[2].toLowerCase(),
    },
    {
      icon: <UsersIcon size={22} />,
      label: (
        <NavLink to={"/" + ADMIN_ROUTES[3].toLowerCase()} style={menuItemStyle}>
          {ADMIN_ROUTES[3]}
        </NavLink>
      ),
      key: ADMIN_ROUTES[3].toLowerCase(),
    },
    {
      icon: <TeamLeadIcon size={22} />,
      label: (
        <NavLink to={"/" + ADMIN_ROUTES[4].toLowerCase()} style={menuItemStyle}>
          Team Leaders
        </NavLink>
      ),
      key: ADMIN_ROUTES[4].toLowerCase(),
    },
    {
      icon: <AdminIcon size={22} />,
      label: (
        <NavLink to={"/" + ADMIN_ROUTES[5].toLowerCase()} style={menuItemStyle}>
          {ADMIN_ROUTES[5]}
        </NavLink>
      ),
      key: ADMIN_ROUTES[5].toLowerCase(),
    },
  ];

  const [userOpen, setUserOpen] = useState<boolean>(false);
  const [projectOpen, setProjectOpen] = useState<boolean>(false);
  const [searchFormOpen, setSearchFormOpen] = useState<boolean>(false);
  const [taskformOpen, setTaskformOpen] = useState<boolean>(false);

  return (
    <>
      <SidebarHeader />
      <SearchForm
        open={searchFormOpen}
        onClose={() => setSearchFormOpen(false)}
      />
      <Menu
        mode="vertical"
        style={{ marginTop: "80px", background: "none" }}
        items={upperMenuItems}
        selectedKeys={selectedKey}
        onSelect={onKeySelect}
      />

      <ProjectForm
        open={projectOpen}
        onClose={() => setProjectOpen(false)}
        isNew
      />
      <UserForm open={userOpen} onClose={() => setUserOpen(false)} />

      <TaskForm
        open={taskformOpen}
        onClose={() => setTaskformOpen(false)}
        isNew
      />

      <Menu
        mode="inline"
        style={{ marginTop: "80px", background: "none" }}
        items={lowerMenuItems}
        selectedKeys={selectedKey}
        onSelect={onKeySelect}
      />
    </>
  );
};

export default AdminSidebar;
