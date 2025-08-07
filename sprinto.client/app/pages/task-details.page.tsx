import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router";
import TaskForm from "~/components/forms/task-form";
import TimeLineSection from "~/components/timeline-section";
import AvatarPic from "~/components/ui/avatar-pic";
import CommentItem from "~/components/ui/comment-item";
import Spinner from "~/components/ui/spinner";
import { useAntNotification } from "~/hooks";
import {
  AlertIcon,
  CalenderIcon,
  DeleteIcon,
  PencilIcon,
  PlusIcon,
  TickRoundedIcon,
} from "~/lib/icons";
import {
  useCommentsQuery,
  useCreateComment,
  useDeleteTask,
  useTaskActivitiesQuery,
  useUpdateComment,
} from "~/lib/server/services";
import { getRequiredStringRule } from "~/lib/validators";

import "~/styles/project-overview.css";

interface TaskDetailsPageProps {
  task: Task;
}

interface FormType {
  content: string;
}

/**
 * This component renders task-details.page section
 * @param {TaskDetailsPageProps} props
 * @returns {ReactNode} The TaskDetailsPage component
 */
const TaskDetailsPage: FC<TaskDetailsPageProps> = ({
  task,
}: TaskDetailsPageProps): ReactNode => {
  const { data: _act, isPending: _actPending } = useTaskActivitiesQuery(
    task.id
  );

  const navigate = useNavigate();

  const { _api, contextHolder } = useAntNotification();
  const [form] = Form.useForm<FormType>();

  const { data: _comments, isPending: _commentsPending } = useCommentsQuery(
    _api,
    task.id
  );

  const { mutateAsync: createComment } = useCreateComment(_api);
  const { mutateAsync: updateComment } = useUpdateComment(_api);
  const { mutateAsync: deleteTask } = useDeleteTask(_api);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Editing is used to identify the comment ID which is being edited
  const [editing, setEditing] = useState<string | undefined>(undefined);

  const dueDate = useMemo(() => {
    if (dayjs.utc(task.dueDate).isSame(dayjs.utc(), "day")) {
      return "Today";
    }
    return dayjs.utc(task.dueDate).format("Do MMMM");
  }, [task.dueDate]);

  // Manually converting the activities to the TaskActivity type
  const activities: TaskActivity[] = useMemo(() => {
    if (!_act?.result || _actPending) return [];
    return _act.result.map((a) => ({
      sequence: task.sequence,
      projectAlias: task.projectAlias,
      taskId: task.id,
      projectId: task.projectId,
      activity: a,
    }));
  }, [_act, _actPending]);

  const setEdit = (content: string, id: string) => {
    form.setFieldsValue({
      content,
    });
    setEditing(id);
  };

  const onSubmit = async (values: FormType) => {
    setLoading(true);
    try {
      if (editing)
        await updateComment({
          comment: {
            content: values.content,
          },
          taskId: task.id,
          commentId: editing,
        });
      else
        await createComment({
          comment: {
            content: values.content,
          },
          taskId: task.id,
        });
      form.resetFields();
    } catch (error) {
    } finally {
      setEditing(undefined);
      setLoading(false);
    }
  };

  const onDelete = async () => {
    await deleteTask(task.id);
    navigate("/inbox");
  };

  return (
    <Row gutter={50} wrap={false}>
      <Col flex={"auto"}>
        <Flex align="center" justify="space-between">
          {/* Title and Timing */}
          <Flex align="center" gap={20}>
            <Typography.Title level={2}>
              <span className="text-primary-dark">{task.projectAlias}</span>
              <span className="text-primary-dark"> — </span>
              {task.sequence}
            </Typography.Title>

            <Flex gap={4} align="center" justify="center">
              <Tag
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CalenderIcon size={16} />
                <span>{dueDate}</span>
              </Tag>
              <Tag className="capitalize">Priority — {task.priority}</Tag>
              <Tag className="capitalize">Status — {task.status.title}</Tag>
            </Flex>
          </Flex>

          {/* Task Assignees & Edit Button */}
          <Flex align="center" gap={20}>
            <Popconfirm
              title="Delete this task ?"
              icon={<AlertIcon size={18} />}
              onConfirm={onDelete}
            >
              <Button icon={<DeleteIcon size={20} />}>
                <span>Delete</span>
              </Button>
            </Popconfirm>
            <Button
              icon={<PencilIcon size={20} />}
              onClick={() => setModalOpen(true)}
            >
              <span>Edit</span>
            </Button>
            <TaskForm
              onClose={() => setModalOpen(false)}
              open={modalOpen}
              task={task}
            />
            <Flex align="center" gap={4}>
              <Avatar.Group
                max={{
                  count: 4,
                  style: { color: "black", backgroundColor: "white" },
                }}
              >
                {task.assignees.map((assignee) => (
                  <AvatarPic user={assignee} key={assignee.id} />
                ))}
              </Avatar.Group>
            </Flex>
          </Flex>
        </Flex>
        {contextHolder}

        <Typography.Title level={4} className="font-bold">
          {task.title}
        </Typography.Title>

        <div className="task-description">
          <Typography.Paragraph>{task.description}</Typography.Paragraph>
        </div>

        <Typography.Title level={4} className="font-bold">
          Comments
        </Typography.Title>

        <div className="comment-section">
          <Form
            requiredMark="optional"
            className="comment-form"
            onFinish={onSubmit}
            form={form}
          >
            <Flex align="flex-start" gap={10}>
              <Form.Item<FormType>
                name="content"
                rules={[getRequiredStringRule("comment")]}
                style={{ flex: 1, maxWidth: editing ? 530 : 570 }}
              >
                <Input.TextArea
                  rows={1}
                  placeholder="Add a comment..."
                  autoSize={{ minRows: 1, maxRows: 5 }}
                />
              </Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                loading={loading}
                icon={
                  editing ? (
                    <TickRoundedIcon size={20} />
                  ) : (
                    <PlusIcon size={20} />
                  )
                }
              >
                <span>{editing ? "Update" : "Add Comment"}</span>
              </Button>
              {/* Edit Cancel Button */}
              {editing && (
                <Button
                  onClick={() => {
                    setEditing(undefined);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              )}
            </Flex>
          </Form>

          <Spinner isActive={_commentsPending}>
            <Space direction="vertical" size={16} className="comment-container">
              {_comments?.result?.map((comment) => (
                <CommentItem
                  key={comment.id}
                  taskId={task.id}
                  item={comment}
                  setEdit={setEdit}
                />
              ))}
            </Space>
          </Spinner>
        </div>
      </Col>

      {/* Timeline Section */}
      <TimeLineSection activities={activities} isPending={_actPending} />
    </Row>
  );
};

export default TaskDetailsPage;
