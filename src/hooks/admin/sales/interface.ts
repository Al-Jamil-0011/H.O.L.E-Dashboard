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

export type ISalesStatus =
    | "pending"
    | "approved"
    | "rejected";

export type ISalesType =
    | "sold"
    | "consigned";

export type IRepresentativeRole =
    | "primary"
    | "assist";

export type IInvoiceStatus =
    | "paid"
    | "unpaid";

export interface ISalesSummary {
    revenue: {
        total: number;
        change: number;
    };

    totalSales: {
        count: number;
        newThisMonth: number;
    };

    avgValue: {
        amount: number;
        change: number;
    };

    conversion: {
        rate: number;
        trend: string;
    };
}

export interface ISalesRepresentativeUser {
    representative:
    | string
    | {
        _id: string;

        fullName: string;

        email: string;

        profileUrl?: string;

        territory?: string;

        location?: {
            type: string;

            coordinates: number[];
        };
    };

    assignRole: IRepresentativeRole;

    commissionRate: number;

    commission: number;
}

export interface ISalesRepresentatives {
    users: ISalesRepresentativeUser[];

    totalCommission: number;

    myCommission: number;
}

export interface ISalesBilling {
    vendor:
    | string
    | {
        _id: string;

        name: string;

        email: string;

        phoneNumber?: string;

        profileUrl?: string;

        companyName?: string;
    };

    purchaseOrderNumber: string;

    totalAmount: number;

    vendorPayment: number;
}

export interface ISalesInvoice {
    _id?: string;

    isOpenBill: boolean;

    invoiceNumber: string;

    invoiceDate: string;

    invoiceAmount: number;

    status: IInvoiceStatus;

    createdAt?: string;

    updatedAt?: string;
}

export interface ISalesPhysician {
    _id: string;

    fullName: string;

    specialty?: string;

    noteToSelf?: string;

    profileUrl?: string;
}

export interface ISalesFacility {
    _id: string;

    address?: string;

    phoneNumber?: string;

    contacts?: string;

    noteToSelf?: string;

    dressCode?: string;
}

export interface ISalesInventoryProduct {
    _id?: string;

    product: string;

    productType: string;
}

export interface ISale {
    _id: string;

    createdBy?: {
        _id: string;
        fullName: string;
        email: string;
        profileUrl?: string;
    };

    saleId: string;

    status: ISalesStatus;

    salesType: ISalesType;

    files?: string[];

    physician:
    | string
    | ISalesPhysician;

    facility:
    | string
    | ISalesFacility;

    procedureDate: string;

    inventoryProducts?: ISalesInventoryProduct[];

    representatives: ISalesRepresentatives;

    billing: ISalesBilling;

    invoice?: ISalesInvoice;

    attachments?: string[];

    isPackingSlipGenerated?: boolean;

    isDeleted?: boolean;

    rejectionNote?: string;

    feedbackNotes?: string;

    additionalNotes?: string;
    repNotes?: string;
    createdAt?: string;

    updatedAt?: string;
}

export interface ISalesResponse {
    meta: IPaginationMeta;

    results: ISale[];
}

export interface ISalesQuery {
    page: number;

    limit: number;

    searchTerm?: string;

    status?: ISalesStatus;

    salesType?: ISalesType;
}

export interface ICreateSalesRepresentative {
    representative: string;

    assignRole: IRepresentativeRole;

    commissionRate: number;

    commission: number;
}

export interface ICreateSalesInventoryProduct {
    product: string;

    productType: string;
}

export interface ISalesPayload {
    saleId?: string;

    status?: ISalesStatus;

    salesType: ISalesType;

    physician: string;

    facility: string;

    procedureDate: string;

    inventoryProducts?: ICreateSalesInventoryProduct[];

    representatives: {
        users: ICreateSalesRepresentative[];

        totalCommission: number;

        myCommission: number;
    };

    billing: {
        vendor: string;

        purchaseOrderNumber: string;

        totalAmount: number;

        vendorPayment: number;
    };

    invoice?: {
        isOpenBill: boolean;

        invoiceNumber: string;

        invoiceDate: string;

        invoiceAmount: number;

        status: IInvoiceStatus;
    };

    isPackingSlipGenerated?: boolean;

    attachments?: File[] | string[];

    files?: File[] | string[];
}

export interface IUpdateSalesPayload {
    saleId?: string;

    status?: ISalesStatus;

    salesType?: ISalesType;

    physician?: string;

    facility?: string;

    procedureDate?: string;

    inventoryProducts?: ICreateSalesInventoryProduct[];

    representatives?: {
        users?: ICreateSalesRepresentative[];

        totalCommission?: number;

        myCommission?: number;
    };

    billing?: {
        vendor?: string;

        purchaseOrderNumber?: string;

        totalAmount?: number;

        vendorPayment?: number;
    };

    invoice?: {
        isOpenBill?: boolean;

        invoiceNumber?: string;

        invoiceDate?: string;

        invoiceAmount?: number;

        status?: IInvoiceStatus;
    };

    isPackingSlipGenerated?: boolean;

    attachments?: File[] | string[];
    rejectionNote?: string;
    feedbackNotes?: string;
    additionalNotes?: string;
    files?: File[] | string[];
}

export interface IUpdateSalesStatusPayload {
    status: ISalesStatus;
}