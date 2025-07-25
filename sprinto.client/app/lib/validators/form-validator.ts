import type { Rule } from "antd/es/form";

export const getRequiredStringRule = (fieldLabel: string): Rule => ({
  type: "string",
  required: true,
  message: `Please enter ${fieldLabel}`,
});

export const getRequiredSelectRule = (fieldLabel: string): Rule => ({
  required: true,
  message: `Please select ${fieldLabel}`,
});

export const getRequiredEmailRule = (): Rule => ({
  type: "email",
  required: true,
  message: `Please enter user email`,
});

export const getRequiredPasswordRule = (): Rule[] => [
  {
    type: "string",
    required: true,
    message: `Please enter password`,
  },
  {
    validator(_, value) {
      if (!value) return Promise.resolve();
      const trimmed = value?.trim();
      if (!trimmed) {
        return Promise.reject(new Error("Password cannot be just whitespace"));
      }
      if (trimmed.length < 6) {
        return Promise.reject(
          new Error("Password should be at least 6 characters long")
        );
      }
      return Promise.resolve();
    },
  },
];

export const getNonWhitespaceValidator = (
  fieldLabel: string,
  minLength = 3
): Rule => ({
  validator(_, value) {
    if (!value) return Promise.resolve();

    const trimmed = value.trim();
    if (!trimmed) {
      return Promise.reject(
        new Error(`${fieldLabel} cannot be just whitespace`)
      );
    }
    if (trimmed.length < minLength) {
      return Promise.reject(
        new Error(
          `${fieldLabel} should be at least ${minLength} characters long`
        )
      );
    }
    return Promise.resolve();
  },
});
