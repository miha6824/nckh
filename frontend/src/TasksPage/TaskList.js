import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks }) => {
    return (
        <table className="task-list-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Assignment</th>
                    <th>Date</th>

                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </tbody>
        </table>
    );
};

export default TaskList;
