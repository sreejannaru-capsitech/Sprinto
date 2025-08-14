import { Card, Flex } from "antd";
import dayjs from "dayjs";
import type { FC, ReactNode } from "react";
import AvatarPic from "./avatar-pic";
import CustomTag from "./custom-tag";
import CustomTooltip from "./tooltip";

interface RecentUserActivityProps {
  item: RecentUserActivity;
}

/**
 * This component renders user-recent-activity section
 * @param {RecentUserActivityProps} props
 * @returns {ReactNode} The RecentUserActivity component
 */
const RecentUserActivity: FC<RecentUserActivityProps> = ({
  item,
}: RecentUserActivityProps): ReactNode => {
  return (
    <Card size="small" style={{ width: "100%" }}>
      <Flex align="center" justify="space-between" gap={10}>
        <AvatarPic size={26} user={item} />
        <span>{item.name}</span>
        <CustomTooltip title={item.email}>
          <span className="text-primary-dark">email</span>
        </CustomTooltip>
        <CustomTag role={item.role} />

        <div>
          <span className="text-primary-dark">Last :</span>
          <span>{dayjs(item.lastActive).format("hh:mm A Do MMM")}</span>
        </div>
        <div>
          <span className="text-primary-dark">Count :</span>
          <span>{item.count}</span>
        </div>
      </Flex>
    </Card>
  );
};

export default RecentUserActivity;
