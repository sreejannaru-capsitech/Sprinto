import { Breadcrumb, Button, Flex, Layout, Space } from "antd";
import { useMemo, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";
import LeftArrow from "~/lib/icons/left-arrow.icon";
import type { RootState } from "~/lib/store";
import { capitalizeFirst } from "~/lib/utils";

import "~/styles/sidebar.css";
import CustomTag from "./ui/custom-tag";

interface Crumb {
  Title: string;
  Path: string;
}

/**
 * This component renders header section
 * @returns {ReactNode} The Header component
 */
const Header = (): ReactNode => {
  const user = useSelector((state: RootState) => state.user.user) as User;
  const proj = useSelector((state: RootState) => state.project.project);
  const task = useSelector((state: RootState) => state.task.task);

  const crumbs = useMemo(() => {
    const path = window.location.pathname.split("/");
    let crumbs: Crumb[] = [];

    crumbs.push({
      Title: "Home",
      Path: "/",
    });

    let pathLink = "";

    if (path.length >= 2) {
      pathLink += "/" + path[1];
      crumbs.push({
        Title: capitalizeFirst(path[1]),
        Path: pathLink,
      });
    }

    if (path.length >= 3) {
      if (proj) {
        pathLink += "/" + proj.id;
        crumbs.push({
          Title: proj.alias,
          Path: pathLink,
        });
      }
    }

    if (path.length >= 4) {
      pathLink += "/" + path[3];
      crumbs.push({
        Title: capitalizeFirst(path[3]),
        Path: pathLink,
      });
    }

    if (path.length === 5) {
      if (task) {
        pathLink += "/" + task.id;
        crumbs.push({
          Title: task.sequence.toString(),
          Path: pathLink,
        });
      }
    }

    return crumbs;
  }, [window.location.pathname, proj, task]);

  const goBack = () => {
    window.history.back();
  };

  return (
    <Layout.Header>
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
        size={24}
      >
        <Flex align="center" gap={18}>
          <Button
            onClick={goBack}
            type="text"
            className="header-button"
            icon={<LeftArrow />}
          />
          <Breadcrumb
            items={crumbs.map((crumb) => ({
              title: <NavLink to={crumb.Path}>{crumb.Title}</NavLink>,
            }))}
          />
        </Flex>
        <CustomTag large role={user.role} />
      </Space>
    </Layout.Header>
  );
};

export default Header;
