export type UserRole = "admin" | "manager" | "driver" | "representative";

export type UserStatus = "active" | "inactive" | "blocked";

export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IDrivingInfo {
  backPhoto?: string;
  frontPhoto?: string;
  licenseNumber?: string;
}

export interface INidInfo {
  backPhoto?: string;
  frontPhoto?: string;
  nidNumber?: string;
}

export interface IDriverAndCarInfo {
  platePhoto?: string;
  carPhoto?: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;

  phoneNumber?: string | undefined;
  territory?: string;
  employeeId?: string;
  dateOfBirth?: string | null;
  profileUrl?: string;
  bio?: string;
  designation?: string;
  address?: string;

  isDeleted?: boolean;
  isVerified?: boolean;

  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  updated_at?: string;
  gender?: string;
  location?: ILocation;

  drivingInfo?: IDrivingInfo;
  nidInfo?: INidInfo;
  driverAndCarInfo?: IDriverAndCarInfo;
}

export interface IUserProfile {
  user: IUser;
  userStats?: any;
}

export interface IPaginationMeta {
  totalResult: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

export interface IUsersResponse {
  meta: IPaginationMeta;
  results: IUser[];
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface IUsersQuery {
  page: number;
  limit: number;
  searchTerm: string;
  role: string;
  status: string;
  territory: string;
}

export interface IChangeStatusPayload {
  status: UserStatus;
}
export interface IUserSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  thisMonthUsers: number;
}
