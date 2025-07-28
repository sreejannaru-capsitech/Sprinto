interface Project {
    id: string;
    title: string;
    description: string;
    isCompleted?: boolean;
    deadline: Date;
    teamLead: string;
    assignees: Assignee[];
    createdBy: Creation;
}

interface ProjectRequest {
    title: string;
    description: string;
    isCompleted: boolean;
    deadline: Date;
    teamLead: string;
    assignees: Assignee[];
}