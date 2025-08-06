import { Layout } from "antd";
import { useEffect, type FC, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Header from "~/components/header";
import AdminSidebar from "~/components/sidebar/admin-sidebar";
import EmployeeSidebar from "~/components/sidebar/employee-sidebar";
import Spinner from "~/components/ui/spinner";
import { useProfileQuery, useProjectsQuery } from "~/lib/server/services";
import type { AppDispatch } from "~/lib/store/store";
import { setToken, setUser } from "~/lib/store/userSlice";
import NoProject from "~/pages/no-project";

const { Content, Sider } = Layout;

interface ProjectCheckerProps {
  children: ReactNode;
  role: UserRole | undefined;
}

/**
 * This component renders main-layout section
 * @returns {ReactNode} The MainLayout component
 */
const MainLayout = (): ReactNode => {
  // Fetch the profile and access token from the server
  const { data, isPending } = useProfileQuery();

  const dispatch: AppDispatch = useDispatch();

  // Set the user and token in the store
  useEffect(() => {
    if (isPending || !data?.result) {
      return;
    }
    dispatch(setUser(data?.result?.user));
    dispatch(setToken(data?.result?.accessToken));
  }, [data?.result, isPending]);

  const role = data?.result?.user.role;

  return (
    <Spinner isActive={isPending} fullscreen>
      {/* If the user is not logged in, redirect to the login page */}
      {!isPending && data?.result === null ? (
        <Navigate to="/" />
      ) : (
        <ProjectsChecker role={role}>
          <Layout style={{ height: "100vh" }}>
            <Sider
              width={250}
              style={{
                background: "var(--primary-light-color)",
                padding: "20px 15px",
              }}
            >
              {role === "admin" ? <AdminSidebar /> : <EmployeeSidebar />}
            </Sider>
            <Layout>
              <Header />
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </ProjectsChecker>
      )}
    </Spinner>
  );
};

/**
 * This component renders main-layout section
 * @returns {ReactNode} The MainLayout component
 */
const ProjectsChecker: FC<ProjectCheckerProps> = ({ children, role }) => {
  const { data, isPending } = useProjectsQuery();

  return (
    <Spinner isActive={isPending} fullscreen>
      {role !== "admin" && data?.result?.length === 0 ? (
        <Layout style={{ height: "100vh" }}>
          <NoProject />
        </Layout>
      ) : (
        children
      )}
    </Spinner>
  );
};

export default MainLayout;
