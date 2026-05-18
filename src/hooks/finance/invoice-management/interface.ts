import { IPaginationMeta } from "@/hooks/common/interface";


export interface IInvoiceSummary {
    totalVolume: number;
    totalCommissions: number;
    pendingCount: number;
    paidCount: number;
    overdueCount: number;
    totalInvoices: number;
}

export interface IInvoiceQuery {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: string;
    salesType?: string;
}

export interface IInvoiceUser {
    _id: string;
    fullName: string;
    email: string;
    profileUrl: string;
}

export interface IInvoicePhysician {
    _id: string;
    fullName: string;
    specialty: string;
    profileUrl: string;
}

export interface IInvoiceFacility {
    _id: string;
    address: string;
    email: string;
    name: string;
}

export interface IInvoiceRepresentativeUser {
    representative: string;
    assignRole: string;
    commissionRate: number;
    commission: number;
}

export interface IInvoiceRepresentatives {
    users: IInvoiceRepresentativeUser[];
    totalCommission: number;
    myCommission: number;
}

export interface IInvoiceBilling {
    vendor: string;
    purchaseOrderNumber: string;
    totalAmount: number;
    vendorPayment: number;
}

export interface IInvoiceInfo {
    isOpenBill: boolean;
    invoiceNumber: string;
    invoiceDate: string;
    invoiceAmount: number;
    status: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface IInvoice {
    _id: string;

    createdBy: IInvoiceUser;

    saleId: string;

    status: string;
    salesType: string;

    files: string[];
    attachments: string[];

    physician: IInvoicePhysician;

    facility: IInvoiceFacility;

    procedureDate: string;

    representatives: IInvoiceRepresentatives;

    billing: IInvoiceBilling;

    invoice: IInvoiceInfo;

    isPackingSlipGenerated: boolean;

    feedbackNotes?: string;

    createdAt: string;
    updatedAt: string;
}

export interface IInvoiceResponse {
    meta: IPaginationMeta;
    results: IInvoice[];
}