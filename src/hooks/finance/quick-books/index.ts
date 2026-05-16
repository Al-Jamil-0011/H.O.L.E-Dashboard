"use client";

import { useState, useEffect, useCallback } from "react";
import useApi from "@/hooks/use-api";
import { IQuickBooksStatus, IQuickBooksSyncLog, QuickBooksSyncResponse } from "@/hooks/finance/quick-books/interface";
import toast from "react-hot-toast";

export const useQuickBooksStatus = () => {
    const [status, setStatus] = useState<IQuickBooksStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await useApi.get("/quickbooks/status");
            setStatus(response.data.data);
        } catch (error) {
            console.error("Error fetching QuickBooks status:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return { status, loading, refetch: fetchStatus };
};

export const useQuickBooksSyncLogs = () => {
    const [logs, setLogs] = useState<IQuickBooksSyncLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        try {
            const response = await useApi.get("/quickbooks/sync-logs");
            setLogs(response.data.data || []);
        } catch (error) {
            console.error("Error fetching QuickBooks sync logs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return { logs, loading, refetch: fetchLogs };
};

export const useQuickBooksSync = () => {
    const [syncing, setSyncing] = useState<string | null>(null);

    const sync = async (type: "invoices" | "payments" | "vendor-bills" | "all") => {
        setSyncing(type);
        const endpoint = type === "all" ? "/quickbooks/sync/all" : `/quickbooks/sync/${type}`;

        try {
            const response = await useApi.post<QuickBooksSyncResponse>(endpoint);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || `Failed to sync ${type}`;
            toast.error(message);
            return { success: false, message };
        } finally {
            setSyncing(null);
        }
    };

    return { sync, syncing };
};
