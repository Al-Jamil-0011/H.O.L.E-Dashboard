'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import { IApiResponse, IPaginationMeta, ISupport, ISupportQuery, ISupportResponse } from "./interface";
import useApi from "@/hooks/use-api";


export function useSupports() {
    const [supports, setSupports] = useState<ISupport[]>([]);
    const [meta, setMeta] = useState<IPaginationMeta | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState<ISupportQuery>({
        page: 1,
        limit: 10,
        searchTerm: "",
    });

    const fetchSupports = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            params.append("page", String(query.page));
            params.append("limit", String(query.limit));

            if (query.searchTerm) {
                params.append("searchTerm", query.searchTerm);
            }

            const response = await useApi.get<
                IApiResponse<ISupportResponse>
            >(`/support/get-all?${params.toString()}`);

            setSupports(response?.data?.data?.results || []);
            setMeta(response?.data?.data?.meta || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch supports";

            setError(message);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 400);
        }
    }, [query]);

    useEffect(() => {
        fetchSupports();
    }, [fetchSupports]);

    return {
        supports,
        meta,
        loading,
        error,
        query,
        setQuery,
        refetch: fetchSupports,
    };
}