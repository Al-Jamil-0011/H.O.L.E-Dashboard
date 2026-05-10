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

export interface IPhysicianContactInfo {
    phoneNumber: string;
    cellNumber: string;
    email: string;
    dateOfBirth: string;
}

export interface IPhysician {
    _id: string;

    fullName: string;

    location?: string;

    practice: string;

    specialty: string;

    contactInfo: IPhysicianContactInfo;

    noteToSelf: string;

    documents: string[];

    profileUrl?: string;

    isDeleted?: boolean;

    createdAt?: string;

    updatedAt?: string;
}

export interface IPhysicianResponse {
    meta: IPaginationMeta;
    results: IPhysician[];
}

export interface IPhysicianPayload {
    fullName: string;

    email: string;

    practice: string;

    specialty: string;

    phoneNumber: string;

    cellNumber: string;

    dateOfBirth: string;

    noteToSelf: string;

    location?: string;

    docs?: File[];

    profile?: File;
}

export interface IUpdatePhysicianPayload {
    fullName?: string;

    email?: string;

    practice?: string;

    specialty?: string;

    phoneNumber?: string;

    cellNumber?: string;

    dateOfBirth?: string;

    noteToSelf?: string;

    location?: string;

    docs?: File[];

    profile?: File;
}

export interface IPhysicianQuery {
    page: number;
    limit: number;
    searchTerm?: string;
}