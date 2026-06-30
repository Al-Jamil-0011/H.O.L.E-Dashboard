'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/use-api";
import { IAgingReport, IAgingReportQuery, IAgingReportResponse, IAgingReportSummary, IApiResponse, IPaginationMeta } from "./interface";



export function useAgingReportSummary() {
    const [summary, setSummary] =
        useState<IAgingReportSummary | null>(
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
                        IApiResponse<IAgingReportSummary>
                    >(
                        `/commission/aging-report/overview`
                    );

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch aging report summary";

                setError(message);
            } finally {
                setLoading(false);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 300);
            }
        }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        summary,
        loading,
        error,
        refetch: fetchSummary,
    };
}


export function useAgingReports() {
    const [agingReports, setAgingReports] =
        useState<IAgingReport[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IAgingReportQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
            status: ""
        });

    const fetchAgingReports =
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
                        IApiResponse<IAgingReportResponse>
                    >(
                        `/commission/aging-report?${params.toString()}`
                    );

                setAgingReports(
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
                    "Failed to fetch aging reports";

                setError(message);
            } finally {
                setLoading(false);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 300);
            }
        }, [query]);

    useEffect(() => {
        fetchAgingReports();
    }, [fetchAgingReports]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        agingReports,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchAgingReports,
    };
}