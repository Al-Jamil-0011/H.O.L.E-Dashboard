
export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export interface IPaginationMeta {
    totalResult: number;
    currentPage: number;
    limit: number;
    totalPage: number;
}


export interface IPractice {
    _id: string;

    user?: string;

    practiceName: string;

    address: string;

    phone: string;

    email: string;

    hours: number;

    website?: string;

    businessCard?: string;

    isDeleted?: boolean;

    createdAt?: string;

    updatedAt?: string;
}

export interface IPracticeResponse {
    meta: IPaginationMeta;
    results: IPractice[];
}


export interface IPracticePayload {
    practiceName: string;

    address: string;

    phone: string;

    email: string;

    hours: number;

    website?: string;

    businessCard?: string;
}

export interface IUpdatePracticePayload {
    practiceName?: string;

    address?: string;

    phone?: string;

    email?: string;

    hours?: number;

    website?: string;

    businessCard?: string;
}


export interface IPracticeQuery {
    page: number;
    limit: number;
    searchTerm?: string;
}
