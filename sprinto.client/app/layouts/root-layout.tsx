import { Spin } from "antd";
import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useProfileQuery } from "~/lib/server/services";

/**
 * This component renders home-layout section
 * @returns {ReactNode} The RootLayout component
 */
const RootLayout = (): ReactNode => {
  // Fetch the profile and access token from the server
  const { data, isPending } = useProfileQuery();

  if (isPending) {
    return <Spin fullscreen />;
  }

  // If the user is not logged in, show the login page
  if (data?.result === null) {
    return <Outlet />;
  }

  // Else redirect to the appropriate route based on the user's role
  if (data?.result?.user.role === "admin") {
    return <Navigate to="/projects" />;
  } else {
    return <Navigate to="/today" />;
  }
};

export default RootLayout;
