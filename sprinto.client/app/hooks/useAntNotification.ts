import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

type NotificationOptions = {
  message: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error";
  placement?: NotificationPlacement;
  duration?: number;
};

export const useAntNotification = () => {
  const [api, contextHolder] = notification.useNotification();

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
    });
  };

  return { _api, contextHolder };
};
