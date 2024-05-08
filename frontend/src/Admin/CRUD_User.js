import React, { useEffect } from 'react';
import axios from 'axios'

function CRUD_User() {

    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => console.log(res));
    }, [])

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded'>
                <button className='btn btn-success'>Add +</button>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>FullName</th>
                            <th>Sex</th>
                            <th>BirthDay</th>
                            <th>Tele</th>
                            <th>Address</th>
                            <th>HSLuong</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CRUD_User