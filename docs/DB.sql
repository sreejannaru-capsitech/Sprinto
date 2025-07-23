Table users {
  id int [pk, increment]
  name string
  email string
  passwordHash string
  is_admin boolean
  is_teamLead boolean
  is_accessed boolean
  created_at datetime
}

Table projects {
  id int [pk, increment]
  title string
  description string
  task_count int
  deadline datetime
  status enum('not_started', 'in_progress', 'completed', 'on_hold')
  maintainer_id int [ref: > users.id]
  assignees int[] [ref: > users.id]
  created_by int [ref: > users.id]
  created_at datetime
}

Table tasks {
  id int [pk, increment]
  title string
  description string
  project_id int [ref: > projects.id]
  assignee_id int [ref: > users.id]
  created_by int [ref: > users.id]
  dueDate datetime
  status enum('todo', 'in_progress', 'completed')
  created_at datetime
}

Table activities {
  id int [pk, increment]
  type enum('activity', 'report')
  task_id int [ref: > tasks.id]
  user_id int [ref: > users.id]
  project_id int [ref: > projects.id]
  created_at datetime
}

Table comments {
  id int [pk, increment]
  content text
  user_id int [ref: > users.id]
  task_id int [ref: > tasks.id]
  is_edited boolean
  created_at datetime
}