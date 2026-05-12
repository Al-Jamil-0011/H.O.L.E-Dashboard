
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



export interface IAgingReportSummaryItem {
    label: string;
    amount: number;
    invoices: number;
}

export interface IAgingReportSummary {
    zeroToThirty: IAgingReportSummaryItem;

    thirtyToSixty: IAgingReportSummaryItem;

    sixtyToNinety: IAgingReportSummaryItem;

    ninetyPlus: IAgingReportSummaryItem;
}


export interface IAgingReportQuery {
    page: number;
    limit: number;
    searchTerm?: string;
}



export interface IAgingFacility {
    _id: string;

    address?: string;

    phoneNumber?: string;

    email?: string;

    name?: string;
}



export interface IAgingInvoice {
    _id: string;

    isOpenBill?: boolean;

    invoiceNumber?: string;

    invoiceDate?: string;

    invoiceAmount?: number;

    status?: string;

    createdAt?: string;

    updatedAt?: string;
}


export interface IAgingSale {
    _id: string;

    facility?: IAgingFacility;

    invoice?: IAgingInvoice;
}


export interface IAgingReport {
    _id: string;

    sale?: IAgingSale;

    createdBy?: string;

    status?: string;

    isDeleted?: boolean;

    daysPending?: number;

    agingStatus?: string;

    createdAt?: string;

    updatedAt?: string;
}



export interface IAgingReportResponse {
    meta: IPaginationMeta;

    results: IAgingReport[];
}
