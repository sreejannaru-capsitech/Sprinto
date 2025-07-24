interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "teamLead";
  createdBy: Creation;
}
