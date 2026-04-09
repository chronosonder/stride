import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from '../api/tasks';

/**
 * Transform the flat task list from the API into a tree.
 */
function groupTasks(flatTasks) {
    if (!Array.isArray(flatTasks)) return [];

    const tasksByParent = new Map();
    const parentTasks = [];

    for (const task of flatTasks) {
        if (task.parentTaskId == null) {
            parentTasks.push({ ...task, subtasks: [] });
        } else {
            if (!tasksByParent.has(task.parentTaskId)) {
                tasksByParent.set(task.parentTaskId, []);
            }
            tasksByParent.get(task.parentTaskId).push(task);
        }
    }

    for (const parent of parentTasks) {
        const children = tasksByParent.get(parent.id);
        if (children) parent.subtasks = children;
    }

    return parentTasks;
}

export function useTasks(projectId) {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => getTasks(projectId),
        enabled: !!projectId,
        select: groupTasks,
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

/**
 * Create a subtask with an optimistic update. The new subtask is added to the cache immediately with a temporary ID
 * On settle, the query is invalidated and the temp row is replaced by
 * the real one from the refetch.
 */
export function useCreateSubtask(projectId) {
    const queryClient = useQueryClient();
    const queryKey = ['tasks', projectId];

    return useMutation({
        mutationFn: ({ parentTaskId, data }) =>
            createTask(projectId, { ...data, parentTaskId, taskType: 'subtask' }),

        onMutate: async ({ parentTaskId, data }) => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData(queryKey);

            const optimisticSubtask = {
                id: `temp-${Date.now()}`,
                parentTaskId,
                title: data.title,
                description: data.description ?? null,
                status: 'todo',
                taskType: 'subtask',
                dueDate: data.dueDate ?? null,
            };

            queryClient.setQueryData(queryKey, (old) => {
                if (!Array.isArray(old)) return old;
                return [...old, optimisticSubtask];
            });

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
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

/**
 * Delete a task with an optimistic update. The task is removed from
 * the flat cache immediately. on error, the previous state is restored.
 * Works for both top-level tasks and subtasks.
 */
export function useDeleteTask(projectId) {
    const queryClient = useQueryClient();
    const queryKey = ['tasks', projectId];

    return useMutation({
        mutationFn: (taskId) => deleteTask(projectId, taskId),

        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => {
                if (!Array.isArray(old)) return old;
                // Remove the task itself, plus any of its subtasks
                // (in case a parent task is deleted).
                return old.filter(
                    (task) => task.id !== taskId && task.parentTaskId !== taskId
                );
            });

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

// Toggle the task state optimistically, then update on the server
export function useToggleTaskDone(projectId) {
    const queryClient = useQueryClient();
    const queryKey = ['tasks', projectId];

    return useMutation({
        mutationFn: ({ taskId, nextStatus }) =>
            updateTask(projectId, taskId, { status: nextStatus }),

        onMutate: async ({ taskId, nextStatus }) => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old) => {
                if (!Array.isArray(old)) return old;
                return old.map((task) =>
                    task.id === taskId ? { ...task, status: nextStatus } : task
                );
            });

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}