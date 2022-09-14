import { useHistory, useLocation } from 'react-router-dom';
import ApiError from '../../common/ApiError';
import IApiError from '../../common/IApiError';
import CheckIcon from '../../icons/CheckIcon';
import EmailOutlineIcon from '../../icons/EmailOutlineIcon';
import ExclamationIcon from '../../icons/ExclamationIcon';

import './Error.scss';


function Error() {
    let history = useHistory();
    let location = useLocation<IApiError>();

    // Обработка ситуации, когда на страницу не были переданы данные об ошибке. Если это случилось, значит данные не были переданы в state при push
    if (!location.state) location.state = new ApiError("Отсутствуют данные об ошибке. Проблема отображения на странице.")

    return (
        <>
            <div className="Error d-flex flex-column justify-content-center">

                <div className="Icon mx-auto mb-5"><ExclamationIcon /></div>

                <div className="fs-3 text-center mb-5">Ошибка {location.state.code}</div>

                <div className="Text mb-3">{location.state.message}</div>

                <div className="d-flex justify-content-center"><button type='button' className='Action btn' onClick={() => history.push('/')}>На главную</button></div>

            </div>
        </>
    );
}

export default Error;