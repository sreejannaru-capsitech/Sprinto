import { useEffect, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Spinner from "~/components/ui/spinner";
import { USER_EMPLOYEE } from "~/lib/const";
import { useProfileQuery } from "~/lib/server/services";
import { setToken, setUser, type AppDispatch } from "~/lib/store";
import MainLayout from "./main-layout";

/**
 * This component renders protected-layout
 * @returns {ReactNode} The ProtectedLayout component
 */
const ProtectedLayout = (): ReactNode => {
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

  return (
    <Spinner isActive={isPending} fullscreen>
      {/* If the user is not logged in, redirect to the login page */}
      {!isPending && data?.result === null ? (
        <Navigate to="/" />
      ) : (
        <MainLayout role={data?.result?.user.role ?? USER_EMPLOYEE}>
          <Outlet />
        </MainLayout>
      )}
    </Spinner>
  );
};

export default ProtectedLayout;
