type UserRole = "admin" | "employee" | "teamLead";

interface User {
  id: string;
  name: string;
  displayPic?: string;
  email: string;
  role: UserRole;
  createdBy: Creation;
}

interface Assignee {
  id: string;
  name: string;
}

interface UserRequest extends Omit<User, "createdBy", "id", "displayPic"> {}

interface AdminUpdate {
  name: string;
  email: string;
  role: UserRole;
  displayPic?: string;
  password?: string;
}

interface PasswordChangeRequest {
  oldPassword?: string;
  newPassword?: string;
}

interface UserUpdateRequest
  extends Omit<User, "createdBy", "id", "email", "role"> {}

interface RecentUserActivity extends Omit<User, "createdBy"> {
  lastActive: string;
  count: number;
}

interface RoleBasedUserCount {
  adminCount: number;
  employeeCount: number;
  tlCount: number;
  totalCount: number;
}
