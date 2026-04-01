import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccount, logout as logoutRequest } from '../api/auth';

export function useAuth() {
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['auth'],
        queryFn: getAccount,
        retry: false,
        staleTime: 1000 * 60 * 5, // fetch every 5 minutes
    });

    const isAuthenticated = !!user && !isError;

    async function logout() {
        await logoutRequest();
        queryClient.clear();
    }

    return { user, isLoading, isAuthenticated, logout };
}