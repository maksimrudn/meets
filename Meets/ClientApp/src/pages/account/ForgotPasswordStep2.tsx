import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import EmailOutlineIcon from '../../icons/EmailOutlineIcon';
import './ForgotPasswordStep2.scss'

function ForgotPasswordStep2() {

    let history = useHistory();
    
    return (
        <>
            <div className="ForgotPasswordStep2 d-flex flex-column justify-content-center">

                <div className="Icon mx-auto mb-5"><EmailOutlineIcon /></div>

                <div className="fs-3 text-center mb-5">Восстановить пароль</div>

                <div className="Text mb-3">На указанный email было выслано письмо для восстановления пароля</div>

                <div className="d-flex justify-content-center"><button type='button' className='Action btn' onClick={() => history.push('/')}>На главную</button></div>

            </div>
        </>
    );
}

export default ForgotPasswordStep2;