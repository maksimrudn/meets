import React from 'react';
import { useHistory } from 'react-router-dom';
import BlockedIcon from '../../icons/BlockedIcon';

import './AccessDenied.scss';

function AccessDenied() {
    let history = useHistory();

    return (
        <>
            <div className="AccessDenied d-flex flex-column justify-content-center">

                <div className="Icon mx-auto mb-5"><BlockedIcon /></div>

                <div className="Title fs-3 text-center">Доступ запрещён</div>

                <div className="d-flex justify-content-center"><button type='button' className='Action btn' onClick={() => history.push('/')}>На главную</button></div>

            </div>

        </>
    );
}

export default AccessDenied;