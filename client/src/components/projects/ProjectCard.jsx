import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Typography,
} from '@mui/material';

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

export default function ProjectCard({ project, onClick }) {
    return (
        <Card>
            <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Typography variant="h6" noWrap gutterBottom>
                        {project.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.5em',
                        }}
                    >
                        {project.description || <em>No description</em>}
                    </Typography>
                    <Box
                        sx={{
                            mt: 'auto',
                            pt: 2,
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Chip
                            label={project.status}
                            size="small"
                            color={statusChipColor(project.status)}
                            sx={{
                                textTransform: 'capitalize',
                                '& .MuiChip-label': { fontWeight: 500 },
                            }}
                        />
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
