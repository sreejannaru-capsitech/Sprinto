import { Layout } from "antd";
import type { FC, ReactNode } from "react";
import Header from "~/components/header";
import AdminSidebar from "~/components/sidebar/admin-sidebar";
import EmployeeSidebar from "~/components/sidebar/employee-sidebar";
import Spinner from "~/components/ui/spinner";
import { USER_ADMIN } from "~/lib/const";
import { useProjectsQuery } from "~/lib/server/services";
import NoProject from "~/pages/no-project";

const { Content, Sider } = Layout;

interface MainLayoutProps {
  role: UserRole;
  children: ReactNode;
}

interface ProjectCheckerProps {
  children: ReactNode;
  role: UserRole | undefined;
}

/**
 * This component renders main-layout section
 * @returns {ReactNode} The ProtectedLayout component
 */
const ProjectsChecker: FC<ProjectCheckerProps> = ({ children, role }) => {
  const { data, isPending } = useProjectsQuery();

  return (
    <Spinner isActive={isPending} fullscreen>
      {role !== USER_ADMIN && data?.result?.length === 0 ? (
        <Layout style={{ height: "100vh" }}>
          <NoProject />
        </Layout>
      ) : (
        children
      )}
    </Spinner>
  );
};

/**
 * This component renders main-layout section
 * @param {MainLayoutProps} props
 * @returns {ReactNode} The MainLayout component
 */
const MainLayout: FC<MainLayoutProps> = ({
  role,
  children,
}: MainLayoutProps): ReactNode => {
  return (
    <ProjectsChecker role={role}>
      <Layout style={{ height: "100vh" }}>
        <Sider
          width={250}
          style={{
            background: "var(--primary-light-color)",
            padding: "20px 15px",
          }}
        >
          {role === USER_ADMIN ? <AdminSidebar /> : <EmployeeSidebar />}
        </Sider>
        <Layout>
          <Header />
          <Content style={{ display: "flex", flexDirection: "column" }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ProjectsChecker>
  );
};

export default MainLayout;
