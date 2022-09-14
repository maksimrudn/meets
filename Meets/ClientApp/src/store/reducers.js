import { combineReducers } from 'redux';

//import { routerReducer } from 'react-router-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import { appActions } from './appActions';
import initialState from './initialState';

//������� ������ ������ � ��������:

//��������������� �������� ��, ��� ������ � ���������� �������;
//��������� ����� - ���� ���� - �������: ���������� � API ��� ������������ ������� �� ������;
//�������� �� ������ �������, �������� Date.now() ��� Math.random().

export function UserInfoReducer(state = initialState.userInfo, action) {
    switch (action.type) {
        case appActions.UPDATE_USER_INFO:
            // ������������� ����������, � �� ��������� ������
            // �������� Object.assign(state, { visibilityFilter: action.filter })
            // �� Object.assign() ��� ����� ES6, �� ���� ����� �� �������������� ������� ����������
            // ����� ����� ������������ ������������ ��������, ������ ��� Babel, ���� ������ �� ������ ����������, � ������� _.assign() �� lodash.
            //!!!!
            // ������ ��������� � ���������� ����� �������� ��� state � MapStateProps
            return action.userInfo



        // ������-�� �� ��������, ���������� �����������.
        //return {
        //    ...state,
        //    userInfo: action.userInfo
        //}

        default: return state;
    }
}



const reducers = combineReducers({
    //routing: routerReducer,
    userInfo: UserInfoReducer,
});

export default reducers;