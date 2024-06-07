import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterPage.module.css'; // Import CSS module for styling

const RegisterPage = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        fullName: '',
        sex: '',
        birthday: '',
        telephone: '',
        address: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/register', values)
            .then(res => setMessage(res.data))
            .catch(err => {
                if (err.response) {
                    setMessage(err.response.data);
                } else {
                    setMessage("Error");
                }
            });
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <form className={`${styles.formWrapper} bg-white p-3 rounded w-50 d-flex flex-column`} onSubmit={handleSubmit}>
                <h2>Sign-Up</h2>
                <div className={`${styles.formRow} d-flex`}>
                    <div className={`${styles.formColumn} flex-column mr-3`}>
                        <div className='mb-3'>
                            <label htmlFor="email"><strong>Email</strong></label>
                            <input type="email" placeholder='Enter Email' name='email'
                                onChange={e => setValues({ ...values, email: e.target.value })} className='form-control rounded-0'></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="password"><strong>Password</strong></label>
                            <input type="password" placeholder='Enter Password' name='password'
                                onChange={e => setValues({ ...values, password: e.target.value })} className='form-control rounded-0'></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="fullName"><strong>Full Name</strong></label>
                            <input type="text" placeholder='Enter Full Name' name='fullName'
                                onChange={e => setValues({ ...values, fullName: e.target.value })} className='form-control rounded-0'></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="sex"><strong>Gender</strong></label>
                            <select
                                name="gender"
                                onChange={e => setValues({ ...values, sex: e.target.value })}
                                required
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>
                    <div className={`${styles.formColumn} flex-column`}>
                        <div className='mb-3'>
                            <label htmlFor="birthday"><strong>Birthday</strong></label>
                            <input type="date" name='birthday'
                                onChange={e => setValues({ ...values, birthday: e.target.value })} className='form-control rounded-0'></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="telephone"><strong>Telephone</strong></label>
                            <input type="text" placeholder='Enter Telephone' name='telephone'
                                onChange={e => setValues({ ...values, telephone: e.target.value })} className='form-control rounded-0'></input>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="address"><strong>Address</strong></label>
                            <input type="text" placeholder='Enter Address' name='address'
                                onChange={e => setValues({ ...values, address: e.target.value })} className='form-control rounded-0'></input>
                        </div>
                    </div>
                </div>
                <button type='submit' className='btn btn-success w-100 rounded-0 mb-3'>Sign Up</button>
                <Link to='/login' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Sign-In</Link>
                {message && <p className='mt-3'>{message}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
