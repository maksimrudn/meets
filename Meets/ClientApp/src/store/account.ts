import { AppThunk, RootState } from './createStore';
import { createAction, createSlice, current } from '@reduxjs/toolkit';
import accountService from '../api/AccountService';
import * as Cookies from 'js-cookie';
import { isSignedIn } from '../common/Utils';
//import { updateCurrentUserOrThrow } from './currentUser';
import IUserDTO from '../contracts/user/IUserDTO';



export interface IAccountState {
    currentUser: IUserDTO | null
    isSignedIn: boolean
    isLoading: boolean
    error: string | null
    dataLoaded: boolean
};


const initialState: IAccountState = {
    currentUser: null,
    isSignedIn: isSignedIn(),
    isLoading: false,
    error: null,
    dataLoaded: false
};

const authSlice = createSlice({
    name: 'account',
    initialState: initialState,
    reducers: {
        authRequested: state => {
            state.error = null;
            state.isLoading = true;
        },
        authReceived: (state, action) => {
            state.isSignedIn = action.payload;
            state.isLoading = false;
        },
        authFailed: (state, action) => {
            state.error = action.payload;
            state.isSignedIn = false;
            state.isLoading = false;
        },
        currentUserRequested: (state) => {
            state.isLoading = true;
            state.error = null;
            state.dataLoaded = false;
        },
        currentUserReceived: (state, action) => {
            state.currentUser = action.payload;
            state.dataLoaded = true;
            state.isLoading = false;
        },
        currentUserFailed: (state, action) => {
            state.error = action.payload;
            state.dataLoaded = true;
            state.isLoading = false;
        },
        clean: (state) => {
            state = initialState;
        },
    },
});

const { actions, reducer: accountReducer } = authSlice;

const {
    authRequested,
    authReceived,
    authFailed,
    currentUserRequested,
    currentUserReceived,
    currentUserFailed,
    clean
} = actions;

export const refreshToken = (): AppThunk => async (dispatch, getState) => {
    dispatch(authRequested());

    try {
        let jwtResponse = accountService.refreshToken();
        Cookies.set('access_token', jwtResponse.accessToken);

        await dispatch(authReceived(true));
    } catch (error: any) {
        dispatch(authFailed(error.message));
        throw error;
    }
}

export const login = (email: string, password: string): AppThunk => async dispatch => {
    dispatch(authRequested());

    try {
        var jwtResponse = accountService.login(email, password);
        Cookies.set('access_token', jwtResponse.accessToken);


        try {
            dispatch(updateCurrentUser());
        }
        catch (error: any) {
            dispatch(authFailed(error.message));
            throw error;
        }

        await dispatch(authReceived(true));


    } catch (error: any) {
        dispatch(authFailed(error.message));
        throw error;
    }

    
};

export const logout = (): AppThunk => async dispatch => {

    Cookies.remove('access_token');

    await clean();

};

export const register = (fullName: string, email: string, password: string, confirmPassword: string): AppThunk => async dispatch => {
    dispatch(authRequested());

    try {
        let jwtResponse = accountService.register(fullName, email, password, confirmPassword);
        Cookies.set('access_token', jwtResponse.accessToken);

        await dispatch(updateCurrentUser());
        await dispatch(authReceived(true));
    } catch (error: any) {
        dispatch(authFailed(error.message));
        throw error;
    }
};

export const confirmEmail = (userId: any, code: any): AppThunk => async dispatch => {
    dispatch(authRequested());

    try {
        let jwtResponse = accountService.confirmEmail(userId, code);
        Cookies.set('access_token', jwtResponse.accessToken);

        await dispatch(updateCurrentUser());
        await dispatch(authReceived(true));
    } catch (error: any) {
        dispatch(authFailed(error.message));
        throw error;
    }
}

export const forgotPassword = (email: string): AppThunk => async dispatch => {

    try {
        accountService.forgotPassword(email);
    } catch (error: any) {
        throw error;
    }
}

export const resetPassword = (code: string, email: string, password: string, confirmPassword: string): AppThunk => async dispatch => {
    dispatch(authRequested());

    try {
        accountService.resetPassword(code, email, password, confirmPassword);

        await dispatch(updateCurrentUser());
        await dispatch(authReceived(true));
    } catch (error: any) {
        dispatch(authFailed(error.message));
        throw error;
    }
}

export const updateCurrentUser = (): AppThunk => async dispatch => {
    dispatch(currentUserRequested());

    try {
        const currentUser = accountService.getCurrentUser();
        await dispatch(currentUserReceived(currentUser));
    } catch (error: any) {
        dispatch(currentUserFailed(error.message));
        throw error;
    }
};


export default accountReducer;
