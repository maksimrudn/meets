﻿import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import MenuCloseIcon from '../../icons/MenuCloseIcon';
import UserOutlineIcon from '../../icons/UserOutlineIcon';
import LockOutlineIcon from '../../icons/LockOutlineIcon';


import './Login.scss';
import useAccountStore from '../../hooks/useAccountStore';



function Login() {

    const account = useAccountStore();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await account.login(email, password);
            history.push('/');
        } catch (err) {
            
        }

        
    }

    return (
        <>

            <div className="Login">

                <div className="Actions d-flex justify-content-between">
                    <span className="Close" role="button" onClick={() => history.push('/')}><MenuCloseIcon /></span>
                </div>

                <div className="Data d-flex flex-column justify-content-center h-100">
                    <div className="fs-3 text-center mb-2">Authorization</div>

                    <form className="d-block" onSubmit={handleLogin}>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="email"><UserOutlineIcon /></span>
                            <input id="Input.Email" className="form-control form-control-lg" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="input-group mb-4">
                            <span className="input-group-text" id="password"><LockOutlineIcon /></span>
                            <input id="Input.Password" className="form-control form-control-lg" type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {account.error && <p className='text-danger w-100 text-center mt-2'>{account.error}</p>}

                        <div className="col-12 text-center">
                            <button type="submit" className="ComeIn btn">Log In</button>
                        </div>

                        <div className="col-12 text-center mt-4">
                            <Link to="/account/forgotPasswordStep1" className="Link">Forgot password?</Link>
                        </div>

                        <div className="col-12 text-center mt-4">
                            <span className="ToRegister">Are you newbie? <Link to="/account/register" className="Link ms-3">Register</Link></span>
                        </div>
                    </form>
                </div>

            </div>

           
        </>
    );
}

export default Login;