/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import useApi from "./../../use-api/index";
import { IApiResponse, IExpense, IExpenseQuery, IExpenseResponse, IExpenseSummary, IPaginationMeta, IUpdateExpenseStatusPayload } from "./interface";


export function useExpenseSummary() {
    const [summary, setSummary] =
        useState<IExpenseSummary | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await useApi.get<
                    IApiResponse<IExpenseSummary>
                >("/expense/meta");

            setSummary(response?.data?.data || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch expense summary";

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

export function useExpenses() {
    const [expenses, setExpenses] = useState<
        IExpense[]
    >([]);

    const [meta, setMeta] =
        useState<IPaginationMeta | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const [query, setQuery] =
        useState<IExpenseQuery>({
            page: 1,
            limit: 10,
            searchTerm: "",
            status: "",
            category: "",
            representative: "",
        });

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

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

            if (query.category) {
                params.append(
                    "category",
                    query.category
                );
            }

            if (query.representative) {
                params.append(
                    "representative",
                    query.representative
                );
            }

            const response =
                await useApi.get<
                    IApiResponse<IExpenseResponse>
                >(
                    `/expense/get-all?${params.toString()}`
                );

            setExpenses(
                response?.data?.data?.results || []
            );

            setMeta(
                response?.data?.data?.meta || null
            );
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch expenses";

            setError(message);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 400);
        }
    }, [query]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    return {
        expenses,
        meta,

        loading,
        error,

        query,
        setQuery,

        refetch: fetchExpenses,
    };
}

export function useSingleExpense(
    id?: string
) {
    const [expense, setExpense] =
        useState<IExpense | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchExpense =
        useCallback(async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await useApi.get<
                        IApiResponse<IExpense>
                    >(`/expense/find/${id}`);

                setExpense(
                    response?.data?.data || null
                );
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to fetch expense";

                setError(message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 400);
            }
        }, [id]);

    useEffect(() => {
        fetchExpense();
    }, [fetchExpense]);

    return {
        expense,
        loading,
        error,
        refetch: fetchExpense,
    };
}


export function useUpdateExpenseStatus() {
    const [loading, setLoading] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    const updateExpenseStatus =
        async (
            id: string,
            status: "approved" | "rejected"
        ) => {
            setLoading(true);
            setError(null);

            try {
                const payload: IUpdateExpenseStatusPayload =
                {
                    status,
                };

                const response =
                    await useApi.patch<
                        IApiResponse<IExpense>
                    >(
                        `/expense/status-update/${id}`,
                        payload
                    );

                return response?.data;
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to update expense status";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        };

    return {
        updateExpenseStatus,
        loading,
        error,
    };
}