import useApi from "@/hooks/use-api";
import { useCallback, useEffect, useState } from "react";
import {
    IApiResponse,
    IPaginationMeta,
    IUser,
    IUsersQuery,
    IUsersResponse,
    UserStatus,
    IChangeStatusPayload,
    IUserSummary
} from "./interface";

export function useUsers() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [meta, setMeta] = useState<IPaginationMeta | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState<IUsersQuery>({
        page: 1,
        limit: 10,
        searchTerm: "",
        role: "",
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { page, limit, searchTerm, role } = query;

            const params = new URLSearchParams();

            params.append("page", String(page));
            params.append("limit", String(limit));

            if (searchTerm) {
                params.append("searchTerm", searchTerm);
            }

            if (role) {
                params.append("role", role);
            }

            const response = await useApi.get<IApiResponse<IUsersResponse>>(
                `/user/get-all?${params.toString()}`
            );

            setUsers(response?.data?.data?.results || []);
            setMeta(response?.data?.data?.meta || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message || "Failed to fetch users";

            setError(message);
        } finally {
            setLoading(false);
            // setTimeout(() => {
            //     setLoading(false);
            // }, 400);
        }
    }, [query]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        meta,
        loading,
        error,

        query,
        setQuery,

        refetch: fetchUsers,
    };
}


export function useSingleUser(id?: string) {
    const [user, setUser] = useState<IUser | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSingleUser = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await useApi.get<IApiResponse<IUser>>(
                `/user/find/${id}`
            );

            setUser(response?.data?.data || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch single user";

            setError(message);
        } finally {
            setLoading(false);
            // setTimeout(() => {
            //     setLoading(false);
            // }, 400);
        }
    }, [id]);

    useEffect(() => {
        fetchSingleUser();
    }, [fetchSingleUser]);

    return {
        user,
        loading,
        error,
        refetch: fetchSingleUser,
    };
}

export function useUserSummary() {
    const [summary, setSummary] = useState<IUserSummary | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await useApi.get<IApiResponse<IUserSummary>>(
                `/user/overview`
            );

            setSummary(response?.data?.data || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch user summary";

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


export function useMyProfile() {
    const [profile, setProfile] = useState<IUser | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await useApi.get<IApiResponse<IUser>>(
                "/user/get-my-profile"
            );

            setProfile(response?.data?.data || null);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to fetch profile";

            setError(message);
        } finally {
            setLoading(false);
            // setTimeout(() => {
            //     setLoading(false);
            // }, 400);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
    };
}



export function useUpdateProfile() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateProfile = async (payload: FormData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await useApi.patch<IApiResponse<IUser>>(
                "/user/update-my-profile",
                payload
            );

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to update profile";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateProfile,
        loading,
        error,
    };
}


export function useChangeUserStatus() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const changeUserStatus = async (
        id: string,
        status: UserStatus
    ) => {
        setLoading(true);
        setError(null);

        try {
            const payload: IChangeStatusPayload = {
                status,
            };

            const response = await useApi.patch<
                IApiResponse<IUser>
            >(`/user/change-status/${id}`, payload);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to change status";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        changeUserStatus,
        loading,
        error,
    };
}


export function useDeleteUser() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteUser = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await useApi.delete<
                IApiResponse<IUser>
            >(`/user/delete/${id}`);

            return response?.data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                "Failed to delete user";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteUser,
        loading,
        error,
    };
}