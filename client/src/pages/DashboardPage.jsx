import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFormDialog from '../components/projects/ProjectFormDialog';
import { useProjects, useCreateProject } from '../hooks/useProjects';

const gridSx = {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
    },
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data: projects = [], isLoading, isError, error } = useProjects();
    const createProjectMutation = useCreateProject();

    function handleOpenDialog() {
        createProjectMutation.reset();
        setDialogOpen(true);
    }

    function handleCloseDialog() {
        if (createProjectMutation.isPending) return;
        setDialogOpen(false);
    }

    function handleCreateProject({ name, description }) {
        createProjectMutation.mutate({ name, description }, {
            onSuccess: () => setDialogOpen(false),
        });
    }

    return (
        <Stack spacing={3}>
            <title>Dashboard - Stride PM</title>

            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" fontWeight={600}>
                    Your projects
                </Typography>

                <Button variant="contained" onClick={handleOpenDialog}>
                    New project
                </Button>
            </Box>

            {isError && (
                <Alert severity="error">
                    {error?.message ?? 'Failed to load projects. Please refresh the page.'}
                </Alert>
            )}

            {isLoading && (
                <Box sx={gridSx}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}
                            >
                                <Skeleton width="70%" height={28} />
                                <Skeleton width="100%" />
                                <Skeleton width="85%" />
                                <Box
                                    sx={{
                                        mt: 'auto',
                                        pt: 2,
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Skeleton variant="rounded" width={70} height={24} />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {!isLoading && !isError && projects.length === 0 && (
                <Box
                    textAlign="center"
                    py={8}
                    sx={{
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No projects yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Create your first project to get started.
                    </Typography>
                    <Button variant="contained" onClick={handleOpenDialog}>
                        Create your first project
                    </Button>
                </Box>
            )}

            {!isLoading && !isError && projects.length > 0 && (
                <Box sx={gridSx}>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => navigate(`/projects/${project.id}`)}
                        />
                    ))}
                </Box>
            )}

            <ProjectFormDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleCreateProject}
                isSubmitting={createProjectMutation.isPending}
                error={createProjectMutation.error?.message ?? null}
            />
        </Stack>
    );
}
