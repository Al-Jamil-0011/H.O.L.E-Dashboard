import { useCallback, useEffect, useState } from "react";
import useApi from "./../../use-api/index";

import {
    IApiResponse,
    IPaginationMeta,
    IPurchaseOrder,
    IPurchaseOrderQuery,
    IPurchaseOrderResponse,
    IPurchaseOrderSummary,
    IUpdatePurchaseOrderPayload,
} from "./interface";



export function usePurchaseOrderSummary() {
    const [summary, setSummary] =
        useState<IPurchaseOrderSummary | null>(
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
                        IApiResponse<IPurchaseOrderSummary>
                    >(
                        "/purchase-order/summary"
                    );

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch purchase order summary";

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



export function usePurchaseOrders() {
    const [purchaseOrders, setPurchaseOrders] =
        useState<IPurchaseOrder[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IPurchaseOrderQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchPurchaseOrders =
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

                if (query.orderType) {
                    params.append(
                        "orderType",
                        query.orderType
                    );
                }

                const response =
                    await useApi.get<
                        IApiResponse<IPurchaseOrderResponse>
                    >(
                        `/purchase-order/get-all?${params.toString()}`
                    );

                setPurchaseOrders(
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
                    "Failed to fetch purchase orders";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchPurchaseOrders();
    }, [fetchPurchaseOrders]);

    return {
        purchaseOrders,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchPurchaseOrders,
    };
}


export function useSinglePurchaseOrder(
    id?: string
) {
    const [purchaseOrder, setPurchaseOrder] =
        useState<IPurchaseOrder | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchPurchaseOrder =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IPurchaseOrder>
                    >(
                        `/purchase-order/find/${id}`
                    );

                setPurchaseOrder(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch purchase order";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchPurchaseOrder();
    }, [fetchPurchaseOrder]);

    return {
        purchaseOrder,
        loading,
        error,
        refetch: fetchPurchaseOrder,
    };
}



export function useCreatePurchaseOrder() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const createPurchaseOrder = async (
        payload: IUpdatePurchaseOrderPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const formData =
                new FormData();

            Object.entries(payload).forEach(
                ([key, value]) => {
                    if (
                        value === undefined ||
                        value === null
                    ) {
                        return;
                    }

                    // multiple files
                    if (
                        key === "documents" &&
                        Array.isArray(value)
                    ) {
                        value.forEach((file) => {
                            formData.append(
                                "documents",
                                file
                            );
                        });

                        return;
                    }

                    // single file
                    if (
                        value instanceof File
                    ) {
                        formData.append(
                            key,
                            value
                        );

                        return;
                    }

                    // object
                    if (
                        typeof value ===
                        "object"
                    ) {
                        formData.append(
                            key,
                            JSON.stringify(
                                value
                            )
                        );

                        return;
                    }

                    formData.append(
                        key,
                        String(value)
                    );
                }
            );

            const response =
                await useApi.post<
                    IApiResponse<IPurchaseOrder>
                >(
                    "/purchase-order/create",
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
                "Failed to create purchase order";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createPurchaseOrder,
        loading,
        error,
    };
}



export function useUpdatePurchaseOrder() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const updatePurchaseOrder = async (
        id: string,
        payload: IUpdatePurchaseOrderPayload
    ) => {
        setLoading(true);
        setError(null);

        try {
            const formData =
                new FormData();

            Object.entries(payload).forEach(
                ([key, value]) => {
                    if (
                        value === undefined ||
                        value === null
                    ) {
                        return;
                    }

                    // multiple files
                    if (
                        key === "documents" &&
                        Array.isArray(value)
                    ) {
                        value.forEach((file) => {
                            formData.append(
                                "documents",
                                file
                            );
                        });

                        return;
                    }

                    // single file
                    if (
                        value instanceof File
                    ) {
                        formData.append(
                            key,
                            value
                        );

                        return;
                    }

                    // object
                    if (
                        typeof value ===
                        "object"
                    ) {
                        formData.append(
                            key,
                            JSON.stringify(
                                value
                            )
                        );

                        return;
                    }

                    formData.append(
                        key,
                        String(value)
                    );
                }
            );

            const response =
                await useApi.patch<
                    IApiResponse<IPurchaseOrder>
                >(
                    `/purchase-order/update/${id}`,
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
                "Failed to update purchase order";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updatePurchaseOrder,
        loading,
        error,
    };
}



export function useSendPurchaseOrderMail() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const sendPurchaseOrderMail =
        async (id: string) => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.patch<
                        IApiResponse<{
                            message: string;
                        }>
                    >(
                        `/purchase-order/send-to-mail/${id}`
                    );

                return response?.data;
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to send vendor mail";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        };

    return {
        sendPurchaseOrderMail,
        loading,
        error,
    };
}