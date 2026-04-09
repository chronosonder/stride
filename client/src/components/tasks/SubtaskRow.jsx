import {
    Box,
    Checkbox,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function formatDueDate(dueDate) {
    if (!dueDate) return null;
    return new Date(dueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}

export default function SubtaskRow({ subtask, onToggleDone, onDelete }) {
    const isDone = subtask.status === 'done';

    function handleToggle(e) {
        e.stopPropagation();
        onToggleDone?.(subtask);
    }

    function handleDelete(e) {
        e.stopPropagation();
        onDelete?.(subtask);
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            pl={1}
            py={0.5}
            sx={{
                borderLeft: '2px solid',
                borderColor: 'divider',
                ml: 1,
                // Reveal delete button on hover (desktop) or always (mobile/touch)
                '& .subtask-delete': {
                    opacity: { xs: 1, sm: 0 },
                    transition: 'opacity 0.15s',
                },
                '&:hover .subtask-delete, &:focus-within .subtask-delete': {
                    opacity: 1,
                },
            }}
        >
            <Checkbox
                size="small"
                checked={isDone}
                onChange={handleToggle}
                onClick={(e) => e.stopPropagation()}
                sx={{ p: 0.5 }}
            />
            <Typography
                variant="body2"
                sx={{
                    flex: 1,
                    minWidth: 0,
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'text.disabled' : 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {subtask.title}
            </Typography>
            {subtask.dueDate && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ flexShrink: 0 }}
                >
                    {formatDueDate(subtask.dueDate)}
                </Typography>
            )}
            {onDelete && (
                <IconButton
                    className="subtask-delete"
                    size="small"
                    onClick={handleDelete}
                    aria-label="Delete subtask"
                    sx={{
                        p: 0.25,
                        color: 'text.secondary',
                        '&:hover': { color: 'error.main' },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
}