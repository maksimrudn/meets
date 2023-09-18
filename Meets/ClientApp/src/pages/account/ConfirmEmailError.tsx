import React from 'react';
import { useHistory } from 'react-router-dom';
import CheckIcon from '../../icons/CheckIcon';
import EmailOutlineIcon from '../../icons/EmailOutlineIcon';
import ExclamationIcon from '../../icons/ExclamationIcon';

import './ConfirmEmailError.scss';


function ConfirmEmailError() {
    let history = useHistory();

    return (
        <>
            <div className="ConfirmEmailError d-flex flex-column justify-content-center">

                <div className="Icon mx-auto mb-5"><ExclamationIcon /></div>

                <div className="fs-3 text-center mb-5">Email is not confirmed!</div>

                <div className="Text mb-3">Link for confirmation is outdated. Make new request for confirmation in settings. </div>

                <div className="d-flex justify-content-center"><button type='button' className='Action btn' onClick={() => history.push('/')}>Main page</button></div>

            </div>
        </>
    );
}

export default ConfirmEmailError;