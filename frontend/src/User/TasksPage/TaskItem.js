import React from 'react';

const TaskItem = ({ task }) => {
    const { id, title, date, assignment } = task;
    // Kiểm tra độ dài của tiêu đề và cắt đoạn nếu nó quá dài
    const truncatedTitle = title.length > 20 ? title.substring(0, 20) + '........' : title;

    return (
        <tr>
            <td>{id}</td>
            <td title={title}>{truncatedTitle}</td>
            <td>{assignment}</td>
            <td>{date}</td>
        </tr>
    );
};

export default TaskItem;
