export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    meta?: {
        totalCount: number;
        algorithm: string;
        generatedAt: string;
    };
}


