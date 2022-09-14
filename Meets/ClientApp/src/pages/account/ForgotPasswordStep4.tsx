import React from 'react';
import { useHistory } from 'react-router-dom';
import CheckIcon from '../../icons/CheckIcon';
import EmailOutlineIcon from '../../icons/EmailOutlineIcon';

import './ForgotPasswordStep4.scss';


function ForgotPasswordStep4() {
    let history = useHistory();

    return (
        <>
            <div className="ForgotPasswordStep4 d-flex flex-column justify-content-center">

                <div className="Icon mx-auto mb-5"><CheckIcon /></div>

                <div className="Title fs-3 text-center">Пароль восстановлен!</div>

                <div className="d-flex justify-content-center"><button type='button' className='Action btn' onClick={() => history.push('/')}>На главную</button></div>

            </div>
        </>
    );
}

export default ForgotPasswordStep4;