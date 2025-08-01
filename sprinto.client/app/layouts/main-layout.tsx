import { Breadcrumb, Layout, Space, Spin, Tag } from "antd";
import { type ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import AdminSidebar from "~/components/sidebar/admin-sidebar";
import EmployeeSidebar from "~/components/sidebar/employee-sidebar";
import Spinner from "~/components/ui/spinner";
import { useProfileQuery, useProjectsQuery } from "~/lib/server/services";
import NoProject from "~/pages/no-project";

const { Header, Content, Sider } = Layout;

/**
 * This component renders main-layout section
 * @returns {ReactNode} The MainLayout component
 */
const MainLayout = (): ReactNode => {
  // Fetch the profile and access token from the server
  const { data, isPending } = useProfileQuery();
  const { data: projects, isPending: projsPending } = useProjectsQuery();

  const role = data?.result?.user.role;

  // If the user is not logged in, show the login page
  if (!isPending && data?.result === null) {
    return <Navigate to="/" />;
  }

  return (
    <Spinner isActive={isPending || projsPending} fullscreen>
      <Layout style={{ height: "100vh" }}>
        <Sider
          width={250}
          style={{
            background: "var(--primary-light-color)",
            padding: "20px 15px",
          }}
        >
          {data?.result?.user.role === "admin" ? (
            <AdminSidebar />
          ) : (
            <EmployeeSidebar />
          )}
        </Sider>
        <Layout>
          <Header>
            <Space
              align="center"
              style={{ width: "100%", justifyContent: "space-between" }}
              size={24}
            >
              <Breadcrumb
                items={[
                  {
                    title: "Home",
                  },
                  {
                    title: <a href="/today">Today</a>,
                  },
                ]}
              />
              <Tag className="capitalize">
                {role === "teamLead" ? "Team Lead" : role}
              </Tag>
            </Space>
          </Header>
          <Content style={{ display: "flex", flexDirection: "column" }}>
            {/* If the user is non-admin and has no projects, show no-project page */}
            {data?.result?.user.role !== "admin" &&
            projects?.result &&
            projects.result.length === 0 ? (
              <NoProject />
            ) : (
              <Outlet />
            )}
          </Content>
        </Layout>
      </Layout>
    </Spinner>
  );
};

export default MainLayout;
