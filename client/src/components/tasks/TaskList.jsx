import { Stack } from '@mui/material';
import TaskCard from './TaskCard';

export default function TaskList({
    tasks,
    onTaskClick,
    onToggleDone,
    onToggleSubtaskDone,
    onCreateSubtask,
    onDeleteSubtask,
    isCreatingSubtask,
}) {
    return (
        <Stack spacing={1.5}>
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onToggleDone={onToggleDone}
                    onToggleSubtaskDone={onToggleSubtaskDone}
                    onCreateSubtask={onCreateSubtask}
                    onDeleteSubtask={onDeleteSubtask}
                    isCreatingSubtask={isCreatingSubtask}
                />
            ))}
        </Stack>
    );
}