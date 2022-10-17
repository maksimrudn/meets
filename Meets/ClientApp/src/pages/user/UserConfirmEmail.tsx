import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import userService from '../../api/UserService';
import parse from 'html-react-parser';
import { useForm } from 'react-hook-form';
import GoBackIcon from '../../icons/GoBackIcon';
import Routes from '../../common/Routes';

import './UserConfirmEmail.scss';
import useAccountStore from '../../hooks/useAccountStore';
import useSettingsStore from '../../hooks/useSettingsStore';
import { toast } from 'react-toastify';

interface IUserConfirmEmailProps{
}

export default function UserConfirmEmail(props: IUserConfirmEmailProps) {
    const history = useHistory();
    const { register, getValues, formState: { errors }, handleSubmit } = useForm();

    const { currentUser } = useAccountStore();
    const settings = useSettingsStore();

    const [email, setEmail] = useState<string>(currentUser?.email as string);
    const [showMessage, setShowMessage] = useState(false);

    const handleConfirmEmail = async () => {
        try {
            await settings.confirmEmail(email);
            setShowMessage(true);
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    return (
        <div className="UserConfirmEmail">

            <div className="Header d-flex justify-content-start align-items-center mb-5">
                <span className="GoBackBtn me-5" role="button" onClick={() => history.goBack()}><GoBackIcon /></span>
                <span className='Title'>Адрес эл. почты</span>
            </div>

            <form onSubmit={handleSubmit(handleConfirmEmail)}>
                <div className="col-12">
                    <div className="mb-3">
                        <label className="form-label ms-2">Адрес эл. почты</label>
                        <input {
                            ...register('Email',
                                {
                                    required: true,
                                    pattern: /\S+@\S+/
                                }
                            )}
                            className="form-control"
                            placeholder="ivanov@mail.ru"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }}
                            readOnly
                        />
                        {errors.Email?.type === 'required' && <p className='text-danger w-100 text-center mt-2'>Обязательно к заполнению</p>}
                        {errors.Email?.type === 'pattern' && <p className='text-danger w-100 text-center mt-2'>Неверный формат</p>}
                        {showMessage && <p className='text-danger w-100 text-start mt-2'>Письмо с подтверждением отправлено. Проверьте почту.</p>}
                    </div>
                </div>

                <div className="col-12 text-center mt-2">
                    <button type="submit" className="Submit btn">Отправить письмо с подтверждением</button>
                </div>
            </form>

        </div>
    );
}