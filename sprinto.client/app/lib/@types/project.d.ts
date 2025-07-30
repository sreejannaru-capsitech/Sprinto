interface Project {
    id: string;
    title: string;
    alias: string;
    description: string;
    isCompleted?: boolean;
    startDate: string;
    deadline: string;
    teamLead: Assignee;
    assignees: Assignee[];
    createdBy: Creation;
}

interface ProjectRequest {
    title: string;
    alias: string;
    description: string;
    isCompleted: boolean;
    startDate?: string;
    deadline?: string;
    teamLead: Assignee;
    assignees: Assignee[];
}