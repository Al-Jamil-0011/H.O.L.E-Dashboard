/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import { IApiResponse, IPaginationMeta, IPractice, IPracticePayload, IPracticeQuery, IPracticeResponse, IUpdatePracticePayload } from "./interface";

export function usePractices() {
    const [practices, setPractices] =
        useState<IPractice[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IPracticeQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchPractices =
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

                const response =
                    await useApi.get<
                        IApiResponse<IPracticeResponse>
                    >(
                        `/practice/get-all?${params.toString()}`
                    );

                setPractices(
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
                    "Failed to fetch practices";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchPractices();
    }, [fetchPractices]);

    return {
        practices,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchPractices,
    };
}

export function useSinglePractice(
    id?: string
) {
    const [practice, setPractice] =
        useState<IPractice | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchPractice =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IPractice>
                    >(`/practice/find/${id}`);

                setPractice(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch practice";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchPractice();
    }, [fetchPractice]);

    return {
        practice,
        loading,
        error,
        refetch: fetchPractice,
    };
}

export function useCreatePractice() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const createPractice = async (
        payload: IPracticePayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.post<
                    IApiResponse<IPractice>
                >("/practice/create", payload);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to create practice";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createPractice,
        loading,
        error,
    };
}


export function useUpdatePractice() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const updatePractice = async (
        id: string,
        payload: IUpdatePracticePayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.patch<
                    IApiResponse<IPractice>
                >(
                    `/practice/update/${id}`,
                    payload
                );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to update practice";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updatePractice,
        loading,
        error,
    };
}

export function useDeletePractice() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const deletePractice = async (
        id: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.delete<
                    IApiResponse<IPractice>
                >(`/practice/delete/${id}`);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to delete practice";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        deletePractice,
        loading,
        error,
    };
}