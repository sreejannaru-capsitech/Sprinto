interface ApiResponse<T> {
    status: boolean;
    message: string;
    errors: null | object;
    result: null | T;
}

interface PagedResult<T> {
    items: T[];
    totalCount: number;
    totalPages: number;
}

interface LoginResponse {
    accessToken: string;
    user: User;
}