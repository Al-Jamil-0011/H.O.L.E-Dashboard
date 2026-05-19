'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import {
    IApiResponse,
    IPaginationMeta,
    ISurgery,
    ISurgeryPayload,
    ISurgeryQuery,
    ISurgeryResponse,
    IUpdateSurgeryPayload,
} from "./interface";
import useApi from "@/hooks/use-api";

export function useSurgeries() {
    const [surgeries, setSurgeries] =
        useState<ISurgery[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<ISurgeryQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchSurgeries =
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
                        IApiResponse<ISurgeryResponse>
                    >(
                        `/surgery/get-all?${params.toString()}`
                    );

                setSurgeries(
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
                    "Failed to fetch surgeries";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchSurgeries();
    }, [fetchSurgeries]);

    return {
        surgeries,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchSurgeries,
    };
}

export function useSingleSurgery(
    id?: string
) {
    const [surgery, setSurgery] =
        useState<ISurgery | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchSurgery =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<ISurgery>
                    >(`/surgery/find/${id}`);

                setSurgery(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch surgery";

                setError(message);
            } finally {
                setLoading(false);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchSurgery();
    }, [fetchSurgery]);

    return {
        surgery,
        loading,
        error,
        refetch: fetchSurgery,
    };
}

export function useCreateSurgery() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const createSurgery = async (
        payload: ISurgeryPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const formData =
                new FormData();

            formData.append(
                "physician",
                payload.physician
            );

            formData.append(
                "patientId",
                payload.patientId
            );

            formData.append(
                "facility",
                payload.facility
            );

            formData.append(
                "dateOfSurgery",
                payload.dateOfSurgery
            );

            formData.append(
                "surgeryType",
                payload.surgeryType
            );

            if (payload.screws) {
                formData.append(
                    "screws",
                    payload.screws
                );
            }

            if (payload.plates) {
                formData.append(
                    "plates",
                    payload.plates
                );
            }

            if (payload.biologics) {
                formData.append(
                    "biologics",
                    payload.biologics
                );
            }

            if (
                payload.rodsOrconnectors
            ) {
                formData.append(
                    "rodsOrconnectors",
                    payload.rodsOrconnectors
                );
            }

            if (payload.implants) {
                formData.append(
                    "implants",
                    payload.implants
                );
            }

            if (payload.caseNotes) {
                formData.append(
                    "caseNotes",
                    payload.caseNotes
                );
            }

            if (payload.sticker) {
                formData.append(
                    "sticker",
                    payload.sticker
                );
            }

            if (payload.appre) {
                formData.append(
                    "appre",
                    payload.appre
                );
            }

            if (payload.appost) {
                formData.append(
                    "appost",
                    payload.appost
                );
            }

            if (payload.lateralpre) {
                formData.append(
                    "lateralpre",
                    payload.lateralpre
                );
            }

            if (payload.lateralpost) {
                formData.append(
                    "lateralpost",
                    payload.lateralpost
                );
            }

            if (
                payload.notes &&
                payload.notes.length > 0
            ) {
                payload.notes.forEach(
                    (file) => {
                        formData.append(
                            "notes",
                            file
                        );
                    }
                );
            }

            const response =
                await useApi.post<
                    IApiResponse<ISurgery>
                >(
                    "/surgery/create",
                    formData
                );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to create surgery";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createSurgery,
        loading,
        error,
    };
}

export function useUpdateSurgery() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const updateSurgery = async (
        id: string,
        payload: IUpdateSurgeryPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const formData =
                new FormData();

            if (payload.physician) {
                formData.append(
                    "physician",
                    payload.physician
                );
            }

            if (payload.patientId) {
                formData.append(
                    "patientId",
                    payload.patientId
                );
            }

            if (payload.facility) {
                formData.append(
                    "facility",
                    payload.facility
                );
            }

            if (
                payload.dateOfSurgery
            ) {
                formData.append(
                    "dateOfSurgery",
                    payload.dateOfSurgery
                );
            }

            if (
                payload.surgeryType
            ) {
                formData.append(
                    "surgeryType",
                    payload.surgeryType
                );
            }

            if (payload.screws) {
                formData.append(
                    "screws",
                    payload.screws
                );
            }

            if (payload.plates) {
                formData.append(
                    "plates",
                    payload.plates
                );
            }

            if (
                payload.rodsOrconnectors
            ) {
                formData.append(
                    "rodsOrconnectors",
                    payload.rodsOrconnectors
                );
            }

            if (payload.implants) {
                formData.append(
                    "implants",
                    payload.implants
                );
            }

            if (payload.caseNotes) {
                formData.append(
                    "caseNotes",
                    payload.caseNotes
                );
            }

            if (payload.sticker) {
                formData.append(
                    "sticker",
                    payload.sticker
                );
            }

            if (payload.appre) {
                formData.append(
                    "appre",
                    payload.appre
                );
            }

            if (payload.appost) {
                formData.append(
                    "appost",
                    payload.appost
                );
            }

            if (payload.lateralpre) {
                formData.append(
                    "lateralpre",
                    payload.lateralpre
                );
            }

            if (payload.lateralpost) {
                formData.append(
                    "lateralpost",
                    payload.lateralpost
                );
            }

            if (
                payload.notes &&
                payload.notes.length > 0
            ) {
                payload.notes.forEach(
                    (file) => {
                        formData.append(
                            "notes",
                            file
                        );
                    }
                );
            }

            const response =
                await useApi.patch<
                    IApiResponse<ISurgery>
                >(
                    `/surgery/update/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to update surgery";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateSurgery,
        loading,
        error,
    };
}

export function useDeleteSurgery() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const deleteSurgery = async (
        id: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.delete<
                    IApiResponse<ISurgery>
                >(`/surgery/delete/${id}`);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to delete surgery";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteSurgery,
        loading,
        error,
    };
}