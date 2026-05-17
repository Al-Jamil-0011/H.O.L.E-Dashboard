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

export type TInventoryCategory = "Implant" | "Tray" | "Bio";


export interface IInventoryApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        results: IInventoryItem[];
    };
}

export interface IInventoryItem {
    _id: string;
    location?: string;
    facility: string | {
        _id: string;
        name: string;
        address: string;
    };

    vendor: {
        _id: string;
        name: string;
        email: string;
        phoneNumber: string;
        profileUrl: string;
        companyName: string;
    };

    productType: TInventoryCategory;
    productStatus: string;
    isDeleted: boolean;

    createdAt: string;
    updatedAt: string;

    systemType?: string;

    notes?: string;

    serialNumber?: string;
    recipientEmail?: string;

    inboundFiles?: string[];
    inboundNotes?: string;

    brokenFiles?: string[];
    brokenInstrumentsNotes?: string;

    title?: string;
    initialPhoto?: string;
    files?: string[];

    inventory?: "consignment" | "loaner";
    returnDate?: string;
    status?: "Warehouse" | "downRack" | string;

    sendTray?: {
        facility: string;
        recipientEmail: string;
        recipientName: string;
        systemType: string;
        initialPhoto: string;
        files: string[];
        notes: string;
    };

    receiveTray?: {
        initialPhoto?: string;
        brokenFiles?: string[];
    };

    // Bio fields
    itemName?: string;
    lotNumber?: string;
    quantity?: string;
    expiryDate?: string;

    createdBy: string | {
        _id: string;
        fullName: string;
        email: string;
        role: string;
        profileUrl?: string;
    };
}

export interface IInventoryQuery {
    page: number;
    limit: number;
    searchTerm?: string;
    category?: TInventoryCategory | "";
    facility?: string;
    productStatus?: string;
}

export interface IPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}