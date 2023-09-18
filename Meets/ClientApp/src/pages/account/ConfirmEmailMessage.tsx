import React from 'react';
import { useHistory } from 'react-router-dom';
import EmailOutlineIcon from '../../icons/EmailOutlineIcon';

import './ConfirmEmailMessage.scss';


function ConfirmEmailMessage() {
    let history = useHistory();

    return (
        <>
            <div className="ConfirmEmailMessage d-flex flex-column justify-content-center">

                <div className="Icon mx-auto mb-5"><EmailOutlineIcon /></div>

                <div className="fs-3 text-center mb-5">Confirm email</div>

                <div className="Text mb-3">For confirming email go by link from latter that we sent you to your email</div>

                <div className="d-flex justify-content-center"><button type='button' className='Action btn' onClick={() => history.push('/')}>Main page</button></div>

            </div>
        </>
    );
}

export default ConfirmEmailMessage;