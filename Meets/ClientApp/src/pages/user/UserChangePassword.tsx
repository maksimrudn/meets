import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import userService from '../../api/UserService';
import parse from 'html-react-parser';
import { useForm } from 'react-hook-form';
import GoBackIcon from '../../icons/GoBackIcon';
import Routes from '../../common/Routes';

import './UserChangePassword.scss';

export default function UserChangePassword() {
    const history = useHistory();
    const { register, getValues, formState: { errors }, handleSubmit } = useForm();

    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const onSubmit = () => {
        try {
            userService.changePassword(oldPassword, newPassword, confirmPassword);
            history.goBack();
            //NotificationManager.success('Пароль успешно изменён!', 'Уведомление');
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }

    return (
        <div className="UserChangePassword">
            <NotificationContainer />

            <div className="Header d-flex justify-content-start align-items-center mb-5">
                <span className="GoBackBtn me-5" role="button" onClick={() => history.goBack()}><GoBackIcon /></span>
                <span className='Title'>Password changing</span>
            </div>

            <div className="Data d-flex flex-column justify-content-center h-100">

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                    <div className="col-12">
                        <div className="mb-4">
                            <label className="form-label ms-2">Old password</label>
                            <input {
                                ...register('OldPassword',
                                    {
                                        required: true,
                                        //validate: val => val === getValues('ConfirmPassword')
                                    }
                                )}
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="***************"
                                value={oldPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setOldPassword(e.target.value) }}
                            />
                            {errors.OldPassword && <p className='Error'>Required</p>}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="mb-4">
                            <label className="form-label ms-2">New password</label>
                            <input {
                                ...register('NewPassword',
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
                                value={newPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNewPassword(e.target.value) }}
                            />
                            {errors.NewPassword?.type === 'required' && <p className='text-danger w-100 text-center mt-2'>Required</p>}
                            {errors.NewPassword?.type === 'minLength' && <p className='text-danger w-100 text-center mt-2'>Password must have at least 8 symbols</p>}
                            {errors.NewPassword?.type === 'pattern' && <p className='text-danger w-100 text-center mt-2'>Password must have at least one digit (0-9)</p>}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="mb-4">
                            <label className="form-label ms-2">Confirmation</label>
                            <input {
                                ...register('ConfirmPassword',
                                    {
                                        required: true,
                                        validate: val => val === getValues('NewPassword')
                                    }
                                )}
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="***************"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setConfirmPassword(e.target.value) }}
                            />
                            {errors.ConfirmPassword?.type === 'required' && <p className='text-danger w-100 text-center mt-2'>Required</p>}
                            {errors.ConfirmPassword?.type === 'validate' && <p className='text-danger w-100 text-center mt-2'>Passwords are different</p>}
                        </div>
                    </div>

                    <div className="col-12 text-center mt-4">
                        <button type="submit" className="Save btn">Save</button>
                    </div>
                </form>
            </div>

        </div>
    );
}
