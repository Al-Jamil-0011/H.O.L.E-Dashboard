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

export interface IShipmentSummary {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
}

export interface IShipmentQuery {
    page: number;
    limit: number;
    searchTerm?: string;
    status?: string;
    method?: string;
}

export interface IShipmentDetail {
    _id: string;
    createdBy: string;

    shipmentInfo: IShipmentInfo;
    shipmentId?: string;
    products: IShipmentProduct[];

    packageInfo: IPackageInfo;

    pickupInfo: IPickupInfo;

    dropoffInfo: IDropoffInfo;

    files: string[];

    totalPrice: number;
    totalDistance: string;

    status: string;
    isDeleted: boolean;

    trackingHistory: ITrackingHistory[];

    matchingStatus: string;
    shipmentStatus: string;

    assigneeDriver?: IDriver | null;

    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface IShipment {
    _id: string;
    shipmentId?: string;
    createdBy?: string;

    shipmentInfo?: {
        company?: string;
        type?: string;
        priority?: string;
        recipient?: string | null;
    };

    shipmentStatus?: string;
    status?: string;
    matchingStatus?: string;

    totalPrice?: number;
    totalDistance?: string;

    createdAt?: string;
    updatedAt?: string;

    files?: string[];
}

export interface IShipmentInfo {
    company?: string;
    type?: string;
    priority?: string;
    recipient?: string | null;
}


export interface IShipmentProduct {
    _id: string;
    productType: string;
    product: IProduct;
}

export interface IProduct {
    _id: string;
    createdBy: string;
    facility: string;
    vendor: string;

    productStatus: string;
    systemType: string;

    recipientEmail: string;
    serialNumber: string;

    inboundFiles: string[];
    inboundNotes: string;

    brokenFiles: string[];
    brokenInstrumentsNotes: string;

    isDeleted: boolean;

    createdAt: string;
    updatedAt: string;

    __v?: number;
}


export interface IPackageInfo {
    serviceType: string;
    weight: string;
    dimensions: string;
    spacialInstructions: string;
}


export interface IPickupInfo {
    address: string;

    location: {
        type: "Point";
        coordinates: [number, number];
    };

    contactPerson: string | null;
    phoneNumber: string;
    pickupDate: string;
    instructions: string;
}


export interface IDropoffInfo {
    address: string;

    location: {
        type: "Point";
        coordinates: [number, number];
    };

    facility: IFacility | string;

    contactPerson: string | null;
    phoneNumber: string;
    instructions: string;
}


export interface IFacility {
    _id: string;
    address: string;
    phoneNumber: string;
    contacts: string;
    email: string;
    name: string;
}


export interface ITrackingHistory {
    _id: string;
    status: string;
    title: string;
    description: string;
    timestamp: string;
}

export interface IDriver {
    _id: string;
    fullName: string;
    email: string;
    territory: string;
    profileUrl: string;
    address: string;
}


export type IShipmentDetailResponse =
    IApiResponse<IShipmentDetail>;