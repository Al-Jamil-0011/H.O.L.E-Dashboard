/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import {
    IApiResponse,
    ICommission,
    ICommissionQuery,
    ICommissionResponse,
    ICommissionSummary,
    IPaginationMeta,
} from "./interface";


export function useCommissionSummary() {
    const [summary, setSummary] =
        useState<ICommissionSummary | null>(
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
                        IApiResponse<ICommissionSummary>
                    >("/commission/summary");

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch commission summary";

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

export function useCommissions() {
    const [commissions, setCommissions] =
        useState<ICommission[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<ICommissionQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
            status: "",
        });

    const fetchCommissions =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const params =
                    new URLSearchParams();

                params.append(
                    "page",
                    String(query.page)
                );

                params.append(
                    "limit",
                    String(query.limit)
                );

                if (query.searchTerm) {
                    params.append(
                        "searchTerm",
                        query.searchTerm
                    );
                }

                if (query.status) {
                    params.append(
                        "status",
                        query.status
                    );
                }

                const response =
                    await useApi.get<
                        IApiResponse<ICommissionResponse>
                    >(
                        `/commission/get-all?${params.toString()}`
                    );

                setCommissions(
                    response?.data?.data?.results ||
                    []
                );

                setMeta(
                    response?.data?.data?.meta ||
                    null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch commissions";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchCommissions();
    }, [fetchCommissions]);

    return {
        commissions,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchCommissions,
    };
}

export function useSingleCommission(
    id?: string
) {
    const [commission, setCommission] =
        useState<ICommission | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchCommission =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<ICommission>
                    >(`/commission/find/${id}`);

                setCommission(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch commission";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchCommission();
    }, [fetchCommission]);

    return {
        commission,
        loading,
        error,
        refetch: fetchCommission,
    };
}

export function useMarkCommissionPaid() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const markCommissionPaid = async (
        id: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.patch<
                    IApiResponse<ICommission>
                >(
                    `/commission/mark-as-paid/${id}`
                );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to mark commission as paid";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        markCommissionPaid,
        loading,
        error,
    };
}

export function useDeleteCommission() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const deleteCommission = async (
        id: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.delete<
                    IApiResponse<ICommission>
                >(`/commission/delete/${id}`);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to delete commission";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteCommission,
        loading,
        error,
    };
}