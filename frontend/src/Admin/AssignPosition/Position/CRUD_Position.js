import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './CRUD_Position.module.css';

const CRUD_Positions = () => {
    const [positions, setPositions] = useState([]);
    const [newPosition, setNewPosition] = useState('');
    const [editPosition, setEditPosition] = useState({ ID: null, TenCV: '' });

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = () => {
        axios.get('http://localhost:8081/positions')
            .then(res => {
                setPositions(res.data);
            })
            .catch(error => {
                console.error('Error fetching positions:', error);
            });
    };

    const handleAddPosition = () => {
        axios.post('http://localhost:8081/addpositions', { TenCV: newPosition })
            .then(res => {
                fetchPositions();
                setNewPosition('');
            })
            .catch(error => {
                console.error('Error adding position:', error);
            });
    };

    const handleDeletePosition = (id) => {
        axios.delete(`http://localhost:8081/deletepositions/${id}`)
            .then(res => {
                fetchPositions();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    alert(error.response.data.error);
                } else {
                    console.error('Error deleting position:', error);
                }
            });
    };


    const handleEditPosition = (id, newName) => {
        setEditPosition({ ID: id, TenCV: newName });
    };

    const handleUpdatePosition = () => {
        axios.put(`http://localhost:8081/updatepositions/${editPosition.ID}`, { TenCV: editPosition.TenCV })
            .then(res => {
                fetchPositions();
                setEditPosition({ ID: null, TenCV: '' });
            })
            .catch(error => {
                console.error('Error updating position:', error);
            });
    };

    return (
        <div className={styles.crudPositionContainer}>
            <h2>Chức vụ</h2>
            <div className="mb-3">
                <input
                    type="text"
                    className={styles.newPositionInput}
                    placeholder="Nhập tên chức vụ mới..."
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                />
                <button onClick={handleAddPosition} className={styles.addButton}><FaPlus /> Thêm</button>
            </div>
            <table className={`table table-bordered ${styles.positionTable}`}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th>Chức vụ</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {positions.map(position => (
                        <tr key={position.ID}>
                            <td>{position.TenCV}</td>
                            <td className={styles.actions}>
                                <button onClick={() => handleEditPosition(position.ID, position.TenCV)} className={`${styles.actionButton} ${styles.editButton}`}>
                                    <FaEdit /> Sửa
                                </button>
                                <button onClick={() => handleDeletePosition(position.ID)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                                    <FaTrash /> Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editPosition.ID && (
                <div className={styles.editForm}>
                    <h4>Chỉnh sửa chức vụ</h4>
                    <input
                        type="text"
                        value={editPosition.TenCV}
                        onChange={(e) => setEditPosition({ ...editPosition, TenCV: e.target.value })}
                    />
                    <button onClick={handleUpdatePosition} className={styles.updateButton}>Cập nhật</button>
                </div>
            )}
        </div>
    );
};

export default CRUD_Positions;
