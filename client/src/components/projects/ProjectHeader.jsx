import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Divider,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import ProjectFormDialog from './ProjectFormDialog';
import { useUpdateProject } from '../../hooks/useProjects';

function statusChipColor(status) {
    switch (status) {
        case 'active':
            return 'primary';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'default';
        default:
            return 'default';
    }
}

export default function ProjectHeader({ project }) {
    const [editOpen, setEditOpen] = useState(false);
    const updateProjectMutation = useUpdateProject();

    function handleOpenEdit() {
        updateProjectMutation.reset();
        setEditOpen(true);
    }

    function handleCloseEdit() {
        if (updateProjectMutation.isPending) return;
        setEditOpen(false);
    }

    function handleEditSubmit({ name, description, status }) {
        updateProjectMutation.mutate(
            { projectId: project.id, updates: { name, description, status } },
            { onSuccess: () => setEditOpen(false) }
        );
    }

    return (
        <>
            <Stack spacing={1.5}>
                <Breadcrumbs>
                    <Box display="flex" alignItems="flex-end" gap={1}>
                        <Link
                            component={RouterLink}
                            to="/"
                            color="inherit"
                            underline="hover"
                        >
                            Dashboard
                        </Link>
                        <SubdirectoryArrowLeftIcon
                            sx={{ transform: 'rotate(-90deg)', }}
                            fontSize="small"
                        />
                    </Box>
                </Breadcrumbs>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Chip
                            label={project.status}
                            size="small"
                            color={statusChipColor(project.status)}
                            sx={{
                                textTransform: 'capitalize',
                                flexShrink: 0,
                                '& .MuiChip-label': { fontWeight: 500 },
                            }}
                        />
                        <Typography variant="h5">{project.name}</Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleOpenEdit}
                        sx={{ ml: 2, flexShrink: 0 }}
                    >
                        Edit
                    </Button>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    {project.description || <em>No description</em>}
                </Typography>
            </Stack>

            <Divider />

            <ProjectFormDialog
                open={editOpen}
                onClose={handleCloseEdit}
                onSubmit={handleEditSubmit}
                initialValues={{ name: project.name, description: project.description }}
                isSubmitting={updateProjectMutation.isPending}
                error={updateProjectMutation.error?.message ?? null}
            />
        </>
    );
}
