import React from 'react';
import { useHistory } from 'react-router-dom';
import CheckIcon from '../../icons/CheckIcon';
import EmailOutlineIcon from '../../icons/EmailOutlineIcon';

import './ConfirmEmailSuccess.scss';


function ConfirmEmailSuccess() {
    let history = useHistory();

    return (
        <>
            <div className="ConfirmEmailSuccess d-flex flex-column justify-content-center">

                <div className="Icon mx-auto mb-5"><CheckIcon /></div>

                <div className="Title fs-3 text-center">Email is confirmed!</div>

                <div className="d-flex justify-content-center"><button type='button' className='Action btn' onClick={() => history.push('/')}>Main page</button></div>

            </div>
        </>
    );
}

export default ConfirmEmailSuccess;