import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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

    // Populate or reset fields each time the dialog opens
    useEffect(() => {
        if (!open) return;
        setName(initialValues?.name ?? '');
        setDescription(initialValues?.description ?? '');
    }, [open, initialValues?.name, initialValues?.description]);

    function handleSubmit(e) {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;
        onSubmit({
            name: trimmedName,
            description: description.trim() || null,
        });
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
