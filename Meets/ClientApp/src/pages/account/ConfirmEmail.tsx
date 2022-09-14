import * as Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import accountService from '../../api/AccountService';
import userService from '../../api/UserService';
import { connect } from 'react-redux';
import mapDispatchToProps from '../../store/mapDispatchToProps';
import mapStateToProps from '../../store/mapStateToProps';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Routes  from '../../common/Routes';

function ConfirmEmail(props) {
    let history = useHistory();
    let { search } = useLocation();

    useEffect(() => {
        try {
            // получить данные из урла и json`ом отправить на ConfirmEmail метод AccountController
            let query = new URLSearchParams(search);
            let userId = query.get('userId');
            let code = query.get('code');

            let jwtResponse = accountService.confirmEmail(userId, code);
            Cookies.set('access_token', jwtResponse.accessToken);

            let userInfo = userService.getAuthInfo();
            props.UpdateUserInfo(userInfo);

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

export default connect(mapStateToProps("ConfirmEmail"), mapDispatchToProps("ConfirmEmail"))(ConfirmEmail);;