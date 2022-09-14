import { setegid } from 'process';
import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import accountService from '../../api/AccountService';
import * as Cookies from 'js-cookie';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../store/mapDispatchToProps';
import mapStateToProps from '../../store/mapStateToProps';
import userService from '../../api/UserService';
import MenuCloseIcon from '../../icons/MenuCloseIcon';
import UserOutlineIcon from '../../icons/UserOutlineIcon';
import LockOutlineIcon from '../../icons/LockOutlineIcon';


import './Login.scss';



function Login(props) {

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    const [errMessage, setErrMessage] = useState('');

    const history = useHistory();

    const onLoginSubmit = (e) => {
        e.preventDefault();

        try {
            var jwtResponse = accountService.login(email, password);
            Cookies.set('access_token', jwtResponse.accessToken);

            let userInfo = userService.getAuthInfo();
            props.UpdateUserInfo(userInfo);


            history.push('/');
        }
        catch (err) {
            setErrMessage(err.message);
        }
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

                    <form className="d-block" onSubmit={onLoginSubmit}>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="email"><UserOutlineIcon /></span>
                            <input id="Input.Email" className="form-control form-control-lg" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="input-group mb-4">
                            <span className="input-group-text" id="password"><LockOutlineIcon /></span>
                            <input id="Input.Password" className="form-control form-control-lg" type="password" placeholder="***************" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {errMessage && <p className='text-danger w-100 text-center mt-2'>{errMessage}</p>}

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

export default connect(mapStateToProps("Login"), mapDispatchToProps("Login"))(Login);