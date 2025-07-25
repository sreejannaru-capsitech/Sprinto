interface Project {
    id: string;
    title: string;
    description: string;
    isCompleted?: boolean;
    deadline: Date;
    teamLead: string;
    assignees: string[];
    createdBy: Creation;
}

interface ProjectRequest {
    title: string;
    description: string;
    isCompleted: boolean;
    deadline: Date;
    teamLead: string;
    assignees: string[];
}