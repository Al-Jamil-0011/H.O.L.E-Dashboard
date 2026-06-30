import { useCallback, useEffect, useState } from "react";
import useApi from "../use-api";
import { IAdminDashboardOverview, IApiResponse } from "./interface";



export function useDashboardOverview() {
    const [summary, setSummary] =
        useState<IAdminDashboardOverview | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.get<
                    IApiResponse<IAdminDashboardOverview>
                >("/meta/admin-dashboard/overview");

            setSummary(response?.data?.data || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch dashboard overview";

            setError(message);
        } finally {
            setLoading(false);
            // setTimeout(() => {
            //     setLoading(false);
            // }, 300);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        summary,
        loading,
        error,
        refetch: fetchDashboard,
    };
}