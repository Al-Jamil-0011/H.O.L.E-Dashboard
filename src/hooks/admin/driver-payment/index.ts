import { useCallback, useEffect, useState } from "react";

import useApi from "@/hooks/use-api";

import {
    IApiResponse,
    IPaginationMeta,
    IShipmentRate,
    IShipmentRatePayload,
    IWithdrawal,
    IWithdrawalQuery,
    IWithdrawalResponse,
    IWithdrawalStatusPayload,
} from "./interface";


export function useShipmentRate() {
    const [shipmentRate, setShipmentRate] =
        useState<IShipmentRate | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchShipmentRate =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IShipmentRate>
                    >("/shipment-rate/get-all");

                setShipmentRate(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch shipment rate";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, []);

    useEffect(() => {
        fetchShipmentRate();
    }, [fetchShipmentRate]);

    return {
        shipmentRate,
        loading,
        error,
        refetch: fetchShipmentRate,
    };
}


export function useCreateOrUpdateShipmentRate() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const createOrUpdateShipmentRate =
        async (
            id: string,
            payload: IShipmentRatePayload
        ) => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.put<
                        IApiResponse<IShipmentRate>
                    >(
                        `/shipment-rate/create-or-update/${id}`,
                        payload
                    );

                return response?.data;
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to update shipment rate";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        };

    return {
        createOrUpdateShipmentRate,
        loading,
        error,
    };
}


export function useWithdrawals(
    defaultStatus: string = "pending"
) {
    const [withdrawals, setWithdrawals] =
        useState<IWithdrawal[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IWithdrawalQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
            status: defaultStatus,
        });

    const fetchWithdrawals =
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
                        IApiResponse<IWithdrawalResponse>
                    >(
                        `/withdrawal/get-all?${params.toString()}`
                    );

                setWithdrawals(
                    response?.data?.data
                        ?.results || []
                );

                setMeta(
                    response?.data?.data?.meta ||
                    null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch withdrawals";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchWithdrawals();
    }, [fetchWithdrawals]);

    return {
        withdrawals,
        meta,
        loading,
        error,
        query,
        setQuery,
        refetch: fetchWithdrawals,
    };
}


export function useSingleWithdrawal(
    id?: string
) {
    const [withdrawal, setWithdrawal] =
        useState<IWithdrawal | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchWithdrawal =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IWithdrawal>
                    >(
                        `/withdrawal/find/${id}`
                    );

                setWithdrawal(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch withdrawal";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchWithdrawal();
    }, [fetchWithdrawal]);

    return {
        withdrawal,
        loading,
        error,
        refetch: fetchWithdrawal,
    };
}

export function useChangeWithdrawalStatus() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const changeWithdrawalStatus =
        async (
            id: string,
            payload: IWithdrawalStatusPayload
        ) => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.patch<
                        IApiResponse<IWithdrawal>
                    >(
                        `/withdrawal/status-change/${id}`,
                        payload
                    );

                return response?.data;
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to change withdrawal status";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        };

    return {
        changeWithdrawalStatus,
        loading,
        error,
    };
}