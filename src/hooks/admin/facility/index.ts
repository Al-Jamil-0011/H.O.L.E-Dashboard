/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import { IApiResponse, IFacility, IFacilityPayload, IFacilityQuery, IFacilityResponse, IPaginationMeta, IUpdateFacilityPayload } from "./interface";


export function useFacilities() {
    const [facilities, setFacilities] =
        useState<IFacility[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IFacilityQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchFacilities =
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
                        IApiResponse<IFacilityResponse>
                    >(
                        `/facility/get-all?${params.toString()}`
                    );

                setFacilities(
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
                    "Failed to fetch facilities";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);

    return {
        facilities,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchFacilities,
    };
}


export function useSingleFacility(
    id?: string
) {
    const [facility, setFacility] =
        useState<IFacility | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchFacility =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IFacility>
                    >(`/facility/find/${id}`);

                setFacility(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch facility";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchFacility();
    }, [fetchFacility]);

    return {
        facility,
        loading,
        error,
        refetch: fetchFacility,
    };
}


export function useCreateFacility() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const createFacility = async (
        payload: IFacilityPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.post<
                    IApiResponse<IFacility>
                >("/facility/create", payload);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to create facility";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createFacility,
        loading,
        error,
    };
}


export function useUpdateFacility() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const updateFacility = async (
        id: string,
        payload: IUpdateFacilityPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.patch<
                    IApiResponse<IFacility>
                >(
                    `/facility/update/${id}`,
                    payload
                );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to update facility";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateFacility,
        loading,
        error,
    };
}


export function useDeleteFacility() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const deleteFacility = async (
        id: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.delete<
                    IApiResponse<IFacility>
                >(`/facility/delete/${id}`);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to delete facility";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteFacility,
        loading,
        error,
    };
}