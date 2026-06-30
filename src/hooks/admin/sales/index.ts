/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import {
    IApiResponse,
    IPaginationMeta,
    ISale,
    ISalesPayload,
    ISalesQuery,
    ISalesResponse,
    ISalesSummary,
    IUpdateSalesPayload,
    IUpdateSalesStatusPayload,
} from "./interface";
import useApi from "@/hooks/use-api";

export function useSalesSummary() {
    const [summary, setSummary] =
        useState<ISalesSummary | null>(null);

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
                        IApiResponse<ISalesSummary>
                    >("/sales/summary");

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch sales summary";

                setError(message);
            } finally {
                setLoading(false);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 400);
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

export function useSales() {
    const [sales, setSales] =
        useState<ISale[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<ISalesQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchSales =
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

                if (query.salesType) {
                    params.append(
                        "salesType",
                        query.salesType
                    );
                }

                const response =
                    await useApi.get<
                        IApiResponse<ISalesResponse>
                    >(
                        `/sales/get-all?${params.toString()}`
                    );

                setSales(
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
                    "Failed to fetch sales";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, [query]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    return {
        sales,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchSales,
    };
}

export function useSingleSale(
    id?: string
) {
    const [sale, setSale] =
        useState<ISale | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchSale =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<ISale>
                    >(`/sales/find/${id}`);

                setSale(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch sale";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, [id]);

    useEffect(() => {
        fetchSale();
    }, [fetchSale]);

    return {
        sale,
        loading,
        error,
        refetch: fetchSale,
    };
}

export function useCreateSale() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const createSale = async (
        payload: FormData | ISalesPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.post<
                    IApiResponse<ISale>
                >("/sales/create", payload);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to create sale";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createSale,
        loading,
        error,
    };
}

export function useUpdateSale() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const updateSale = async (
        id: string,
        payload:
            | FormData
            | IUpdateSalesPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.patch<
                    IApiResponse<ISale>
                >(
                    `/sales/update/${id}`,
                    payload
                );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to update sale";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateSale,
        loading,
        error,
    };
}

export function useUpdateSaleStatus() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const updateSaleStatus = async (
        id: string,
        payload: IUpdateSalesStatusPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.patch<
                    IApiResponse<ISale>
                >(
                    `/sales/status-update/${id}`,
                    payload
                );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to update sale status";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateSaleStatus,
        loading,
        error,
    };
}

export function useDeleteSale() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const deleteSale = async (
        id: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.delete<
                    IApiResponse<ISale>
                >(`/sales/delete/${id}`);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to delete sale";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteSale,
        loading,
        error,
    };
}