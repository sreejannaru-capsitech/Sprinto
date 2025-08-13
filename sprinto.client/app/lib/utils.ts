import type { GetProp, UploadProps } from "antd";
import { AxiosError } from "axios";
import type { NotificationApi } from "~/hooks/useAntNotification";

/**
 * This function returns the initials of a user's full name
 * @param {string} fullName The full name of the user
 * @returns {string} The initials of the user's full name
 */
export const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) return "";

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
};

/**
 * Generates a random 3-letter alias from a name string.
 *
 * @param name - Full name string to extract alias from.
 * @returns A string of 3 uppercase letters randomly selected from the name.
 *
 * @example
 * getAliasFromTitle("ecommerce") → "EMC"
 * getAliasFromTitle("play ball") → "LPB"
 * getAliasFromTitle("rice bubble gum") → "GRB"
 */
export const getAliasFromTitle = (name: string): string => {
  const cleaned = name.replace(/\s+/g, "").toUpperCase();

  if (!cleaned) return "";

  const chars = cleaned.split("");

  const alias = new Set<string>();
  while (alias.size < 3 && chars.length > 0) {
    const index = Math.floor(Math.random() * chars.length);
    alias.add(chars[index]);
    chars.splice(index, 1); // remove to avoid duplicates
  }

  return [...alias].join("");
};

/**
 * This function handles API errors and displays appropriate messages
 * @param {Error} error The error object
 * @param {NotificationApi} _api The notification API
 * @param {string} message The message to display
 */
export const handleApiError = (
  error: Error,
  _api: NotificationApi,
  message: string
) => {
  if (error instanceof AxiosError) {
    _api({ message: error.message, type: "error" });
  } else {
    _api({ message: message, type: "error" });
  }
};

/**
 * Truncates a given string to a specified length, adding "..." if truncated.
 *
 * @param text - The input string to truncate.
 * @param limit - The maximum number of characters allowed before truncation.
 * @returns The original string if it's within the limit, or a truncated string with "..." appended.
 *
 * @example
 * truncateText("Hello World", 5); // "Hello..."
 * truncateText("Hi", 10);         // "Hi"
 */
export const truncateText = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + "...";
};

/**
 * This function checks if a given string is a valid MongoDB ObjectId.
 * @param {string} id The string to check.
 * @returns {boolean} True if the string is a valid MongoDB ObjectId, false otherwise.
 */
export const isValidMongoId = (id: string | undefined): boolean => {
  if (typeof id !== "string") return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
};

/**
 * This function converts user objects to SelectOption objects.
 * @param {User[]} users - An array of user objects.
 * @returns {SelectOptions[]} An array of SelectOption objects representing the users.
 */
export const getOptionsFromUsers = (
  users: User[],
  exclude: Assignee[]
): SelectOptions[] => {
  var excludeIds = exclude.map((a) => a.id);
  return users
    .filter((user) => !excludeIds?.includes(user.id))
    .map((user) => ({
      label: user.name,
      value: user.id,
    }));
};

export const getOptionsFromTeam = (users: User[]): SelectOptions[] => {
  return users.map((user) => ({
    label: user.name,
    value: user.id,
  }));
};

/**
 * This function capitalizes the first letter of a given string.
 * @param {string} word - The input string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirst = (word: string): string => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

/**
 * This function converts a file to a base64 string.
 * @param {FileType} file - The file to convert.
 * @returns {Promise<string>} A promise that resolves to the base64 string.
 */
export const convertToBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
