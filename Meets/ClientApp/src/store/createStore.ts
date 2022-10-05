import currentUserReducer from './currentUser';
import timeTableReducer from './TimeTable';

import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './auth';
import usersReducer from './users';
import userReducer from './user';

const rootReducer = combineReducers({
    auth: authReducer,
    currentUser: currentUserReducer,
    users: usersReducer,
    user: userReducer,
    timeTable: timeTableReducer
});

export function createStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk = ThunkAction<Promise<any>, RootState, unknown, Action>;
