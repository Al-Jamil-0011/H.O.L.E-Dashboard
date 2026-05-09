/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import useApi from "./../../use-api/index";
import { IApiResponse, IPaginationMeta, IUpdateVendorPayload, IVendor, IVendorPayload, IVendorQuery, IVendorResponse } from "./interface";

export function useVendors() {
    const [vendors, setVendors] = useState<
        IVendor[]
    >([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IVendorQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchVendors =
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
                        IApiResponse<IVendorResponse>
                    >(
                        `/vendor/get-all?${params.toString()}`
                    );

                setVendors(
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
                    "Failed to fetch vendors";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    return {
        vendors,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchVendors,
    };
}


export function useSingleVendor(
    id?: string
) {
    const [vendor, setVendor] =
        useState<IVendor | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchVendor =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IVendor>
                    >(`/vendor/find/${id}`);

                setVendor(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch vendor";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchVendor();
    }, [fetchVendor]);

    return {
        vendor,
        loading,
        error,
        refetch: fetchVendor,
    };
}

export function useCreateVendor() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const createVendor = async (
        payload: IVendorPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();

            formData.append(
                "name",
                payload.name
            );

            formData.append(
                "email",
                payload.email
            );

            formData.append(
                "phoneNumber",
                payload.phoneNumber
            );

            if (payload.companyName) {
                formData.append(
                    "companyName",
                    payload.companyName
                );
            }

            if (payload.faxNumber) {
                formData.append(
                    "faxNumber",
                    payload.faxNumber
                );
            }

            if (payload.notes) {
                formData.append(
                    "notes",
                    payload.notes
                );
            }

            if (payload.profile) {
                formData.append(
                    "profile",
                    payload.profile
                );
            }

            const response =
                await useApi.post<
                    IApiResponse<IVendor>
                >("/vendor/create", formData);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to create vendor";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createVendor,
        loading,
        error,
    };
}

export function useUpdateVendor() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const updateVendor = async (
        id: string,
        payload: IUpdateVendorPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();

            if (payload.name) {
                formData.append(
                    "name",
                    payload.name
                );
            }

            if (payload.email) {
                formData.append(
                    "email",
                    payload.email
                );
            }

            if (payload.phoneNumber) {
                formData.append(
                    "phoneNumber",
                    payload.phoneNumber
                );
            }

            if (payload.companyName) {
                formData.append(
                    "companyName",
                    payload.companyName
                );
            }

            if (payload.faxNumber) {
                formData.append(
                    "faxNumber",
                    payload.faxNumber
                );
            }

            if (payload.notes) {
                formData.append(
                    "notes",
                    payload.notes
                );
            }

            if (payload.profile) {
                formData.append(
                    "profile",
                    payload.profile
                );
            }

            const response =
                await useApi.patch<
                    IApiResponse<IVendor>
                >(
                    `/vendor/update/${id}`,
                    formData
                );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to update vendor";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateVendor,
        loading,
        error,
    };
}

export function useDeleteVendor() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const deleteVendor = async (
        id: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.delete<
                    IApiResponse<IVendor>
                >(`/vendor/delete/${id}`);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to delete vendor";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteVendor,
        loading,
        error,
    };
}