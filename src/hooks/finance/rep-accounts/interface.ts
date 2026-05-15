
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

export interface IRepAccountsQuery {
    page: number;
    limit: number;
    searchTerm?: string;
    status?: string;
}

export interface IAgingReportSummary {
    totalRepSales: number;
    totalCommissions: number;
    totalPendingPayable: number;
    totalCommissionPaid: number;
    representativeCount: number;
}


export interface IRepAccount {
    _id: string;

    repName?: string;

    fullName?: string;
    email?: string;
    profileUrl?: string;

    totalSales?: number;
    commissionEarned?: number;

    commissionPaid?: number;

    pendingBalance?: number;

    representativeId?: string;

    createdAt?: string;

    updatedAt?: string;
}



export interface IRepAccountsResponse {
    meta: IPaginationMeta;

    results: IRepAccount[];
}
