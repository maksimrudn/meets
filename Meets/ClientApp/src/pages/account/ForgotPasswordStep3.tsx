import React, { Component, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
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

import './ForgotPasswordStep3.scss';
import Routes from '../../common/Routes';



function ForgotPasswordStep3(props) {
    // Todo: перевести проверки на https://react-hook-form.com/
    const { register, getValues, formState: { errors }, handleSubmit } = useForm();

    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [confirmPassword, setConfirmPassword] = useState('');

    const history = useHistory();
    let { search } = useLocation();

    useEffect(() => {
        try {
            let query = new URLSearchParams(search);

            setCode(query.get('code'));
            setEmail(query.get('email'));
        } catch (err) {
            history.push(Routes.Error, err );
        }

    }, []);

    const onSubmit = (e) => {
        try {
            accountService.resetPassword(code, email, password, confirmPassword);

            history.push('/account/forgotPasswordStep4');
        } catch (err) {
            history.push(Routes.Error );
        }
    }

    return (
        <>
            <NotificationContainer />

            <div className="ForgotPasswordStep3">

                <div className="Actions d-flex justify-content-between">
                    <span className="Close" role="button" onClick={() => history.push('/')}><MenuCloseIcon /></span>
                </div>

                <div className="Data d-flex flex-column justify-content-center h-100">
                    <div className="fs-3 text-center mb-2">Recovery password</div>

                    <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                        <div className="col-12">
                            <div className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text" id="Password"><LockOutlineIcon /></span>
                                    <input {
                                        ...register('Password',
                                            {
                                                required: true,
                                                //validate: val => val === getValues('ConfirmPassword')
                                            }
                                        )}
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="***************"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value) }}
                                    />
                                    {errors.Password && <p className='Error'>Required</p>}
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
                                    {errors.ConfirmPassword?.type === 'required' && <p className='Error'>Required</p>}
                                    {errors.ConfirmPassword?.type === 'validate' && <p className='Error'>Passwords are different</p>}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 text-center mt-4">
                            <button type="submit" className="Save btn">Save</button>
                        </div>
                    </form>
                </div>

            </div>
        </>
    );
}

export default ForgotPasswordStep3;