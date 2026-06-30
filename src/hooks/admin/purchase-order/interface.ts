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

export type IPurchaseOrderStatus =
    | "open"
    | "complete"
    | "lost";

export type IPurchaseOrderType =
    | "standardPO"
    | "bulkBioOrder";

export interface IPurchaseOrderVendor {
    vendor?: string;

    name?: string;

    email?: string;

    note?: string;

    _id?: string;
}

export interface IPurchaseOrderFacility {
    _id: string;

    address?: string;

    phoneNumber?: string;

    email?: string;

    name?: string;

    contacts?: string;
}

export interface IPurchaseOrderSurgeryInfo {
    fullName?: string;

    profileUrl?: string;

    physician?: string;

    patientId?: string;

    facility?: string;

    dateOfSurgery?: string;

    surgeryType?: string;
}

export interface IPurchaseOrderSurgery {
    _id: string;

    info?: IPurchaseOrderSurgeryInfo;
}

export interface IPurchaseOrderSummary {
    totalVolume: {
        amount: number;
        changePercent: number;
    };

    completed: {
        count: number;
        thisWeek: number;
    };

    openPOs: {
        count: number;
        needsAttention: boolean;
    };

    lostRejected: {
        count: number;
        diffFromLastMonth: number;
    };
}

export interface IPurchaseOrder {
    _id: string;

    status: IPurchaseOrderStatus;

    orderType: IPurchaseOrderType;

    createdBy?: string;

    thumbnail?: string;

    patientId: string;

    surgery:
    | string
    | IPurchaseOrderSurgery;

    facility:
    | string
    | IPurchaseOrderFacility;

    facilityEmail?: string;

    procedureDate: string;

    purchaseOrderNumber: string;

    isSentToVendor?: boolean;

    isSendMailViaManager?: boolean;

    sendMailToVendor?: IPurchaseOrderVendor;

    totalAmount: number;

    notes?: string;

    handWritePODoc?: string;

    documents?: string[];

    products?: any[];

    isDeleted?: boolean;

    createdAt?: string;

    updatedAt?: string;
}

export interface IPurchaseOrderResponse {
    meta: IPaginationMeta;

    results: IPurchaseOrder[];
}

export interface IPurchaseOrderQuery {
    page: number;

    limit: number;

    searchTerm?: string;

    status?: IPurchaseOrderStatus;

    orderType?: IPurchaseOrderType;
}

export interface IUpdatePurchaseOrderPayload {
    status?: IPurchaseOrderStatus;

    orderType?: IPurchaseOrderType;

    patientId?: string;

    surgery?: string;

    facility?: string;

    facilityEmail?: string;

    procedureDate?: string;

    purchaseOrderNumber?: string;

    isSentToVendor?: boolean;

    totalAmount?: number;

    notes?: string;

    vendor?: string;

    name?: string;

    email?: string;

    note?: string;

    thumbnail?: File | string;

    handWritePODoc?: File | string;

    documents?: File[] | string[];
}

export interface ISendVendorMailResponse {
    message?: string;
}