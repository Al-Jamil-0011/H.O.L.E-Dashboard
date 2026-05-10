export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export interface IInventorySummary {
    totalInventory: number;

    totalAvailableInventory: number;

    lowStockAlert: {
        productCount: number;
        isLowStock: boolean;
    };

    totalThisMonthInventory: number;
}