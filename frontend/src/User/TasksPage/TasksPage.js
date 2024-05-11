import React from 'react';
import NavBar from '../Navbar/Navbar';
import TaskList from './TaskList';
import './TaskPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const TaskPage = () => {
    // Dữ liệu giả định
    const tasks = [
        { id: 1, title: 'Taskdsadsadasdsadasdsadsadsadsadsadsadsadasdas 1', status: 'Công việc hiện tại', date: '2024-04-28', assignment: 'User A' },
        { id: 2, title: 'Task 2sdsadsadsadsadsadsadsadsadaddsadsadasdsadsacvbhdrfs', status: 'Công việc quá hạn', date: '2024-04-25', assignment: 'User B' },
        { id: 3, title: 'Task dsadsadsadsádsadsadsadsadsadsadsdasd    3', status: 'Công việc hoàn thành', date: '2024-04-20', assignment: 'User C' }
    ];

    return (
        <div>
            <NavBar />
            <div className="task-page">
                <div className="actions">
                    <button className="add-task-button"><FontAwesomeIcon icon={faPlus} /> Thêm việc</button>
                    <input type="text" placeholder="Tìm kiếm công việc..." className="search-input" />
                </div>
                <div className="task-header">
                    <h2>Công việc hiện tại</h2>
                    <hr className="line" />
                </div>
                <TaskList tasks={tasks.filter(task => task.status === 'Công việc hiện tại')} />
                <div className="task-header">
                    <h2>Công việc quá hạn</h2>
                    <hr className="line" />
                </div>
                <TaskList tasks={tasks.filter(task => task.status === 'Công việc quá hạn')} />
                <div className="task-header">
                    <h2>Công việc hoàn thành</h2>
                    <hr className="line" />
                </div>
                <TaskList tasks={tasks.filter(task => task.status === 'Công việc hoàn thành')} />
            </div>
        </div>

    );
};

export default TaskPage;
