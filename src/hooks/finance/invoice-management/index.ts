"use client";
import { useCallback, useEffect, useState } from "react";
import { IInvoice, IInvoiceQuery, IInvoiceResponse, IInvoiceSummary } from "./interface";
import { IApiResponse, IPaginationMeta } from "@/hooks/common/interface";
import useApi from "@/hooks/use-api";
import { ISale } from "@/hooks/admin/sales/interface";


export function useInvoiceSummary() {
    const [summary, setSummary] =
        useState<IInvoiceSummary | null>(null);

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
                        IApiResponse<IInvoiceSummary>
                    >("/sales/invoice/summary");

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch invoice summary";

                setError(message);
            } finally {
                setLoading(false);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 400);
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

export function useInvoices() {
    const [invoices, setInvoices] =
        useState<IInvoice[]>([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IInvoiceQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
        });

    const fetchInvoices =
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

                if (query.salesType) {
                    params.append(
                        "salesType",
                        query.salesType
                    );
                }

                const response =
                    await useApi.get<
                        IApiResponse<IInvoiceResponse>
                    >(
                        `/sales/invoice-all?${params.toString()}`
                    );

                setInvoices(
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
                    "Failed to fetch invoices";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [query]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    return {
        invoices,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchInvoices,
    };
}


export function useSingleInvoice(
    id?: string
) {
    const [invoice, setInvoice] =
        useState<ISale | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchInvoice =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<ISale>
                    >(`/sales/find/${id}`);

                setInvoice(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch sale";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchInvoice();
    }, [fetchInvoice]);

    return {
        invoice,
        loading,
        error,
        refetch: fetchInvoice,
    };
}
