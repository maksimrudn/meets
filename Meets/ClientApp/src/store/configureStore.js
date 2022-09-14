import { applyMiddleware, combineReducers, compose,createStore } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';

import { UserInfoReducer, } from './reducers';


export default function configureStore(history, initialState, sagaMiddleware) {
    //const sagaMiddleware = createSagaMiddleware();

    const middleware = [
        sagaMiddleware,
        routerMiddleware(history)
    ];

    const rootReducer = combineReducers({
        routing: connectRouter(history),
        userInfo: UserInfoReducer,
    });

    const enhancers = [];
    const windowIfDefined = typeof window === 'undefined' ? null : window ;
    if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
    }

    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );
}
