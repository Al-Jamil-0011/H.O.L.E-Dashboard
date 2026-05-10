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

export interface ISurgeryQuery {
    page: number;
    limit: number;
    searchTerm?: string;
}

export interface ISurgeryInfo {
    fullName?: string;

    profileUrl?: string;

    physician:
    | string
    | ISurgeryPhysician;

    patientId: string;

    facility:
    | string
    | ISurgeryFacility;

    dateOfSurgery: string;

    surgeryType: string;
}

export interface ISurgeryMaterial {
    screws?: string;

    plates?: string;

    rodsOrconnectors?: string;

    implants?: string;
}

export interface ISurgeryRadiologyClinicalFile {
    patientSticker?: string;

    preOpAP?: string;

    postOpAP?: string;

    preOpLateral?: string;

    postOpLateral?: string;
}

export interface ISurgeryDocAndNotes {
    files?: string[];

    caseNotes?: string;
}

export interface ISurgeryPhysician {
    _id: string;

    practice?: string;

    specialty?: string;

    noteToSelf?: string;

    documents?: string[];

    contactInfo?: {
        phoneNumber?: string;

        cellNumber?: string;

        email?: string;

        dateOfBirth?: string;
    };
}

export interface ISurgeryFacility {
    _id: string;

    name?: string;

    address?: string;

    phoneNumber?: string;

    contacts?: string;

    noteToSelf?: string;

    dressCode?: string;

    vendors?: string;

    healthSystems?: string;

    email?: string;

    createdAt?: string;

    updatedAt?: string;
}

export interface ISurgery {
    _id: string;

    createdBy?: string;

    info: ISurgeryInfo;

    surgeryMaterial?: ISurgeryMaterial;

    radiologyClinicalFile?: ISurgeryRadiologyClinicalFile;

    docAndNotes?: ISurgeryDocAndNotes;

    isDeleted?: boolean;

    createdAt?: string;

    updatedAt?: string;
}

export interface ISurgeryResponse {
    meta: IPaginationMeta;

    results: ISurgery[];
}

/**
 * CREATE SURGERY
 * form-data
 */
export interface ISurgeryPayload {
    physician: string;

    patientId: string;

    facility: string;

    dateOfSurgery: string;

    surgeryType: string;

    screws?: string;

    plates?: string;

    rodsOrconnectors?: string;

    implants?: string;

    caseNotes?: string;

    /**
     * files
     */
    sticker?: File | null;

    appre?: File | null;

    appost?: File | null;

    lateralpre?: File | null;

    lateralpost?: File | null;

    notes?: File[];
}

/**
 * UPDATE SURGERY
 * form-data
 */
export interface IUpdateSurgeryPayload {
    physician?: string;

    patientId?: string;

    facility?: string;

    dateOfSurgery?: string;

    surgeryType?: string;

    screws?: string;

    plates?: string;

    rodsOrconnectors?: string;

    implants?: string;

    caseNotes?: string;

    sticker?: File | null;

    appre?: File | null;

    appost?: File | null;

    lateralpre?: File | null;

    lateralpost?: File | null;

    notes?: File[];
}