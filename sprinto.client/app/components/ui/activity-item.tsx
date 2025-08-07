import { Card, Col, Flex, Row, Tag, Typography } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import type { FC, JSX, ReactNode } from "react";
import { NavLink } from "react-router";
import { truncateText } from "~/lib/utils";

import { DeleteIcon } from "~/lib/icons";
import "~/styles/items.css";
import AvatarPic from "./avatar-pic";

dayjs.extend(utc);
dayjs.extend(advancedFormat);

interface ActivityItemProps {
  item: TaskActivity;
}

/**
 * This component renders activity-item section
 * @param {ActivityItemProps} props
 * @returns {ReactNode} The ActivityItem component
 */
const ActivityItem: FC<ActivityItemProps> = ({
  item,
}: ActivityItemProps): ReactNode => {
  const getActivityText = (activity: Activity, name: string) => {
    var text = `${name} `;

    switch (activity.action) {
      case "TaskCreated":
        text += "created the task";
        break;
      case "TitleUpdated":
        text += "changed the title from";
        break;
      case "DescUpdated":
        text += "changed the description from";
        break;
      case "ProjectUpdated":
        text += "changed the project from";
        break;
      case "AssigneeAdded":
        text += "added";
        break;
      case "AssigneeRemoved":
        text += "removed";
        break;
      case "DuedateUpdated":
        text += "changed the due date from";
        break;
      case "StatusUpdated":
        text += "changed the status from";
        break;
      case "PriorityUpdated":
        text += "changed the priority from";
        break;
      case "TaskDeleted":
        text += "deleted the task";
        break;
      default:
        text += "Unknown";
        break;
    }

    return text;
  };

  const getValueText = (
    action: ActivityType,
    activity: Activity,
    isPrev: boolean
  ): string => {
    switch (action) {
      case "TitleUpdated":
        if (!activity.title) return "No title info";
        return isPrev
          ? truncateText(activity.title.previous, 20)
          : truncateText(activity.title.current, 20);

      case "DescUpdated":
        if (!activity.description) return "No description info";
        return isPrev
          ? activity.description.previous
            ? truncateText(activity.description.previous, 20)
            : "No description"
          : truncateText(activity.description.current, 20);

      case "ProjectUpdated":
        // Assuming project cannot be changed as per your logic
        return "Project can't be changed";

      case "AssigneeAdded":
        if (!activity.assignee) return "No assignee info";
        return isPrev
          ? activity.assignee.previous.map((a) => a.name).join(", ")
          : activity.assignee.current.map((a) => a.name).join(", ");

      case "AssigneeRemoved":
        if (!activity.assignee) return "No assignee info";
        // Assuming value here means the removed assignees
        // If your Activity doesn't store that, you might need to pass the removed assignees differently
        // For now, just list previous assignees (or adjust as per your logic)
        return activity.assignee.previous.map((a) => a.name).join(", ");

      case "DuedateUpdated":
        if (!activity.dueDate) return "No due date info";
        const dateStr = isPrev
          ? activity.dueDate.previous
          : activity.dueDate.current;
        return dateStr ? dayjs(dateStr).format("Do MMMM") : "No due date";

      case "StatusUpdated":
        if (!activity.status) return "No status info";
        return isPrev
          ? activity.status.previous.title
          : activity.status.current.title;

      case "PriorityUpdated":
        if (!activity.priority) return "No priority info";
        return isPrev ? activity.priority.previous : activity.priority.current;

      default:
        return "Unknown";
    }
  };

  const renderActivityValue = (activity: Activity): JSX.Element | null => {
    const { action } = activity;

    if (action === "TaskCreated" || action === "TaskDeleted") return null;

    if (action === "AssigneeAdded") {
      // Show current only
      return (
        <>
          <span className="value-container smaller-text">
            {getValueText(action, activity, false)}
          </span>
          <span>to assignee</span>
        </>
      );
    }

    if (action === "AssigneeRemoved") {
      // Show previous only
      return (
        <>
          <span className="value-container smaller-text">
            {getValueText(action, activity, true)}
          </span>
          <span>from assignee</span>
        </>
      );
    }

    // For other actions, show current and previous separated by 'to'
    return (
      <>
        <span className="value-container smaller-text">
          {getValueText(action, activity, true)}
        </span>
        <span> to </span>
        <span className="value-container smaller-text">
          {getValueText(action, activity, false)}
        </span>
      </>
    );
  };

  return (
    <Card size="small" className="activity-item" hoverable>
      <Row gutter={4} justify={"space-between"}>
        <Col span={2}>
          <AvatarPic user={item.activity.createdBy} />
        </Col>
        <Col span={21}>
          <Flex align="center" justify="space-between">
            <p style={{ marginBlock: 0 }}>{item.activity.createdBy.userName}</p>
            <NavLink
              to={
                item.activity.action === "TaskDeleted"
                  ? "#"
                  : `/projects/${item.projectId}/tasks/${item.taskId}`
              }
            >
              <Tag className="activity-task-tag">
                {item.activity.action === "TaskDeleted" && (
                  <DeleteIcon size={14} />
                )}
                {`${item.projectAlias}-${item.sequence}`}
              </Tag>
            </NavLink>
          </Flex>
          <Typography.Paragraph
            style={{ marginTop: 4, paddingRight: 2 }}
            className="text-primary smaller-text"
          >
            {getActivityText(item.activity, item.activity.createdBy.userName)}
            {renderActivityValue(item.activity)}
          </Typography.Paragraph>
          <div style={{ textAlign: "right" }}>
            <span className="smaller-text text-primary-dark">
              {dayjs(item.activity.createdBy.time).format(
                "hh:mm A - Do MMM YYYY"
              )}
            </span>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ActivityItem;
