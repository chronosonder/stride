import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import ProjectHeader from '../components/projects/ProjectHeader';
import TaskList from '../components/tasks/TaskList';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskDrawer from '../components/tasks/TaskDrawer';
import { useProject } from '../hooks/useProjects';
import {
    useTasks,
    useCreateTask,
    useCreateSubtask,
    useToggleTaskDone,
    useDeleteTask,
} from '../hooks/useTasks';

export default function ProjectPage() {
    const { id } = useParams();
    const projectId = parseInt(id, 10);

    const { data: project, isLoading: isProjectLoading, isError: isProjectError, error: projectError } = useProject(projectId);
    const { data: tasks = [], isLoading: isTasksLoading, isError: isTasksError, error: tasksError } = useTasks(projectId);
    const createTaskMutation = useCreateTask(projectId);

    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const createSubtaskMutation = useCreateSubtask(projectId);
    const toggleDoneMutation = useToggleTaskDone(projectId);
    const deleteTaskMutation = useDeleteTask(projectId);

    function handleToggleDone(task) {
        toggleDoneMutation.mutate({
            taskId: task.id,
            nextStatus: task.status === 'done' ? 'to-do' : 'done',
        });
    }

    function handleCreateSubtask(parentTask, data) {
        createSubtaskMutation.mutate({ parentTaskId: parentTask.id, data });
    }

    // Always pass the live version of the task from the cache so the
    // drawer reflects edits without needing to close and reopen
    const drawerTask = selectedTask
        ? (tasks.find((t) => t.id === selectedTask.id) ?? selectedTask)
        : null;

    function handleOpenTaskDialog() {
        createTaskMutation.reset();
        setTaskDialogOpen(true);
    }

    function handleCloseTaskDialog() {
        if (createTaskMutation.isPending) return;
        setTaskDialogOpen(false);
    }

    function handleCreateTask(data) {
        createTaskMutation.mutate(data, {
            onSuccess: () => setTaskDialogOpen(false),
        });
    }

    function handleTaskClick(task) {
        setSelectedTask(task);
        setDrawerOpen(true);
    }

    function handleDrawerClose() {
        setDrawerOpen(false);
    }

    function handleDeleteSubtask(_parent, subtask) {
        deleteTaskMutation.mutate(subtask.id);
    }

    if (isProjectLoading) {
        return (
            <Box display="flex" justifyContent="center" pt={8}>
                <CircularProgress />
            </Box>
        );
    }

    if (isProjectError) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {projectError?.message ?? 'Failed to load project.'}
            </Alert>
        );
    }

    return (
        <Stack spacing={3}>
            <ProjectHeader project={project} />

            {/* Task section */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Tasks</Typography>
                <Button variant="contained" size="small" onClick={handleOpenTaskDialog}>
                    New task
                </Button>
            </Box>

            {isTasksError && (
                <Alert severity="error">
                    {tasksError?.message ?? 'Failed to load tasks.'}
                </Alert>
            )}

            {isTasksLoading && (
                <Stack spacing={1.5}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} variant="outlined">
                            <CardContent>
                                <Skeleton width="50%" height={22} />
                                <Skeleton width="80%" />
                                <Box display="flex" justifyContent="space-between" mt={1}>
                                    <Skeleton variant="rounded" width={60} height={22} />
                                    <Skeleton variant="rounded" width={70} height={22} />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            {!isTasksLoading && !isTasksError && tasks.length === 0 && (
                <Box
                    textAlign="center"
                    py={6}
                    sx={{
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        No tasks yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Break your project down into tasks to get started.
                    </Typography>
                    <Button variant="contained" size="small" onClick={handleOpenTaskDialog}>
                        Create your first task
                    </Button>
                </Box>
            )}

            {!isTasksLoading && !isTasksError && tasks.length > 0 && (
                <TaskList
                    tasks={tasks}
                    onTaskClick={handleTaskClick}
                    onToggleDone={handleToggleDone}
                    onToggleSubtaskDone={(_parent, sub) => handleToggleDone(sub)}
                    onCreateSubtask={handleCreateSubtask}
                    isCreatingSubtask={createSubtaskMutation.isPending}
                    onDeleteSubtask={handleDeleteSubtask}
                />
            )}

            <TaskFormDialog
                open={taskDialogOpen}
                onClose={handleCloseTaskDialog}
                onSubmit={handleCreateTask}
                isSubmitting={createTaskMutation.isPending}
                error={createTaskMutation.error?.message ?? null}
            />

            <TaskDrawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                task={drawerTask}
                projectId={projectId}
                onToggleDone={handleToggleDone}
                onToggleSubtaskDone={(_parent, subtask) => handleToggleDone(subtask)}
                onCreateSubtask={handleCreateSubtask}
                isCreatingSubtask={createSubtaskMutation.isPending}
                onDeleteSubtask={handleDeleteSubtask}
            />
        </Stack>
    );
}
