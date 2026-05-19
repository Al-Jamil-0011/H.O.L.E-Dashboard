
export interface IRepresentativeUser {
    _id: string;
    fullName: string;
    email: string;
    profileUrl: string;
}

export interface IPaginationMeta {
    totalResult: number;
    currentPage: number;
    limit: number;
    totalPage: number;
}

export interface IRepresentativeUserResponse {
    meta: IPaginationMeta;
    results: IRepresentativeUser[];
}

export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export interface IRepresentativeUserQuery {
    page: number;
    limit: number;
    searchTerm?: string;
}

export interface IRepresentative {
    _id: string;
    fullName: string;
    email: string;
    profileUrl: string;
}

export interface IManagerRepresentative {
    _id: string;
    assigneeBy: string;
    manager: string;
    representative: IRepresentative;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}




export interface IAssignRepresentativePayload {
    manager: string;
    repsId: string | string[];
}


