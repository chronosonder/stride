import { useParams } from 'react-router-dom';
import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import ProjectHeader from '../components/projects/ProjectHeader';
import { useProject } from '../hooks/useProjects';

export default function ProjectPage() {
    const { id } = useParams();
    const projectId = parseInt(id, 10);
    const { data: project, isLoading, isError, error } = useProject(projectId);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" pt={8}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error?.message ?? 'Failed to load project.'}
            </Alert>
        );
    }

    return (
        <Stack spacing={3}>
            <ProjectHeader project={project} />
            {/* Tasks — Step 3 */}
        </Stack>
    );
}
