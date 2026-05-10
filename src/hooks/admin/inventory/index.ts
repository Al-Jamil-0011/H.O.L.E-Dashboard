
import { useCallback, useEffect, useState } from "react";

import useApi from "@/hooks/use-api";

import {
    IApiResponse,
    IInventorySummary,
} from "./interface";

export function useInventorySummary() {
    const [summary, setSummary] =
        useState<IInventorySummary | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchSummary =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IInventorySummary>
                    >(
                        "/meta/inventory/overview"
                    );

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch inventory summary";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return {
        summary,
        loading,
        error,
        refetch: fetchSummary,
    };
}