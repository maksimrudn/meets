import { setegid } from 'process';
import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import accountService from '../../api/AccountService';
import * as Cookies from 'js-cookie';
import { connect, useSelector } from 'react-redux';
import MenuCloseIcon from '../../icons/MenuCloseIcon';
import UserOutlineIcon from '../../icons/UserOutlineIcon';
import LockOutlineIcon from '../../icons/LockOutlineIcon';


import './Login.scss';
import useAuthStore from '../../hooks/useAuthStore';



function Login() {

    const auth = useAuthStore();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();

        await auth.login(email, password);

        history.push('/');
    }

    return (
        <>
            <NotificationContainer />

            <div className="Login">

                <div className="Actions d-flex justify-content-between">
                    <span className="Close" role="button" onClick={() => history.push('/')}><MenuCloseIcon /></span>
                </div>

                <div className="Data d-flex flex-column justify-content-center h-100">
                    <div className="fs-3 text-center mb-2">Вход</div>

                    <form className="d-block" onSubmit={handleLogin}>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="email"><UserOutlineIcon /></span>
                            <input id="Input.Email" className="form-control form-control-lg" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="input-group mb-4">
                            <span className="input-group-text" id="password"><LockOutlineIcon /></span>
                            <input id="Input.Password" className="form-control form-control-lg" type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {auth.error && <p className='text-danger w-100 text-center mt-2'>{auth.error}</p>}

                        <div className="col-12 text-center">
                            <button type="submit" className="ComeIn btn">Войти</button>
                        </div>

                        <div className="col-12 text-center mt-4">
                            <Link to="/account/forgotPasswordStep1" className="Link">Забыли пароль?</Link>
                        </div>

                        <div className="col-12 text-center mt-4">
                            <span className="ToRegister">Вы новенький? <Link to="/account/register" className="Link ms-3">Зарегистрироваться</Link></span>
                        </div>
                    </form>
                </div>

            </div>

           
        </>
    );
}

export default Login;