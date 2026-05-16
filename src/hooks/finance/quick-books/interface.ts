export interface IQuickBooksStatus {
  isConnected: boolean;
  lastFullSyncAt: string | null;
}

export interface IQuickBooksSyncLog {
  _id: string;
  syncType: "invoices" | "payments" | "vendor-bills" | "all";
  status: "success" | "error";
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuickBooksSyncResponse {
  success: boolean;
  message: string;
  data?: any;
}
