import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import accountReducer from './account';
import usersReducer from './users';
import userReducer from './user';
import timeTableReducer from './timetable';
import menuReducer from './menu';
import settingsReducer from './settings';
import meetRequestReducer from './meetrequest';
import meetingsReducer from './meetings';
import meetingReducer from './meeting';
import webRTCReducer from './webrtc';

const rootReducer = combineReducers({
    account: accountReducer,
    users: usersReducer,
    user: userReducer,
    settings: settingsReducer,
    timeTable: timeTableReducer,
    menu: menuReducer,
    meetRequest: meetRequestReducer,
    meetings: meetingsReducer,
    meeting: meetingReducer,
    webrtc: webRTCReducer
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
