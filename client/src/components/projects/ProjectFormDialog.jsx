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

export default function ProjectFormDialog({
    open,
    onClose,
    onSubmit,
    isSubmitting = false,
    error = null,
    initialValues = null,
}) {
    const isEditMode = initialValues !== null;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('active');

    // Populate or reset fields each time the dialog opens
    useEffect(() => {
        if (!open) return;
        setName(initialValues?.name ?? '');
        setDescription(initialValues?.description ?? '');
        setStatus(initialValues?.status ?? 'active');
    }, [open, initialValues?.name, initialValues?.description, initialValues?.status]);

    function handleSubmit(e) {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;

        const payload = {
            name: trimmedName,
            description: description.trim() || null,
        };

        // Status is only editable in edit mode
        if (isEditMode) {
            payload.status = status;
        }

        onSubmit(payload);
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {isEditMode ? 'Edit project' : 'New project'}
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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

                        {isEditMode && (
                            <TextField
                                select
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                fullWidth
                                disabled={isSubmitting}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
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
                        disabled={isSubmitting || !name.trim()}
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