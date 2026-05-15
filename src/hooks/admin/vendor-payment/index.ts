import { useCallback, useEffect, useState } from "react";
import { IPaginationMeta, IVendorPayment, IVendorPaymentQuery, IVendorPaymentResponse, IVendorPaymentSummary } from "./interface";
import useApi from "@/hooks/use-api";
import { IApiResponse } from "../commissions/interface";




export function useVendorPaymentsSummary() {
    const [summary, setSummary] =
        useState<IVendorPaymentSummary | null>(
            null
        );

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchVendorPaymentsSummary =
        useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IVendorPaymentSummary>
                    >(
                        `/sales/vendor-payment/summary`
                    );

                setSummary(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch vendor payments summary";

                setError(message);
            } finally {
                setLoading(false);
                // setTimeout(() => {
                //     setLoading(false);
                // }, 300);
            }
        }, []);

    useEffect(() => {
        fetchVendorPaymentsSummary();
    }, [fetchVendorPaymentsSummary]);

    return {
        summary,
        loading,
        error,
        refetch: fetchVendorPaymentsSummary,
    };
}




export function useVendorPayments() {
    const [payments, setPayments] = useState<IVendorPayment[]>([]);
    const [meta, setMeta] = useState<IPaginationMeta | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState<IVendorPaymentQuery>({
        page: 1,
        limit: 10,
        searchTerm: "",
        status: "",
    });

    const fetchVendorPayments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            params.append("page", String(query.page));
            params.append("limit", String(query.limit));

            if (query.searchTerm) {
                params.append("searchTerm", query.searchTerm);
            }

            if (query.status) {
                params.append("status", query.status);
            }

            const response = await useApi.get<
                IApiResponse<IVendorPaymentResponse>
            >(`/sales/vendor-payment/all?${params.toString()}`);

            setPayments(response?.data?.data?.results || []);
            setMeta(response?.data?.data?.meta || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch vendor payments";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        fetchVendorPayments();
    }, [fetchVendorPayments]);

    return {
        payments,
        meta,
        loading,
        error,
        query,
        setQuery,
        refetch: fetchVendorPayments,
    };
}