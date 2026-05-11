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