import { Avatar, Card, Flex } from "antd";
import dayjs from "dayjs";
import type { FC, ReactNode } from "react";
import { getInitials } from "~/lib/utils";

interface CommentItemProps {
  item: Comment;
}

/**
 * This component renders comment-item section
 * @param {CommentItemProps} props
 * @returns {ReactNode} The CommentItem component
 */
const CommentItem: FC<CommentItemProps> = ({
  item,
}: CommentItemProps): ReactNode => {
  return (
    <Flex align="flex-start" gap={8}>
      <Avatar>{getInitials(item.createdBy.userName)}</Avatar>
      <div className="comment-card">
        <p className="text-primary-dark no-margin smaller-text">
          {item.createdBy.userName}
        </p>
        <p className="no-margin">{item.content}</p>
      </div>
      <Flex align="center" gap={4}>
        <p className="text-primary-dark no-margin smaller-text">
          {dayjs(item.createdBy.time).format("hh:mm A - Do MMM")}
        </p>
      </Flex>
    </Flex>
  );
};

export default CommentItem;
