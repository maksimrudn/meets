import React, { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import accountService from '../../api/AccountService';
import Routes from '../../common/Routes';
import EmailOutlineIcon from '../../icons/EmailOutlineIcon';
import MenuCloseIcon from '../../icons/MenuCloseIcon';

import './ForgotPasswordStep1.scss';

export default function ForgotPasswordStep1() {
    let history = useHistory();
    const [email, setEmail] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        try {
            accountService.forgotPassword(email);

            history.push('/account/forgotPasswordStep2');
        } catch (err) {
            history.push(Routes.Error, err );
        }
    }

    return (
        <>
            <div className="ForgotPasswordStep1">

                <div className="Actions d-flex justify-content-between">
                    <span className="Close" role="button" onClick={() => history.push('/')}><MenuCloseIcon /></span>
                </div>

                <div className="Data d-flex flex-column justify-content-center h-100">
                    <div className="fs-3 text-center mb-5">Восстановить пароль</div>

                    <div className="Text mb-3">Введите email на который будет выслана ссылка для восстановления</div>

                    <form className="d-block" onSubmit={onSubmit}>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="email"><EmailOutlineIcon /></span>
                            <input id="Input.Email" className="form-control form-control-lg" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="col-12 text-center">
                            <button type="submit" className="Send btn">Отправить</button>
                        </div>

                    </form>
                </div>

            </div>
        </>
    );
}