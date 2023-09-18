import React from 'react';
import { useHistory } from 'react-router-dom';
import BlockedIcon from '../../icons/BlockedIcon';

import './Lockout.scss';

function Lockout() {
    let history = useHistory();

    return (
        <>
            <div className="Lockout d-flex flex-column justify-content-center">

                <div className="Icon mx-auto mb-5"><BlockedIcon /></div>

                <div className="Title fs-3 text-center">Blocked</div>

                <div className="d-flex justify-content-center"><button type='button' className='Action btn' onClick={() => history.push('/')}>Main page</button></div>

            </div>

        </>
    );
}

export default Lockout;