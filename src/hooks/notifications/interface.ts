
export interface INotification {
    _id: string;
    title: string;
    description: string;
    is_read: boolean;
    isRead?: boolean; // Support camelCase
    createdAt: string;
    sender?: {
        _id?: string;
        name: string;
        profile_url?: string;
        profileUrl?: string; // Support camelCase
    };
}

export interface IPagination {
    totalResult: number;
    currentPage: number;
    limit: number;
    totalPage: number;
}

export interface INotificationResponse {
    results: INotification[];
    pagination: IPagination;
}

export interface IServiceResponse<T> {
    success: boolean;
    message: string;
    data: T;
}