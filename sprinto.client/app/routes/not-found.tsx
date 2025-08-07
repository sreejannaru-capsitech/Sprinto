import { Button, Flex, Layout, Typography } from "antd";
import type { ReactNode } from "react";
import type { MetaArgs } from "react-router";
import LogoComponent from "~/components/logo";

import "~/styles/home.css";

export function meta({}: MetaArgs) {
  return [
    { title: "404 Page Not Found — Sprinto" },
    { name: "description", content: "Page not found" },
  ];
}

/**
 * This component renders not-found section
 * @returns {ReactNode} The NotFoundPage component
 */
const NotFoundPage = (): ReactNode => {
  return (
    <Flex align="center" justify="center" gap={6} style={{ height: "100vh", }}>
      <Layout style={{ height: "100%", padding: 60 }}>
        <LogoComponent />

        <div className="not-found-container">
          <Typography.Title level={3} style={{ fontWeight: "normal" }}>
            Sorry!
          </Typography.Title>
          <Typography.Title level={2}>
            We can't seem to find the resource you're looking for.
          </Typography.Title>

          <Button
            variant="outlined"
            size="large"
            href="/"
            style={{ marginTop: 20 }}
          >
            Home Page
          </Button>
        </div>
      </Layout>
    </Flex>
  );
};

export default NotFoundPage;
