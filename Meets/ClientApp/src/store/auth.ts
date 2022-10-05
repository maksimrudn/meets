import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import accountService from '../api/AccountService';
import * as Cookies from 'js-cookie';
import { isSignedIn } from '../common/Utils';
import { updateCurrentUserOrThrow } from './currentUser';



export interface IAuthState   {
    isSignedIn: boolean
    isLoading: boolean
    error: string | null
};


const initialState: IAuthState = {
    isSignedIn: isSignedIn(),
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    requested: state => {
        state.isLoading = true;
    },
    received: (state, action) => {
        state.isSignedIn = action.payload;
        state.isLoading = false;
    },
    failed: (state, action) => {
        state.error = action.payload;
        state.isSignedIn = false;
        state.isLoading = false;
    },
  },
});

const { actions, reducer: authReducer } = authSlice;

const { requested, received, failed } = actions;

export const login = (email: string, password: string): AppThunk => async dispatch => {
    dispatch(requested());

    try {
        var jwtResponse = accountService.login(email, password);
        Cookies.set('access_token', jwtResponse.accessToken);

        
    } catch (error: any) {
        dispatch(failed(error.message));
        return;
    }

    try {
        dispatch(updateCurrentUserOrThrow());
    }
    catch (error: any) {
        dispatch(failed(error.message));
        return;
    }

    await dispatch(received(true));
};

export const logout = (): AppThunk => async dispatch => {
    dispatch(requested());

    Cookies.remove('access_token');

    try {
        dispatch(updateCurrentUserOrThrow());
    }
    catch (error: any) {
        dispatch(failed(error.message));
        return;
    }

    dispatch(received(false));
};



export default authReducer;
