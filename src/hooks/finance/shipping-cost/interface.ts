

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


export interface IShippingCostSummary {
    _id: string | null;

    totalShippingCost: number;

    totalPendingPayments: number;

    totalPaidPayments: number;

    totalShipmentsWithCost: number;
}


export interface IShippingCostQuery {
    page: number;
    limit: number;
    searchTerm?: string;
    type?: string;
}



export interface IShippingCost {
    _id: string;

    shipmentId?: string;

    createdBy?: {
        _id: string;
        fullName: string;
        email: string;
    };

    shippingCost?: {
        shipmentId?: string;

        type?: string;

        distance?: string;

        baseRate?: number;

        priority?: string;

        priorityCharge?: number;

        totalCost?: number;

        status?: string;

        isDeleted?: boolean;

        _id?: string;

        createdAt?: string;

        updatedAt?: string;
    };

    totalPrice?: number;

    totalDistance?: string;

    shipmentStatus?: string;

    status?: string;

    matchingStatus?: string;

    assigneeDriver?: string;

    createdAt?: string;

    updatedAt?: string;
}


export interface IShippingCostResponse {
    meta: IPaginationMeta;

    results: IShippingCost[];
}
