
import { useCallback, useEffect, useState } from "react";

import useApi from "@/hooks/use-api";

import {
    IApiResponse,
    IInventoryApiResponse,
    IInventoryItem,
    IInventoryQuery,
    IInventorySummary,
    IPaginationMeta,
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

export function useAllInventory() {
    const [inventory, setInventory] = useState<IInventoryItem[]>([]);
    const [meta, setMeta] = useState<IPaginationMeta | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState<IInventoryQuery>({
        page: 1,
        limit: 10,
        searchTerm: "",
        category: "",
        facility: "",
        productStatus: "",
    });

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { page, limit, searchTerm, category, facility, productStatus } =
                query;

            const params = new URLSearchParams();

            params.append("page", String(page));
            params.append("limit", String(limit));

            if (searchTerm) params.append("searchTerm", searchTerm);
            if (category) params.append("category", category);
            if (facility) params.append("facility", facility);
            if (productStatus) params.append("productStatus", productStatus);

            const response = await useApi.get<
                IApiResponse<IInventoryApiResponse["data"]>
            >(`/meta/inventory/get-all?${params.toString()}`);

            setInventory(response?.data?.data?.results || []);
            setMeta(response?.data?.data?.meta || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch inventory";

            setError(message);
        } finally {
            setLoading(false);
            // setTimeout(() => {
            //     setLoading(false);
            // }, 400);
        }
    }, [query]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    return {
        inventory,
        meta,
        loading,
        error,

        query,
        setQuery,

        refetch: fetchInventory,
    };
}

export function useSingleInventory(id: string) {
    const [inventory, setInventory] = useState<IInventoryItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await useApi.get<IApiResponse<IInventoryItem>>(`/meta/inventory/find/${id}`);

            setInventory(response?.data?.data || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch inventory";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    return {
        inventory,
        loading,
        error,
        refetch: fetchInventory,
    };
}