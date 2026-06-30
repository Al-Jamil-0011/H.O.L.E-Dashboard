export interface ISupportUser {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    profileUrl: string;
    designation: string;
    territory: string;
}

export interface ISupport {
    _id: string;
    user: ISupportUser;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPaginationMeta {
    totalResult: number;
    currentPage: number;
    limit: number;
    totalPage: number;
}

export interface ISupportQuery {
    page: number;
    limit: number;
    searchTerm?: string;
}

export interface ISupportResponse {
    meta: IPaginationMeta;
    results: ISupport[];
}

export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}