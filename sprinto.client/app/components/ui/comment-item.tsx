import { Button, Flex, Popconfirm } from "antd";
import dayjs from "dayjs";
import type { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useAntNotification } from "~/hooks";
import { AlertIcon, DeleteIcon, PencilIcon } from "~/lib/icons";
import { useDeleteComment } from "~/lib/server/services";
import type { RootState } from "~/lib/store";

import "~/styles/project-overview.css";
import AvatarPic from "./avatar-pic";

interface CommentItemProps {
  item: Comment;
  taskId: string;
  setEdit: (content: string, id: string) => void;
}

/**
 * This component renders comment-item section
 * @param {CommentItemProps} props
 * @returns {ReactNode} The CommentItem component
 */
const CommentItem: FC<CommentItemProps> = ({
  item,
  taskId,
  setEdit,
}: CommentItemProps): ReactNode => {
  const user = useSelector((state: RootState) => state.user.user);

  const { _api, contextHolder } = useAntNotification();

  const { mutateAsync: deleteComment } = useDeleteComment(_api);

  return (
    <Flex align="flex-start" gap={8}>
      {contextHolder}
      <AvatarPic user={item.createdBy} size={30} />
      <div className="comment-card">
        <Flex align="center" justify="space-between">
          <p className="text-primary-dark no-margin smaller-text">
            {item.createdBy.userName}
          </p>
          {user?.id === item.createdBy.userId ? (
            <Flex align="center" gap={4} className="comment-btns">
              <Button
                className="comment-edit-button"
                size="small"
                type="text"
                icon={<PencilIcon size={14} />}
                onClick={() => setEdit(item.content, item.id)}
              />
              <Popconfirm
                icon={<AlertIcon size={18} />}
                title="Delete this comment ?"
                onConfirm={async () =>
                  await deleteComment({ taskId, commentId: item.id })
                }
              >
                <Button
                  className="comment-edit-button"
                  size="small"
                  type="text"
                  icon={<DeleteIcon size={14} />}
                />
              </Popconfirm>
            </Flex>
          ) : null}
        </Flex>
        <p className="no-margin comment-content">{item.content}</p>
      </div>
      <div>
        <p className="text-primary-dark no-margin smaller-text">
          {dayjs(item.isEdited ? item.updatedAt : item.createdBy.time).format(
            "hh:mm A - Do MMM"
          )}
        </p>
        {item.isEdited ? (
          <p className="text-primary-dark no-margin smaller-text">(Edited)</p>
        ) : null}
      </div>
    </Flex>
  );
};

export default CommentItem;
