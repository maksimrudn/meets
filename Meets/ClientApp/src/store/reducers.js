import { combineReducers } from 'redux';

//import { routerReducer } from 'react-router-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import { appActions } from './appActions';
import initialState from './initialState';

//никогда нельзя делать в редюсере:

//Непосредственно изменять то, что пришло в аргументах функции;
//Выполнять какие - либо сайд - эффекты: обращаться к API или осуществлять переход по роутам;
//Вызывать не чистые функции, например Date.now() или Math.random().

export function UserInfoReducer(state = initialState.userInfo, action) {
    switch (action.type) {
        case appActions.UPDATE_USER_INFO:
            // рекомендуется копировать, а не передвать ссылку
            // например Object.assign(state, { visibilityFilter: action.filter })
            // но Object.assign() это часть ES6, но этот метод не поддерживается старыми браузерами
            // нужно будет использовать использовать полифилл, плагин для Babel, либо хелпер из другой библиотеки, к примеру _.assign() из lodash.
            //!!!!
            // данная структура в дальнейшем будет передана как state в MapStateProps
            return action.userInfo



        // почему-то не работает, начинается вложенность.
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