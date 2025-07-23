# Sprinto

A task management system that allows users to create, edit, and delete tasks. The system will have 3 User roles: Admin, TL (Team Leader), and Employee.

## Roles

### Admin Roles

1. Creates new user with their assigned roles. ("admin" | "teamLead" | "employee").

2. Can perform CRUD on [ projects | users | tasks ]

3. Can view stats of projects, tasks, and users

### Team Lead Roles

1. Can assign or remove employees from project

2. Can Review and manage Project activities and Tasks

3. Can make comments on tasks and write/manage reports of projects

4. Can view stats of projects and tasks

### Employee Roles

1. Can view project details and activities

2. Can perform CRUD on Tasks and make comments.

3. Can view stats of their assigned tasks

## Tech Stack 

### Frontend

- React 19
- Ant Design
- TypeScript

### Backend

- ASP.NET Core Web API v9
- MongoDB

## Database Collections Refer - [DBDiagram](https://dbdiagram.io/d/Task-Management-System-687e0a48f413ba3508daba11)

### Users Collection

```json
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  role: string,
  created: {
    user_id: ObjectId,
    name: string,
    time: ISODate
  }
}
```

### Projects Collection

```json
{
  _id: ObjectId,
  title: String,
  alias: string,
  description: String,
  deadline: ISODate,
  is_completed: boolean,
  maintainer_id: ObjectId,       // Reference to users._id
  assignees: [ObjectId],        // Array of user IDs
  created: {
    user_id: ObjectId,
    name: string,
    time: ISODate
  }
}
```

### Task Status Collection

```json
{
    _id: ObjectId,
    title: string,              // enum ( "todo" | "in_progress" | "done" )
    is_status: boolean,         // indicates wheather it is a status or priority
    created: {
        user_id: ObjectId,
        name: string,
        time: ISODate
    }
}
```

### Tasks Collection

```json
{
  _id: ObjectId,
  title: String,
  seq: number,
  description: String,
  project_id: ObjectId,         // Reference to projects._id
  assignees: [ObjectId],        // Array of users._id
  dueDate: ISODate,
  status: string,             // Selected from status list
  priority: string,           // Selected from priority list
  comments: [
    {
        _id: ObjectId,
        content: String,
        is_edited: Boolean,
        created: {
            user_id: ObjectId,
            name: string,
            time: ISODate
        },
    },
    ...
  ],
  activities: [
    {
        _id: ObjectId,
        activity: string,             // enum ( "created" | "updated" | "deleted" )
        prev_value: string,
        current_value: string,
        task_id: ObjectId,            // Reference to tasks._id
        user_id: ObjectId,            // Reference to users._id
        project_id: ObjectId,         // Reference to projects._id
        created: {
            user_id: ObjectId,
            name: string,
            time: ISODate
        }
    },
    ...
  ]
  created: {
    user_id: ObjectId,
    name: string,
    time: ISODate
  }
}
```


## Logic Flow

```txt
           User Logs In
                |
                v
       Fetches User Details
                |
                v
    Frontend renders dashboard
     according to user's role
```

## Admin Dashboard features

- Stats of projects, tasks, and users

    - Total number
    - Dues, completed, and on hold
    - Assigned, completed, and on hold
    - Employees / Team Leads / Admins

- user table with sorting, filtering, pagination
    
    - data is sorted according newest to oldest
    - user details can be seen by clicking on the user
    - users can be modified

- project table with sorting, filtering, pagination

    - data is sorted according to time of update
    - project details and activities can be seen by clicking on the project
    - projects can be modified
    - new tasks can be created and assigned

- task table with sorting, filtering, pagination

    - data is sorted according to time of update
    - task details and comments can be seen by clicking on the task
    - tasks can be modified
    - new comments can be created

- button to create new user

    - user can be created with their assigned roles
    - they will be assigned default credentials

    ```json
        {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "password": "welcome",
            "is_admin": false,
            "is_teamLead": false,
            "is_accessed": false,
        }
    ```

- button to create new project

    - project can be created with assigned team lead and assignees
    - project can be assigned a deadline

    ```json
        {
            "title": "Project Title",
            "description": "Project Description",
            "deadline": ISODate,
            "status": "not_started",
            "team_lead_id": <ObjectId>,
            "assignees": [
                <ObjectId>,
                <ObjectId>
            ],
            "createdBy": <ObjectId>
        }
    ```

## Team Lead Dashboard features

- Can view stats of projects, tasks, and users

    - assignee complete status
    - tasks completion status
    - project status

- Can select a project from a table of projects

     - The table shows only projects which are assigned to the team lead
     - The project details and activities can be seen by clicking on the project

- Can add or remove Assignees of a project

- Can View and Modify Tasks of a project

     - Can create new tasks
     - Can assign tasks to employees
     - Can modify or delete tasks
     - Can make comments


## Employee Dashboard features

- Can view stats of their assigned tasks

     - Team member stats of tasks
     - tasks completion status

- Can select a project from a table of projects

     - The table shows only projects which are assigned to employee
     - The project details and activities can be seen by clicking on the project

- Can View and Modify Tasks of a project

     - Can create new tasks
     - Can only assign tasks to himself
     - Can modify or delete tasks created by himself
     - Can make comments / reports



---


## API Documentation

#### BASE_URL = http://<>/api/v1

### Projects

#### GET /projects

1. For Admin
    - Get all projects from the system

2. For Employee/TL
    - Get all projects he/she is assigned to

#### GET /projects/:id

   - Get Project details only if he is assigned to it ( Except for admin )

#### POST /projects/:id

   - Update a project ( admin only ) 

#### POST /projects

   - Create a new project ( admin only )

#### POST /projects/:id/delete

   - Delete a project ( admin only )