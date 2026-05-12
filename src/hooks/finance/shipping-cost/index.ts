'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import { IApiResponse, IPaginationMeta, IShippingCost, IShippingCostQuery, IShippingCostResponse, IShippingCostSummary } from "./interface";



export function useShippingCostSummary() {
    const [summary, setSummary] =
        useState<IShippingCostSummary | null>(
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
                        IApiResponse<IShippingCostSummary>
                    >(
                        `/shipment/shipping-cost/summary`
                    );

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch shipping cost summary";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 300);
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



export function useShippingCosts() {
    const [shippingCosts, setShippingCosts] =
        useState<IShippingCost[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IShippingCostQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchShippingCosts =
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
                        IApiResponse<IShippingCostResponse>
                    >(
                        `/shipment/shipping-cost?${params.toString()}`
                    );

                setShippingCosts(
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
                    "Failed to fetch shipping costs";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            }
        }, [query]);

    useEffect(() => {
        fetchShippingCosts();
    }, [fetchShippingCosts]);

    return {
        shippingCosts,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchShippingCosts,
    };
}