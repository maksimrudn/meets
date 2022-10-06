import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import accountReducer from './account';
import usersReducer from './users';
import userReducer from './user';
import timeTableReducer from './timetable';

const rootReducer = combineReducers({
    account: accountReducer,
    //currentUser: currentUserReducer,
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
