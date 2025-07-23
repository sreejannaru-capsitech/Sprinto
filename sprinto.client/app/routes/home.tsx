import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import LogoIcon from "~/lib/icons/logo.icon";
import type { Route } from "./+types/home";
import type { ReactNode } from "react";

import "~/styles/home.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sprinto — Where ideas sprint to completion" },
    { name: "description", content: "Manage your tasks with Sprinto" },
  ];
}

/**
 * The home or welcome page of the application
 * This page is used to log in to the application
 * @returns {ReactNode} The Home component
 */
const Home = (): ReactNode => {
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
      <Card
        variant="borderless"
        className="card"
      >
        <Row gutter={48}>
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
            <Form layout="vertical" requiredMark="optional" size="large">
              {/* Username */}
              <Form.Item
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
              <Form.Item
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
