
export interface IRevenueStats {
    totalRevenue: number;
    thisMonthPercentage: number;
}

export interface ISalesStats {
    totalSales: number;
    thisMonthCount: number;
}

export interface ICommissionStats {
    totalCommissions: number;
    reps: number;
}

export interface IVendorStats {
    totalVendorPayments: number;
    pendingCount: number;
}

export interface IExpenseStats {
    totalExpenses: number;
    lastMonthPercentage: number;
}

export interface INetProfitStats {
    totalNetProfit: number;
    margin: number;
}

export interface IMonthlyRevenue {
    month: string;
    revenue: number;
    expenses: number;
}

export interface IRepPerformance {
    repName: string;
    sales: number;
    revenue: number;
}

export interface IRecentSale {
    saleId: string;
    rep: string;
    doctor: string;
    hospital: string;
    implant: string;
    amount: number;
    commission: number;
    status: string;
    date: string;
}

export interface IAdminDashboardOverview {
    stats: {
        revenue: IRevenueStats;
        sales: ISalesStats;
        commission: ICommissionStats;
        vendor: IVendorStats;
        expense: IExpenseStats;
        netProfit: INetProfitStats;
    };

    charts: {
        monthlyRevenue: IMonthlyRevenue[];
        repPerformance: IRepPerformance[];
    };

    recentSales: IRecentSale[];
}

export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}