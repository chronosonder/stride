import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Collapse,
    Stack,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubtaskRow from './SubtaskRow';
import AddSubtaskInput from './AddSubtaskInput';

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

function statusStripeColor(status) {
    switch (status) {
        case 'in-progress':
            return 'primary.main';
        case 'done':
            return 'success.main';
        default:
            return 'divider';
    }
}

function formatDueDate(dueDate) {
    if (!dueDate) return null;
    return new Date(dueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}

const chipSx = { '& .MuiChip-label': { fontWeight: 500 } };

export default function TaskCard({
    task,
    onClick,
    onToggleDone,
    onToggleSubtaskDone,
    onCreateSubtask,
    onDeleteSubtask,
    isCreatingSubtask,
}) {
    const subtasks = task.subtasks ?? [];
    const hasSubtasks = subtasks.length > 0;
    const completedCount = subtasks.filter((s) => s.status === 'done').length;

    const [expanded, setExpanded] = useState(hasSubtasks);

    const isDone = task.status === 'done';

    const typeChip = taskTypeChipProps(task.taskType);
    const dueDate = formatDueDate(task.dueDate);

    function handleToggleDone(e) {
        e.stopPropagation();
        onToggleDone?.(task);
    }

    function handleToggleExpand(e) {
        e.stopPropagation();
        setExpanded((v) => !v);
    }

    function handleSubtaskToggle(subtask) {
        onToggleSubtaskDone?.(task, subtask);
    }

    function handleSubtaskDelete(subtask) {
        onDeleteSubtask?.(task, subtask);
    }

    function handleAddSubtask(title) {
        onCreateSubtask?.(task, { title });
        setExpanded(true);
    }

    // Auto-expand when the first subtask is added
    useEffect(() => {
        if (hasSubtasks) setExpanded(true);
    }, [hasSubtasks]);

    return (
        <Card
            variant="outlined"
            sx={{
                borderLeft: '4px solid',
                borderLeftColor: statusStripeColor(task.status),
                transition: 'border-color 0.15s',
            }}
        >
            <Box
                onClick={onClick}
                sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                }}
            >
                <CardContent sx={{ pb: 1.5, '&:last-child': { pb: 1.5 } }}>
                     {/* Top row: checkbox + title + type chip */}
                    <Box display="flex" alignItems="flex-start" gap={0.5}>
                        <Checkbox
                            size="small"
                            checked={isDone}
                            onChange={handleToggleDone}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ p: 0.5, mt: -0.25 }}
                        />

                        <Box flex={1} minWidth={0}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={1}
                                mb={0.5}
                            >
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    noWrap
                                    sx={{
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        color: isDone ? 'text.disabled' : 'text.primary',
                                    }}
                                >
                                    {task.title}
                                </Typography>

                                <Chip
                                    label={typeChip.label}
                                    color={typeChip.color}
                                    size="small"
                                    sx={chipSx}
                                />
                            </Box>

                            {task.description && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {task.description}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Metadata row */}
                    <Box
                        display="flex"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                        mt={1.25}
                        pl={4}
                    >
                        {hasSubtasks && (
                            <Button
                                size="small"
                                onClick={handleToggleExpand}
                                startIcon={
                                    <ExpandMoreIcon
                                        sx={{
                                            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                                            transition: 'transform 0.15s',
                                        }}
                                    />
                                }
                                sx={{
                                    textTransform: 'none',
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    minWidth: 0,
                                }}
                            >
                                {completedCount}/{subtasks.length} subtasks
                            </Button>
                        )}

                        <Box flex={1} />

                        {dueDate && (
                            <Typography variant="caption" color="text.secondary">
                                {dueDate}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Box>

            {/* Subtasks section */}
            {hasSubtasks ? (
                <Collapse in={expanded} unmountOnExit>
                    <Box px={2} pb={1.5} pt={0} pl={4.5}>
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
                        <Box mt={0.5}>
                            <AddSubtaskInput
                                onAdd={handleAddSubtask}
                                isPending={isCreatingSubtask}
                            />
                        </Box>
                    </Box>
                </Collapse>
            ) : (
                <Box px={2} pb={1.5} mt={0.5} pt={0} pl={4.5}>
                    <AddSubtaskInput
                        onAdd={handleAddSubtask}
                        isPending={isCreatingSubtask}
                    />
                </Box>
            )}
        </Card>
    );
}