import React from 'react';

const TaskItem = ({ task }) => {
    const { id, title, date, assignment } = task;
    return (
        <tr>
            <td>{id}</td>
            <td>{title}</td>
            <td>{date}</td>
            <td>{assignment}</td>
        </tr>
    );
};

export default TaskItem;
