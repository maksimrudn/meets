import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import UserDTO from '../contracts/user/UserDTO';
import IUserDTO from '../contracts/user/IUserDTO';
import accountService from '../api/AccountService';




export interface ICurrentUserState extends IUserDTO  {
    isLoading: boolean,
    error: string | null,
    dataLoaded: boolean
};


const initialState: ICurrentUserState = {
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
        state = { ...action.payload };
        state.isLoading = false;
        state.dataLoaded = true;
        state.error = "asdf";
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


//export const updateCurrentUserOrThrow = (): AppThunk => async dispatch => {
//    dispatch(requested());

//    try {
//        const currentUser = accountService.getCurrentUser();
//        dispatch(received(currentUser));
//    } catch (error: any) {
//        dispatch(failed(error.message));
//        throw error;
//    }
//};

//export const updateCurrentUser = (): AppThunk => async dispatch => {
//    try {
//        dispatch(updateCurrentUserOrThrow());
//    } catch (error: any) {
        
//    }
//};

export const updateCurrentUser = (): AppThunk => async dispatch => {
    dispatch(currentUserRequested());

    try {
        const userAuthInfo = accountService.getCurrentUser();
        dispatch(currentUserReceived(userAuthInfo));
    } catch (error: any) {
        dispatch(currentUserFailed(error.message));
    }
};


export default currentUserReducer;
