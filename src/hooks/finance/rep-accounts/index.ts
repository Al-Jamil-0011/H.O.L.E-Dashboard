'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import { IApiResponse, IAgingReportSummary, IPaginationMeta, IRepAccount, IRepAccountsQuery, IRepAccountsResponse } from "./interface";



export function useRepAccountsSummary() {
    const [summary, setSummary] =
        useState<IAgingReportSummary | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchRepSummary =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IAgingReportSummary>
                    >(
                        `/rep-accounts/summary`
                    );

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch rep accounts summary";

                setError(message);
            } finally {
                setLoading(false);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 300);
            }
        }, []);

    useEffect(() => {
        fetchRepSummary();
    }, [fetchRepSummary]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        summary,
        loading,
        error,
        refetch: fetchRepSummary,
    };
}


export function useRepAccounts() {
    const [repAccounts, setRepAccounts] =
        useState<IRepAccount[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IRepAccountsQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
            status: ""
        });

    const fetchRepAccounts =
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
                        IApiResponse<IRepAccountsResponse>
                    >(
                        `/rep-accounts/representatives?${params.toString()}`
                    );

                setRepAccounts(
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
                    "Failed to fetch rep accounts";

                setError(message);
            } finally {
                setLoading(false);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 300);
            }
        }, [query]);

    useEffect(() => {
        fetchRepAccounts();
    }, [fetchRepAccounts]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        repAccounts,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchRepAccounts,
    };
}