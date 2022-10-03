import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import UserAuthInfo from '../contracts/UserAuthInfo';
import userService from '../api/UserService';
import IUserAuthInfo from '../contracts/IUserAuthInfo';
import { stat } from 'fs';



interface ICurrentUserInitialState  {
    userId: number
    user: UserAuthInfo | null
    isLoading: boolean,
    error: string | null,
    dataLoaded: boolean
};


const initialState: ICurrentUserInitialState = {
    userId: 0,
    user: null,
    isLoading: false,
    error: null,
    dataLoaded: false
};

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: initialState,
  reducers: {
    currentUserRequested: state => {
      state.isLoading = true;
    },
    currentUserReceived: (state, action) => {
        state.userId = action.payload.user.id;
        state.user = action.payload;
        state.isLoading = false;
        state.dataLoaded = true;
      },
    currentUserFailed: (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        state.dataLoaded = true;
    },
  },
});

const { actions, reducer: currentUserReducer } = currentUserSlice;

const { currentUserRequested, currentUserReceived, currentUserFailed } = actions;

export const updateCurrentUser = (): AppThunk => async dispatch => {
    dispatch(currentUserRequested());

    try {
        const userAuthInfo = userService.getAuthInfo();
        dispatch(currentUserReceived(userAuthInfo));
    } catch (error: any) {
        dispatch(currentUserFailed(error.message));
    }
};


export const getCurrentUser = () => (state: RootState) => state.currentUser.userId;
export const getIsLoggedIn = () => (state: RootState) => state.currentUser.userId != 0;


export default currentUserReducer;
