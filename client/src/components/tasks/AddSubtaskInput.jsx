import { useState } from 'react';
import { Box, InputBase } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * Inline input for adding a subtask. Submits on enter and clears after submit.
 */
export default function AddSubtaskInput({
    onAdd,
    isPending = false,
    placeholder = 'Add subtask',
}) {
    const [title, setTitle] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        const trimmed = title.trim();
        if (!trimmed || isPending) return;
        onAdd(trimmed);
        setTitle('');
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            display="flex"
            alignItems="center"
            gap={0.5}
            pl={0.5}
            sx={{
                borderRadius: 1,
                '&:focus-within': { bgcolor: 'action.hover' },
            }}
        >
            <AddIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <InputBase
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={placeholder}
                disabled={isPending}
                sx={{ flex: 1, fontSize: '0.875rem', py: 0.5 }}
            />
        </Box>
    );
}