import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import UserAuthInfo from '../contracts/UserAuthInfo';
import userService from '../api/UserService';
import IUserAuthInfo from '../contracts/IUserAuthInfo';




export interface ICurrentUserState  {
    userId: number
    user: UserAuthInfo | null
    isLoading: boolean,
    error: string | null,
    dataLoaded: boolean
};


const initialState: ICurrentUserState = {
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
    requested: state => {
      state.isLoading = true;
    },
    received: (state, action) => {
        state.userId = action.payload.user.id;
        state.user = action.payload;
        state.isLoading = false;
        state.dataLoaded = true;
      },
    failed: (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        state.dataLoaded = true;
    },
  },
});

const { actions, reducer: currentUserReducer } = currentUserSlice;

const { requested, received, failed } = actions;

export const updateCurrentUser = (): AppThunk => async dispatch => {
    dispatch(requested());

    try {
        const userAuthInfo = userService.getAuthInfo();
        dispatch(received(userAuthInfo));
    } catch (error: any) {
        dispatch(failed(error.message));
    }
};


export const getCurrentUser = () => (state: RootState) => state.currentUser.userId;
export const getIsLoggedIn = () => (state: RootState) => state.currentUser.userId != 0;


export default currentUserReducer;
