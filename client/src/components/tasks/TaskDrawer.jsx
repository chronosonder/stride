import { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    Drawer,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TaskFormDialog from './TaskFormDialog';
import AddSubtaskInput from './AddSubtaskInput';
import SubtaskRow from './SubtaskRow';
import ConfirmDialog from '../ConfirmDialog';
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks';

function taskTypeChipProps(taskType) {
    switch (taskType) {
        case 'milestone':
            return { label: 'Milestone', color: 'success' };
        case 'deliverable':
            return { label: 'Deliverable', color: 'secondary' };
        default:
            return { label: 'Task', color: 'default' };
    }
}

function taskStatusChipProps(status) {
    switch (status) {
        case 'in-progress':
            return { label: 'In Progress', color: 'primary' };
        case 'done':
            return { label: 'Done', color: 'success' };
        default:
            return { label: 'To Do', color: 'default' };
    }
}

function formatDueDate(dueDate) {
    if (!dueDate) return null;
    return new Date(dueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const chipSx = { '& .MuiChip-label': { fontWeight: 500 } };

function SectionLabel({ children }) {
    return (
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={0.75}
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}
        >
            {children}
        </Typography>
    );
}

export default function TaskDrawer({
    open,
    onClose,
    task,
    projectId,
    onToggleDone,
    onToggleSubtaskDone,
    onCreateSubtask,
    onDeleteSubtask,
    isCreatingSubtask,
}) {
    const [editOpen, setEditOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const updateTaskMutation = useUpdateTask(projectId);
    const deleteTaskMutation = useDeleteTask(projectId);

    function handleOpenEdit() {
        updateTaskMutation.reset();
        setEditOpen(true);
    }

    function handleCloseEdit() {
        if (updateTaskMutation.isPending) return;
        setEditOpen(false);
    }

    function handleEditSubmit(data) {
        updateTaskMutation.mutate(
            { taskId: task.id, updates: data },
            { onSuccess: () => setEditOpen(false) }
        );
    }

    function handleDeleteConfirm() {
        deleteTaskMutation.mutate(task.id, {
            onSuccess: () => {
                setConfirmOpen(false);
                onClose();
            },
        });
    }

    function handleToggleDone() {
        onToggleDone?.(task);
    }

    function handleSubtaskToggle(subtask) {
        onToggleSubtaskDone?.(task, subtask);
    }

    function handleSubtaskDelete(subtask) {
        onDeleteSubtask?.(task, subtask);
    }

    function handleAddSubtask(title) {
        onCreateSubtask?.(task, { title });
    }

    const typeChip = task ? taskTypeChipProps(task.taskType) : null;
    const statusChip = task ? taskStatusChipProps(task.status) : null;
    const subtasks = task?.subtasks ?? [];
    const completedCount = subtasks.filter((s) => s.status === 'done').length;
    const isDone = task?.status === 'done';

    return (
        <>
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box
                    sx={{
                        width: { xs: '100vw', sm: 440 },
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    {/* Header */}
                    <Box px={2} py={2}>
                        <Box
                            display="flex"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            gap={1}
                            mb={1.5}
                        >
                            <Box
                                display="flex"
                                alignItems="flex-start"
                                gap={0.5}
                                flex={1}
                                minWidth={0}
                            >
                                <Checkbox
                                    size="small"
                                    checked={isDone}
                                    onChange={handleToggleDone}
                                    sx={{ p: 0.5, mt: -0.25 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        wordBreak: 'break-word',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        color: isDone ? 'text.disabled' : 'text.primary',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {task?.title}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={onClose}
                                size="small"
                                sx={{ flexShrink: 0 }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {task && (
                            <Box display="flex" gap={1} flexWrap="wrap" pl={4.5}>
                                <Chip
                                    label={typeChip.label}
                                    color={typeChip.color}
                                    size="small"
                                    sx={chipSx}
                                />
                                <Chip
                                    label={statusChip.label}
                                    color={statusChip.color}
                                    size="small"
                                    variant="outlined"
                                    sx={chipSx}
                                />
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    {/* Content */}
                    <Box p={2} flex={1} overflow="auto">
                        {task && (
                            <Stack spacing={3}>
                                {task.dueDate && (
                                    <Box>
                                        <SectionLabel>Due date</SectionLabel>
                                        <Typography variant="body2">
                                            {formatDueDate(task.dueDate)}
                                        </Typography>
                                    </Box>
                                )}

                                <Box>
                                    <SectionLabel>Description</SectionLabel>
                                    {task.description ? (
                                        <Typography
                                            variant="body2"
                                            sx={{ whiteSpace: 'pre-wrap' }}
                                        >
                                            {task.description}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.disabled">
                                            No description
                                        </Typography>
                                    )}
                                </Box>

                                <Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        mb={0.75}
                                    >
                                        <SectionLabel>Subtasks</SectionLabel>
                                        {subtasks.length > 0 && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {completedCount}/{subtasks.length}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Stack spacing={0.25}>
                                        {subtasks.map((subtask) => (
                                            <SubtaskRow
                                                key={subtask.id}
                                                subtask={subtask}
                                                onToggleDone={handleSubtaskToggle}
                                                onDelete={handleSubtaskDelete}
                                            />
                                        ))}
                                    </Stack>

                                    <Box mt={subtasks.length > 0 ? 0.5 : 0}>
                                        <AddSubtaskInput
                                            onAdd={handleAddSubtask}
                                            isPending={isCreatingSubtask}
                                        />
                                    </Box>
                                </Box>
                            </Stack>
                        )}
                    </Box>

                    {/* Footer actions */}
                    <Divider />
                    <Box
                        p={1.5}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Button
                            color="error"
                            size="small"
                            onClick={() => setConfirmOpen(true)}
                            disabled={deleteTaskMutation.isPending}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleOpenEdit}
                        >
                            Edit
                        </Button>
                    </Box>
                </Box>
            </Drawer>

            {task && (
                <>
                    <TaskFormDialog
                        open={editOpen}
                        onClose={handleCloseEdit}
                        onSubmit={handleEditSubmit}
                        initialValues={task}
                        isSubmitting={updateTaskMutation.isPending}
                        error={updateTaskMutation.error?.message ?? null}
                    />
                    <ConfirmDialog
                        open={confirmOpen}
                        onClose={() => setConfirmOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete task"
                        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
                        confirmLabel="Delete"
                        isLoading={deleteTaskMutation.isPending}
                    />
                </>
            )}
        </>
    );
}