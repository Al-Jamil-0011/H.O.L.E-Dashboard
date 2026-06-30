"use cleint";
import { useCallback, useEffect, useState } from "react";
import { IApiResponse, IAssignRepresentativePayload, IManagerRepresentative, IPaginationMeta, IRepresentativeUser, IRepresentativeUserQuery, IRepresentativeUserResponse } from "./interface";
import useApi from "@/hooks/use-api";


export function useRepresentativeUsers() {
    const [representativeUsers, setRepresentativeUsers] =
        useState<IRepresentativeUser[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IRepresentativeUserQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchRepresentativeUsers =
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
                        IApiResponse<IRepresentativeUserResponse>
                    >(
                        `/reps-user/get-all?${params.toString()}`
                    );

                setRepresentativeUsers(
                    response?.data?.data?.results || []
                );

                setMeta(
                    response?.data?.data?.meta || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch representative users";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchRepresentativeUsers();
    }, [fetchRepresentativeUsers]);

    return {
        representativeUsers,
        meta,
        loading,
        error,
        query,
        setQuery,
        refetch: fetchRepresentativeUsers,
    };
}

export function useManagerRepresentatives(
    managerId: string
) {
    const [representatives, setRepresentatives] =
        useState<IManagerRepresentative[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchRepresentatives =
        useCallback(async () => {
            if (!managerId) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IManagerRepresentative[]>
                    >(
                        `/reps-user/manager/${managerId}/representatives`
                    );

                setRepresentatives(
                    response?.data?.data || []
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch representatives";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [managerId]);

    useEffect(() => {
        fetchRepresentatives();
    }, [fetchRepresentatives]);

    return {
        representatives,

        loading,
        error,

        refetch: fetchRepresentatives,
    };
}


export function useAssignRepresentative() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<boolean>(false);

    const assignRepresentative = async (
        payload: IAssignRepresentativePayload
    ) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response =
                await useApi.post<
                    IApiResponse<unknown>
                >(
                    "/reps-user/assign-representative",
                    payload
                );

            setSuccess(true);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to assign representative";

            setError(message);

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        assignRepresentative,

        loading,
        error,
        success,
    };
}


export function useRemoveRepresentative() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<boolean>(false);

    const removeRepresentative = async (
        payload: IAssignRepresentativePayload
    ) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response =
                await useApi.delete<
                    IApiResponse<unknown>
                >(
                    "/reps-user/remove-representatives",
                    {
                        data: payload,
                    }
                );

            setSuccess(true);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to remove representative";

            setError(message);

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        removeRepresentative,

        loading,
        error,
        success,
    };
}