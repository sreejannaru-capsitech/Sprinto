import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  notification,
  Row,
  Space,
  Typography,
  type FormProps,
} from "antd";
import type { ReactNode } from "react";
import type { Route } from "./+types/home";

import { isAxiosError } from "axios";
import { LogoIcon } from "~/lib/icons";
import { login } from "~/lib/server";
import "~/styles/home.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sprinto — Where ideas sprint to completion" },
    { name: "description", content: "Manage your tasks with Sprinto" },
  ];
}

interface FieldType {
  email?: string;
  password?: string;
}

/**
 * The home or welcome page of the application
 * This page is used to log in to the application
 * @returns {ReactNode} The Home component
 */
const Home = (): ReactNode => {
  const [api, contextHolder] = notification.useNotification();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await login(values.email!, values.password!);
    } catch (error) {
      if (isAxiosError(error)) {
        api.error({
          message: error.cause?.message ?? error.message,
          placement: "bottom",
        });
      } else {
        api.error({ message: "Could not Sign In", placement: "bottom", pauseOnHover: true });
      }
    }
  };

  return (
    <Space
      direction="vertical"
      align="center"
      style={{
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        display: "flex",
      }}
    >
      {contextHolder}
      <Card variant="borderless" className="card">
        <Row gutter={82}>
          <Col span={12}>
            <Flex gap={6} align="center" className="logo-container">
              <LogoIcon size={58} />
              <Typography.Title level={1}>
                Sprin<span className="text-primary">t</span>o
              </Typography.Title>
            </Flex>
            <div className="logo-description">
              <Typography.Paragraph>
                Sprinto is your agile command center —
              </Typography.Paragraph>
              <Typography.Paragraph>
                manage tasks, track progress, and sprint toward success.
              </Typography.Paragraph>
            </div>
          </Col>

          {/* Form */}
          <Col span={12}>
            <Typography.Title level={4}>
              Continue with your account
            </Typography.Title>
            <Form
              layout="vertical"
              requiredMark="optional"
              size="large"
              onFinish={onFinish}
            >
              {/* Username */}
              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please input your email",
                  },
                ]}
              >
                <Input placeholder="name@example.com" />
              </Form.Item>

              {/* Password */}
              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              {/* Submit */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="submit-button"
                >
                  Sign in
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default Home;
