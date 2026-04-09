import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material';

const TASK_TYPE_OPTIONS = [
    { value: 'task', label: 'Task' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'deliverable', label: 'Deliverable' },
];

const TASK_STATUS_OPTIONS = [
    { value: 'to-do', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];

// Format an ISO date string to YYYY-MM-DD for the date input
function toDateInputValue(dueDate) {
    if (!dueDate) return '';
    return new Date(dueDate).toISOString().split('T')[0];
}

export default function TaskFormDialog({
    open,
    onClose,
    onSubmit,
    isSubmitting = false,
    error = null,
    initialValues = null,
}) {
    const isEditMode = initialValues !== null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [taskType, setTaskType] = useState('task');
    const [status, setStatus] = useState('to-do');

    // Populate or reset fields each time the dialog opens
    useEffect(() => {
        if (!open) return;
        setTitle(initialValues?.title ?? '');
        setDescription(initialValues?.description ?? '');
        setDueDate(toDateInputValue(initialValues?.dueDate));
        setTaskType(initialValues?.taskType ?? 'task');
        setStatus(initialValues?.status ?? 'to-do');
    }, [open, initialValues?.title, initialValues?.description, initialValues?.dueDate, initialValues?.taskType, initialValues?.status]);

    function handleSubmit(e) {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;
        onSubmit({
            title: trimmedTitle,
            description: description.trim() || null,
            dueDate: dueDate || null,
            taskType,
            ...(isEditMode && { status }),
        });
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {isEditMode ? 'Edit task' : 'New task'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                            disabled={isSubmitting}
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            minRows={3}
                            disabled={isSubmitting}
                        />
                        <TextField
                            label="Due date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            fullWidth
                            disabled={isSubmitting}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="Type"
                            select
                            value={taskType}
                            onChange={(e) => setTaskType(e.target.value)}
                            fullWidth
                            disabled={isSubmitting}
                        >
                            {TASK_TYPE_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        {isEditMode && (
                            <TextField
                                label="Status"
                                select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {TASK_STATUS_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !title.trim()}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : isEditMode ? (
                            'Save changes'
                        ) : (
                            'Create'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
