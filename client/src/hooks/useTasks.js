import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from '../api/tasks';

export function useTasks(projectId) {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => getTasks(projectId),
        enabled: !!projectId,
    });
}

export function useCreateTask(projectId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createTask(projectId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        },
    });
}

export function useUpdateTask(projectId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, updates }) => updateTask(projectId, taskId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        },
    });
}

export function useDeleteTask(projectId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId) => deleteTask(projectId, taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        },
    });
}
