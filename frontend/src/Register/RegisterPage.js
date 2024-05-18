import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const RegisterPage = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/register', values)
            .then(res => console.log(res))
            .then(err => console.log(err))

    }

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-Up</h2>
                <from onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="name"><strong>Name</strong></label>
                        <input type="text" placeholder='Enter Name' name='name'
                            onChange={e => setValues({ ...values, name: e.target.value })} className='form-control rounded-0'></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="text" placeholder='Enter Email' name='email'
                            onChange={e => setValues({ ...values, email: e.target.value })} className='form-control rounded-0'></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                            onChange={e => setValues({ ...values, password: e.target.value })} className='form-control rounded-0'></input>
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'>Sign Up</button>
                    <p>You are agree to aour terms and policies</p>
                    <Link to='/login' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Sign-In</Link>
                </from>
            </div>
        </div>

    );
};

export default RegisterPage;
