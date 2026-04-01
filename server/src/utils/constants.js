// Immutable constants for the project status 
const PROJECT_STATUSES = Object.freeze({
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
});

const TASK_STATUSES = Object.freeze({
    TODO: 'to-do',
    IN_PROGRESS: 'in-progress',
    DONE: 'done'
});
 
const TASK_TYPES = Object.freeze({
    TASK: 'task',
    SUBTASK: 'subtask',
    MILESTONE: 'milestone',
    DELIVERABLE: 'deliverable'
});
 
module.exports = { PROJECT_STATUSES, TASK_STATUSES, TASK_TYPES };
