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

export type ICommissionStatus =
    | "paid"
    | "unpaid";

export interface ICommissionSummary {
    totalCommission: {
        amount: number;
        label: string;
    };

    paidOut: {
        amount: number;
        repsPaid: number;
    };

    pendingApproval: {
        amount: number;
        count: number;
    };

    paidCommission: {
        amount: number;
        count: number;
    };
}

export interface ICommissionRepresentative {
    representative: string | null;

    assignRole: string;

    commissionRate: number;

    commission: number;
}

export interface ICommissionSale {
    _id: string;

    createdBy: any;

    saleId: string;

    status: string;

    salesType: string;

    files: string[];

    physician: any;

    facility: any;

    procedureDate: string;

    inventoryProducts?: {
        product: string;

        productType: string;

        _id: string;
    }[];

    representatives: {
        users: ICommissionRepresentative[];

        totalCommission: number;

        myCommission: number;
    };

    billing: {
        vendor: any;

        purchaseOrderNumber: string;

        totalAmount: number;

        vendorPayment: number;
    };

    invoice?: {
        isOpenBill: boolean;

        invoiceNumber: string;

        invoiceDate: string;

        invoiceAmount: number;

        status: string;

        _id: string;

        createdAt?: string;

        updatedAt?: string;
    };

    attachments: string[];

    isPackingSlipGenerated: boolean;

    isDeleted?: boolean;

    createdAt?: string;

    updatedAt?: string;
}

export interface ICommission {
    _id: string;

    sale: ICommissionSale;

    createdBy: string | { _id: string; fullName: string, email: string, profileUrl?: string };

    status: ICommissionStatus;

    isDeleted?: boolean;

    createdAt?: string;

    updatedAt?: string;
}

export interface ICommissionResponse {
    meta: IPaginationMeta;

    results: ICommission[];
}

export interface ICommissionQuery {
    page: number;

    limit: number;

    searchTerm?: string;

    status?: string;
}