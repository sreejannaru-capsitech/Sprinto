import { Button, Flex } from "antd";
import { isAxiosError } from "axios";
import { useState, type ReactNode } from "react";
import { useAntNotification } from "~/hooks";
import CenteredLayout from "~/layouts/centered-layout";
import { AlertIcon } from "~/lib/icons";
import { logOut } from "~/lib/server";

/**
 * This component renders no-project section
 * @returns {ReactNode} The NoProject component
 */
const NoProject = (): ReactNode => {
  const { _api, contextHolder } = useAntNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await logOut();
      if (!res.status) {
        _api({ message: "Failed to log out", type: "error" });
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (isAxiosError(error)) {
        _api({
          message: error.cause?.message ?? error.message,
          type: "error",
        });
      } else {
        _api({ message: "Failed to log out", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredLayout>
      {contextHolder}
      <div style={{ textAlign: "center" }}>
        <AlertIcon size={64} />
        <p
          className="font-bold text-primary-dark"
          style={{
            fontSize: "1.4rem",
            marginBlockStart: "1rem",
            marginBlockEnd: "0.6rem",
          }}
        >
          You are not assigned to any project
        </p>
        <p
          className="text-primary-dark"
          style={{
            fontSize: "1rem",
            marginBlockStart: "0.2rem",
          }}
        >
          Contact your team lead or admin
        </p>
        <Flex gap={4} justify="center">
          <Button type="primary" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Button onClick={handleLogout} loading={loading}>
            Log out
          </Button>
        </Flex>
      </div>
    </CenteredLayout>
  );
};

export default NoProject;
