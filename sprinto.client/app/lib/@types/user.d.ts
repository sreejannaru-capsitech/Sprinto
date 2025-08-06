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

interface UserRequest {
  name: string;
  email: string;
  role: UserRole;
}

interface PasswordChangeRequest {
  oldPassword?: string;
  newPassword?: string;
}

interface UserUpdateRequest {
  name: string;
  displayPic?: string;
}
