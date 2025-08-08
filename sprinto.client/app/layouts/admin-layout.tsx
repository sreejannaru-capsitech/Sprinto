import { useEffect, type ReactNode } from "react";
import { Outlet } from "react-router";
import Spinner from "~/components/ui/spinner";
import { USER_ADMIN } from "~/lib/const";
import { useProfileQuery } from "~/lib/server/services";
import NotFoundPage from "~/routes/not-found";
import MainLayout from "./main-layout";

/**
 * This component renders admin-layout section
 * @returns {ReactNode} The AdminLayout component
 */
const AdminLayout = (): ReactNode => {
  // Fetch the profile and access token from the server
  const { data, isPending } = useProfileQuery();

  useEffect(() => {
    if (isPending || !data?.result) {
      return;
    }

    console.log(data.result.user);
  }, [data?.result, isPending]);

  return (
    <Spinner isActive={isPending} fullscreen>
      {data?.result?.user.role === USER_ADMIN ? (
        <MainLayout role={data?.result?.user.role}>
          <Outlet />
        </MainLayout>
      ) : (
        <NotFoundPage />
      )}
    </Spinner>
  );
};

export default AdminLayout;
