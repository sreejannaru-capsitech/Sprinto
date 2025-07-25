import { Breadcrumb, Layout, Space, Spin } from "antd";
import { type ReactNode } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "~/components/sidebar/admin-sidebar";
import EmployeeSidebar from "~/components/sidebar/employee-sidebar";
import { useProfileQuery } from "~/lib/server/services";

const { Header, Content, Sider } = Layout;

/**
 * This component renders main-layout section
 * @returns {ReactNode} The MainLayout component
 */
const MainLayout = (): ReactNode => {
  // Fetch the profile and access token from the server
  const { data, isPending } = useProfileQuery();

  if (isPending) {
    return <Spin fullscreen />;
  }

  return (
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
          <Space align="center" size={24}>
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
          </Space>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
