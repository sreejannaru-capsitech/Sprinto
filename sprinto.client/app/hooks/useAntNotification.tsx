import { notification } from "antd";
import { TickRoundedIcon, CloseRoundedIcon } from "~/lib/icons";
import type { NotificationPlacement } from "antd/es/notification/interface";
import type { ReactNode } from "react";

type NotificationOptions = {
  message: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error";
  placement?: NotificationPlacement;
  duration?: number;
};

export interface NotificationApi {
  (options: NotificationOptions): void;
}

export const useAntNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const getCustomIcon = (type: string): ReactNode | undefined => {
    switch (type) {
      case "success":
        return <TickRoundedIcon />;
      case "error":
        return <CloseRoundedIcon />;
      default:
        return undefined; // fallback to Ant Design's default
    }
  };

  const _api = ({
    message,
    description,
    type = "info",
    placement = "bottom",
    duration = 3,
  }: NotificationOptions) => {
    api[type]({
      message,
      description,
      placement,
      duration,
      icon: getCustomIcon(type),
    });
  };

  return { _api, contextHolder };
};
