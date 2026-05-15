export interface IAmountSummary {
    amount: number;
    count: number;
}

export interface IVendorPaymentSummary {
    totalPaid: IAmountSummary;
    totalPending: IAmountSummary;
    totalOverdue: IAmountSummary;
    thisMonth: IAmountSummary;
}

export type PaymentStatus = "pending" | "paid" | "partial" | "failed";

export interface IVendor {
    _id: string;
    name: string;
}

export interface IVendorPayment {
    _id: string;
    saleId: string;
    createdAt: string;
    updatedAt: string;

    paymentStatus: PaymentStatus;

    vendor: IVendor;

    invoiceNumber: string;
    invoiceDate: string;

    invoiceAmount: number;
    totalAmount: number;

    purchaseOrderNumber: string;

    vendorPayment: number;
}


export interface IPaginationMeta {
    totalResult: number;
    currentPage: number;
    limit: number;
    totalPage: number;
}

export interface IVendorPaymentResponse {
    results: IVendorPayment[];
    meta: IPaginationMeta;
}

export interface IVendorPaymentQuery {
    page: number;
    limit: number;
    searchTerm?: string;
    status?: PaymentStatus | "";
}

export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}