import { Button, Form, Input, notification, type FormProps } from "antd";
import type { ReactNode } from "react";

import { isAxiosError } from "axios";
import { login } from "~/lib/server";
import "~/styles/home.css";

interface FieldType {
  email?: string;
  password?: string;
}

/**
 * This component renders login-form section
 * @returns {ReactNode} The LoginForm component
 */
const LoginForm = (): ReactNode => {
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
        api.error({
          message: "Could not Sign In",
          placement: "bottom",
          pauseOnHover: true,
        });
      }
    }
  };

  return (
    <Form
      layout="vertical"
      requiredMark="optional"
      size="large"
      onFinish={onFinish}
    >
      {contextHolder}
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
  );
};

export default LoginForm;
