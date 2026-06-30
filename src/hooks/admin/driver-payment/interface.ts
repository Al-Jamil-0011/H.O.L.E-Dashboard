
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

export type IPriority =
    | "urgent"
    | "express"
    | "priority"
    | "standard"
    | "economy";

export interface IPriorityCharge {
    _id?: string;

    priority: IPriority;

    priorityPercentage: number;

    extraCharge: number;
}

export interface IShipmentRate {
    _id: string;

    name: string;

    amountPerKm: number;

    priorityCharges: IPriorityCharge[];

    currency: string;

    isActive: boolean;

    isDeleted?: boolean;

    createdAt?: string;

    updatedAt?: string;
}

export interface IShipmentRatePayload {
    name: string;

    amountPerKm: number;

    currency: string;

    isActive?: boolean;

    priorityCharges: {
        priority: IPriority;

        priorityPercentage: number;

        extraCharge: number;
    }[];
}


export type IWithdrawalStatus =
    | "pending"
    | "paid"
    | "approved"
    | "rejected";

export interface IWithdrawalUser {
    _id: string;

    fullName: string;

    email: string;
}

export interface IWithdrawal {
    _id: string;

    user: IWithdrawalUser;

    totalAmount: number;

    transactionType: string;

    transactionId: string;

    cardNumber: number;

    status: IWithdrawalStatus;

    platformFee: number;

    dueAmount: number;

    createdAt?: string;

    updatedAt?: string;
}

export interface IWithdrawalResponse {
    meta: IPaginationMeta;

    results: IWithdrawal[];
}

export interface IWithdrawalQuery {
    page: number;

    limit: number;

    searchTerm?: string;

    status?: string;
}

export interface IWithdrawalStatusPayload {
    status: "approved" | "rejected" | "paid";
}