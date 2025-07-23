You're building a well-structured task management system. Given the constraints (GET and POST methods only) and the way your data is organized, here's how you can derive and populate the key insights you asked about.

---

## 🔹 Insight 1: **"Table for Top Active Projects"**

### 🎯 Definition:

Projects with the most recent and highest number of task activities (i.e., most task updates, comments, changes).

### ✅ Logic:

1. **Aggregate task activity counts** grouped by project.
2. Sort by count descending.
3. Return top N (e.g., 5 or 10).

### 🔧 MongoDB Aggregation Logic:

```javascript
db.tasks.aggregate([
  { $unwind: "$activities" },
  {
    $group: {
      _id: "$project_id",
      activityCount: { $sum: 1 }
    }
  },
  { $sort: { activityCount: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "projects",
      localField: "_id",
      foreignField: "_id",
      as: "project"
    }
  },
  { $unwind: "$project" },
  { $match: { "project.is_active": true } },
  {
    $project: {
      title: "$project.title",
      activityCount: 1,
      maintainer: "$project.maintainer_id",
      deadline: "$project.deadline"
    }
  }
])
```

---

## 🔹 Insight 2: **"Table for Projects at Risk (Active but No Activity)"**

### 🎯 Definition:

Active projects that have had **no task activities** in the last N days (e.g., 14 days).

### ✅ Logic:

1. Filter projects marked `is_active: true`.
2. Join with tasks and their activities.
3. Check if there are **no activities** in the recent N-day window.
4. List such projects.

### 🔧 MongoDB Aggregation:

```javascript
const N_DAYS_AGO = new Date(Date.now() - 1000 * 60 * 60 * 24 * 15); // 15 days ago

db.projects.aggregate([
  { $match: { is_active: true } },
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "project_id",
      as: "projectTasks"
    }
  },
  {
    $addFields: {
      recentActivity: {
        $filter: {
          input: {
            $reduce: {
              input: "$projectTasks.activities",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          },
          as: "activity",
          cond: { $gte: ["$$activity.created.time", N_DAYS_AGO] }
        }
      }
    }
  },
  { $match: { "recentActivity": { $size: 0 } } },
  { $project: { title: 1, deadline: 1, is_active: 1 } }
])
```

---

## 🔹 Insight 3: **"Most Active Team Leads"**

### 🎯 Definition:

Team leads who are assigned to the most active projects or contributed the most (via tasks/comments).

### ✅ Logic (Option A - based on project activity):

1. Count tasks created or activities performed by each team lead.
2. Rank by count.

### 🔧 MongoDB Aggregation:

```javascript
db.tasks.aggregate([
  {
    $unwind: "$activities"
  },
  {
    $lookup: {
      from: "users",
      localField: "activities.user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $match: { "user.role": "team_lead" } },
  {
    $group: {
      _id: "$user._id",
      name: { $first: "$user.name" },
      activityCount: { $sum: 1 }
    }
  },
  { $sort: { activityCount: -1 } },
  { $limit: 10 }
])
```

---

## 🔹 Insight 4: **"Last Activity Employees"**

### 🎯 Definition:

Employees sorted by their **last activity date** (e.g., task update or comment).

### ✅ Logic:

1. Flatten all `activities` and `comments`.
2. Get the most recent timestamp per employee.
3. Sort descending.

### 🔧 MongoDB Aggregation:

```javascript
db.tasks.aggregate([
  {
    $project: {
      allActivity: {
        $concatArrays: [
          "$activities",
          {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                user_id: "$$comment.created.user_id",
                name: "$$comment.created.name",
                time: "$$comment.created.time"
              }
            }
          }
        ]
      }
    }
  },
  { $unwind: "$allActivity" },
  {
    $lookup: {
      from: "users",
      localField: "allActivity.user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $match: { "user.role": "employee" } },
  {
    $group: {
      _id: "$user._id",
      name: { $first: "$user.name" },
      lastActive: { $max: "$allActivity.time" }
    }
  },
  { $sort: { lastActive: -1 } },
  { $limit: 10 }
])
```

---

## 🔹 Insight 5: **"Most Active Admins"**

### 🎯 Definition:

Admins who have created or modified the most number of projects or tasks.

### ✅ Logic:

1. Count total tasks and projects where `created.user_id` matches an admin ID.
2. Aggregate counts and sort.

### 🔧 MongoDB Aggregation:

```javascript
// From projects
const projectActivity = db.projects.aggregate([
  {
    $group: {
      _id: "$created.user_id",
      projectCreatedCount: { $sum: 1 }
    }
  }
]).toArray();

// From tasks
const taskActivity = db.tasks.aggregate([
  {
    $group: {
      _id: "$created.user_id",
      taskCreatedCount: { $sum: 1 }
    }
  }
]).toArray();

// Combine both in backend (Node.js or similar) to compute total activity per admin
```

Or combine using `$unionWith`:

```javascript
db.projects.aggregate([
  {
    $project: {
      user_id: "$created.user_id",
      count: { $literal: 1 }
    }
  },
  {
    $unionWith: {
      coll: "tasks",
      pipeline: [
        {
          $project: {
            user_id: "$created.user_id",
            count: { $literal: 1 }
          }
        }
      ]
    }
  },
  {
    $group: {
      _id: "$user_id",
      totalCreated: { $sum: "$count" }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $match: { "user.role": "admin" } },
  { $sort: { totalCreated: -1 } },
  { $limit: 10 }
])
```

---

## 🧾 Final Tips

* All these can be **called via GET** to fetch insights.
* For more advanced filters (date ranges, roles, etc.), use **POST** with payload containing filters.
* Use proper **indexes** on:

  * `created.user_id`
  * `project_id`
  * `status`
  * `activities.created.time`
  * `comments.created.time`

Would you like frontend wireframes (or chart types) for each insight too?
