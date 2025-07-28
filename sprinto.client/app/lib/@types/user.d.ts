type UserRole = "admin" | "employee" | "teamLead";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdBy: Creation;
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
