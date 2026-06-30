
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

export interface IFacility {
    _id: string;

    name: string;
    email: string;

    address: string;
    phoneNumber: string;

    contacts: string;

    noteToSelf?: string;

    dressCode?: string;

    vendors?: string;

    healthSystems?: string;

    isDeleted?: boolean;

    createdAt?: string;
    updatedAt?: string;
}

export interface IFacilityResponse {
    meta: IPaginationMeta;
    results: IFacility[];
}

export interface IFacilityPayload {
    name: string;

    email: string;

    address: string;

    phoneNumber: string;

    contacts: string;

    noteToSelf?: string;

    dressCode?: string;

    vendors?: string;

    healthSystems?: string;
}

export interface IUpdateFacilityPayload {
    name?: string;

    email?: string;

    address?: string;

    phoneNumber?: string;

    contacts?: string;

    noteToSelf?: string;

    dressCode?: string;

    vendors?: string;

    healthSystems?: string;
}


export interface IFacilityQuery {
    page: number;
    limit: number;
    searchTerm?: string;
}