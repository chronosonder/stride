/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
    -- Create ENUMs
    DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status_type') THEN
            CREATE TYPE project_status_type AS ENUM ('active', 'completed', 'cancelled');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status_type') THEN
            CREATE TYPE task_status_type AS ENUM ('to-do', 'in-progress', 'done');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_category_type') THEN
            CREATE TYPE task_category_type AS ENUM ('task', 'subtask', 'milestone', 'deliverable');
        END IF;
    END $$;


    -- TABLES
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
        project_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status project_status_type DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create the tasks table
    CREATE TABLE IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE, 
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        status task_status_type DEFAULT 'to-do',
        task_type task_category_type DEFAULT 'task',
        parent_task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE, -- Self-referencing FK, NULLABLE
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE
    );

    -- INDEXES
    CREATE INDEX IF NOT EXISTS idx_projects ON projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_tasks ON tasks(project_id);
    CREATE INDEX IF NOT EXISTS idx_subtasks ON tasks(parent_task_id);

    -- FUNCTIONS
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN   
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- TRIGGERS
    CREATE OR REPLACE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

    CREATE OR REPLACE TRIGGER tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

    CREATE OR REPLACE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(` DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
    DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
    DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS users;
    DROP TYPE IF EXISTS task_category_type;
    DROP TYPE IF EXISTS task_status_type;
    DROP TYPE IF EXISTS project_status_type;
    `);
};