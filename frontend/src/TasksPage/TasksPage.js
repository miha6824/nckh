import React from 'react';
import NavBar from '../Navbar/Navbar';
import TaskList from './TaskList';
import './TaskPage.css';

const TaskPage = () => {
    // Dữ liệu giả định
    const tasks = [
        { id: 1, title: 'Task 1', status: 'Công việc hiện tại', date: '2024-04-28', assignment: 'User A' },
        { id: 2, title: 'Task 2', status: 'Công việc quá hạn', date: '2024-04-25', assignment: 'User B' },
        { id: 3, title: 'Task 3', status: 'Công việc hoàn thành', date: '2024-04-20', assignment: 'User C' }
    ];

    return (
        <div className="task-page">
            <NavBar />
            <div className="task-header">
                <h2 className="progress">Công việc hiện tại</h2>
                <hr className="line" />
            </div>
            <TaskList tasks={tasks.filter(task => task.status === 'Công việc hiện tại')} />
            <div className="task-header">
                <h2 className="outdate">Công việc quá hạn</h2>
                <hr className="line" />
            </div>
            <TaskList tasks={tasks.filter(task => task.status === 'Công việc quá hạn')} />
            <div className="task-header">
                <h2 className="complete">Công việc hoàn thành</h2>
                <hr className="line" />
            </div>
            <TaskList tasks={tasks.filter(task => task.status === 'Công việc hoàn thành')} />
        </div>
    );
};

export default TaskPage;
