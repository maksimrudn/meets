import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import mapDispatchToProps from '../../store/mapDispatchToProps';
import mapStateToProps from '../../store/mapStateToProps';
import * as Cookies from 'js-cookie';
import { connect } from 'react-redux';
import accountService from '../../api/AccountService';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useForm } from 'react-hook-form';
import userService from '../../api/UserService';
import LockOutlineIcon from '../../icons/LockOutlineIcon';
import UserOutlineIcon from '../../icons/UserOutlineIcon';
import EmailOutlineIcon from '../../icons/EmailOutlineIcon';
import MenuCloseIcon from '../../icons/MenuCloseIcon';

import './Register.scss';
import Routes from '../../common/Routes';



function Register(props) {
    // Todo: перевести проверки на https://react-hook-form.com/
    const { register, getValues, formState: { errors }, handleSubmit } = useForm();

    let [fullName, setFullName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [confirmPassword, setConfirmPassword] = useState('');

    const history = useHistory();



    const onRegisterSubmit = (e) => {

        try {
            var jwtResponse = accountService.register(fullName, email, password, confirmPassword);
            Cookies.set('access_token', jwtResponse.accessToken);

            let userInfo = userService.getAuthInfo();
            props.UpdateUserInfo(userInfo);

            history.push('/account/confirmEmailMessage');
        }
        catch (err) {
            history.push(Routes.Error, err);
        }
    }

    return (
        <>
            <NotificationContainer />

            <div className="Register">

                <div className="Actions d-flex justify-content-between">
                    <span className="Close" role="button" onClick={() => history.push('/')}><MenuCloseIcon /></span>
                </div>

                <div className="Data d-flex flex-column justify-content-center h-100">
                    <div className="fs-3 text-center mb-2">Регистрация</div>

                    <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit(onRegisterSubmit)}>
                        <div className="col-12">
                            <div className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text" id="FullName"><UserOutlineIcon /></span>
                                    <input {
                                        ...register('FullName',
                                            {
                                                required: true
                                            }
                                        )}
                                        className="form-control form-control-lg"
                                        placeholder="Полное имя"
                                        value={fullName}
                                        onChange={(e) => { setFullName(e.target.value) }}
                                    />
                                    {errors.FullName && <p className='text-danger w-100 text-center mt-2'>Обязательно к заполнению</p>}
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text" id="Password"><EmailOutlineIcon /></span>
                                    <input {
                                        ...register('Email',
                                            {
                                                required: true,
                                                pattern: /\S+@\S+/
                                            }
                                        )}
                                        className="form-control form-control-lg"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                    {errors.Email?.type === 'required' && <p className='text-danger w-100 text-center mt-2'>Обязательно к заполнению</p>}
                                    {errors.Email?.type === 'pattern' && <p className='text-danger w-100 text-center mt-2'>Неверный формат</p>}
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text" id="Password"><LockOutlineIcon /></span>
                                    <input {
                                        ...register('Password',
                                            {
                                                required: true,
                                                minLength: 8,
                                                pattern: /\.*[0-9]/
                                                //validate: val => val === getValues('ConfirmPassword')
                                            }
                                        )}
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="***************"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value) }}
                                    />
                                    {errors.Password?.type === 'required' && <p className='text-danger w-100 text-center mt-2'>Обязательно к заполнению</p>}
                                    {errors.Password?.type === 'minLength' && <p className='text-danger w-100 text-center mt-2'>Пароль должен содержать минимум 8 символов</p>}
                                    {errors.Password?.type === 'pattern' && <p className='text-danger w-100 text-center mt-2'>Пароль должен содержать хотя бы одну цифру (0-9)</p>}
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text" id="ConfirmPassword"><LockOutlineIcon /></span>
                                    <input {
                                        ...register('ConfirmPassword',
                                            {
                                                required: true,
                                                validate: val => val === getValues('Password')
                                            }
                                        )}
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="***************"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value) }}
                                    />
                                    {errors.ConfirmPassword?.type === 'required' && <p className='text-danger w-100 text-center mt-2'>Обязательно к заполнению</p>}
                                    {errors.ConfirmPassword?.type === 'validate' && <p className='text-danger w-100 text-center mt-2'>Пароли отличаются</p>}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 text-center mt-4">
                            <button type="submit" className="Registration btn">Зарегистрироваться</button>
                        </div>
                        <div className="col-12 text-center mt-4">
                            <span className="ToLogin">Уже зарегистрированы? <Link to="/account/login" title="Войти" className="Link ms-3">Войти</Link></span>
                        </div>
                    </form>
                </div>

            </div>

        </>
    );
}

export default connect(mapStateToProps("Register"), mapDispatchToProps("Register"))(Register);