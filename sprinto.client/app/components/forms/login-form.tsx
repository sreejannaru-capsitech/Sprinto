import { Button, Form, Input, type FormProps } from "antd";
import { useState, type ReactNode } from "react";

import { isAxiosError } from "axios";
import { useAntNotification } from "~/hooks";
import { login } from "~/lib/server";
import "~/styles/home.css";
import {
  getRequiredEmailRule,
  getRequiredPasswordRule,
} from "~/lib/validators";

interface FieldType {
  email?: string;
  password?: string;
}

/**
 * This component renders login-form section
 * @returns {ReactNode} The LoginForm component
 */
const LoginForm = (): ReactNode => {
  const { _api, contextHolder } = useAntNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      const res = await login(values.email!, values.password!);
      if (!res.status) {
        _api({ message: res.message, type: "error" });
      } else {
        window.location.reload();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        _api({
          type: "error",
          message: error.cause?.message ?? error.message,
        });
      } else {
        _api({
          type: "error",
          message: "Could not Sign In",
        });
      }
    } finally {
      setLoading(false);
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
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[getRequiredEmailRule()]}
      >
        <Input placeholder="name@example.com" />
      </Form.Item>

      {/* Password */}
      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={getRequiredPasswordRule()}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      {/* Submit */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
