interface ApiResponse<T> {
    status: boolean;
    message: string;
    errors: null | object;
    result: null | T;
}

interface LoginResponse {
    accessToken: string;
}