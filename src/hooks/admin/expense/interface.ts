
export type ExpenseStatus =
    | "pending"
    | "approved"
    | "rejected";

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

export interface IUserShort {
    _id: string;
    fullName: string;
    email?: string;

    profileUrl?: string;
    territory?: string;
    employeeId?: string;
    dateOfBirth?: string | null;

    status?: string;
    isVerified?: boolean;
    address?: string;

    updated_at?: string;

    location?: {
        type: "Point";
        coordinates: [number, number];
    };
}

export interface IPhysician {
    _id: string;
    fullName: string;
    specialty?: string;
    noteToSelf?: string;
    profileUrl?: string;
}

export interface IExpense {
    _id: string;

    files: string[];
    attachments: string[];

    representative:
    | string
    | IUserShort;

    representativeName?: string;

    createdBy: string;

    physician:
    | string
    | IPhysician;

    category: string;

    date: string;
    year: string;
    month: string;

    totalAmount: number;

    isPaid: boolean;

    description?: string;

    status: ExpenseStatus;

    isDeleted?: boolean;

    createdAt?: string;
    updatedAt?: string;
}

export interface IExpenseResponse {
    meta: IPaginationMeta;
    results: IExpense[];
}


export interface IExpenseSummaryItem {
    amount: number;
    monthlyChange?: number;
    count?: number;
}

export interface IExpenseChart {
    month: string;
    total: number;
}

export interface IExpenseSummary {
    totalExpenses: IExpenseSummaryItem;

    pendingApproval: IExpenseSummaryItem;

    approved: IExpenseSummaryItem;

    rejected: IExpenseSummaryItem;

    chart: IExpenseChart[];
}

export interface IExpenseQuery {
    page: number;
    limit: number;

    searchTerm?: string;

    status?: string;

    category?: string;

    representative?: string;
}

export interface IUpdateExpenseStatusPayload {
    status: "approved" | "rejected";
}