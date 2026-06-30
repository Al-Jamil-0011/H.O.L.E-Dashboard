
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


export interface IVendor {
    _id: string;

    name: string;

    email: string;

    phoneNumber: string;

    profileUrl?: string;

    companyName?: string;

    faxNumber?: string;

    notes?: string;

    isDeleted?: boolean;

    createdAt?: string;

    updatedAt?: string;
}

export interface IVendorResponse {
    meta: IPaginationMeta;
    results: IVendor[];
}


export interface IVendorPayload {
    name: string;

    email: string;

    phoneNumber: string;

    companyName?: string;

    faxNumber?: string;

    notes?: string;

    profile?: File | null;
}

export interface IUpdateVendorPayload {
    name?: string;

    email?: string;

    phoneNumber?: string;

    companyName?: string;

    faxNumber?: string;

    notes?: string;

    profile?: File | null;
}

export interface IVendorQuery {
    page: number;
    limit: number;
    searchTerm?: string;
}
