import { Card, Col, Flex, Row, Space, Typography } from "antd";
import type { ReactNode } from "react";
import type { Route } from "./+types/home";

import LoginForm from "~/components/forms/login-form";
import { LogoIcon } from "~/lib/icons";
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
            <LoginForm />
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default Home;
