import * as Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import accountService from '../../api/AccountService';
import userService from '../../api/UserService';
import { connect, useSelector } from 'react-redux';
import mapDispatchToProps from '../../store/mapDispatchToProps';
import mapStateToProps from '../../store/mapStateToProps';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Routes  from '../../common/Routes';
import { RootState, useAppDispatch } from '../../store/createStore';
import { updateCurrentUser } from '../../store/currentUser';

function ConfirmEmail() {
    let history = useHistory();
    let { search } = useLocation();

    const currentUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();

    useEffect(() => {
        try {
            // получить данные из урла и json`ом отправить на ConfirmEmail метод AccountController
            let query = new URLSearchParams(search);
            let userId = query.get('userId');
            let code = query.get('code');

            let jwtResponse = accountService.confirmEmail(userId, code);
            Cookies.set('access_token', jwtResponse.accessToken);

            dispatch(updateCurrentUser);

            history.push('/account/confirmEmailSuccess');

        } catch (err) {
            history.push( Routes.Error, err );
        }
    }, []);

    return (
        <>
            <NotificationContainer />
        </>
    );
}

export default ConfirmEmail;