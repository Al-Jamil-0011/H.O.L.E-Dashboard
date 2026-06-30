export interface IPaginationMeta {
    currentPage: number;
    totalPage: number;
    limit: number;
    totalResult: number;
}



export interface IPractice {
    _id: string;
    practiceName: string;
    address: string;
    phone: string;
    email: string;
}

export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}


export interface IPhysician {
    _id: string;
    fullName: string;
    specialty?: string;
    profileUrl?: string;
}


export interface IFacility {
    _id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
}