import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Layout, Space, Spin } from "antd";
import { type ReactNode } from "react";
import { Outlet } from "react-router";
import EmployeeSidebar from "~/components/employee-sidebar";
import { PROFILE_KEY } from "~/lib/const";
import { getMe } from "~/lib/server/auth.api";

const { Header, Content, Sider } = Layout;

/**
 * This component renders main-layout section
 * @returns {ReactNode} The MainLayout component
 */
const MainLayout = (): ReactNode => {
  // Fetch the profile and access token from the server
  const { isPending } = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getMe,
    staleTime: 55 * 60 * 1000, // 55 minutes
  });

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
        <EmployeeSidebar />
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
                }
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
