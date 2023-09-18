import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import ProfileSettingsDTO from '../contracts/user/ProfileSettingsDTO';
import userService from '../api/UserService';
import EditProfileSettingsDTO from '../contracts/user/EditProfileSettingsDTO';
import accountService from '../api/AccountService';
import { logout } from './account';

export interface ISettingsState {
    profile: ProfileSettingsDTO
    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: ISettingsState = {
    profile: {} as ProfileSettingsDTO,
    isLoading: false,
    error: null,
    dataLoaded: false
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialState,
    reducers: {
        settingsRequested: state => {
            state.isLoading = true;
            state.dataLoaded = false;
        },
        settingsReceived: (state, action) => {
            state.profile = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
            state.error = null;
        },
        settingsFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
        profileUpdated: (state, action) => {
            state.profile = action.payload;
        },
    }
});

const { actions, reducer: settingsReducer } = settingsSlice;
const { settingsRequested, settingsReceived, settingsFailed, profileUpdated } = actions;

export const updateSettings = (): AppThunk => async (dispatch, getState) => {
    dispatch(settingsRequested());

    try {
        const state = getState();

        const profile = await userService.getProfileSettings(state.account.currentUser?.id);
        await dispatch(settingsReceived(profile));
    } catch (err: any) {
        dispatch(settingsFailed(err.message));
        throw err;
    }
}

export const editSettings = (): AppThunk => async (dispatch, getState) => {

    try {
        const state = getState();

        let data = new EditProfileSettingsDTO();
        data = {
            ...state.settings.profile,
            userId: state.account.currentUser?.id
        };

        await userService.editProfileSettings(data);
        await dispatch(updateSettings());
    } catch (err: any) {
        dispatch(settingsFailed(err.message));
        throw err;
    }
}

export const setProfile = (profile: ProfileSettingsDTO): AppThunk => async (dispatch, getState) => {
    await dispatch(profileUpdated(profile));
}

export const removeAccount = (): AppThunk => async dispatch => {
    try {
        await accountService.removeAccount();
        await dispatch(logout());
    } catch (err: any) {
        dispatch(settingsFailed(err.message));
        throw err;
    }
}

export const confirmEmail = (email: string): AppThunk => async dispatch => {
    try {
        await userService.confirmEmail({ email });
    } catch (err: any) {
        dispatch(settingsFailed(err.message));
        throw err;
    }
}

export const changePassword = (oldPassword: string, newPassword: string, confirmPassword: string): AppThunk => async dispatch => {
    try {
        await userService.changePassword(oldPassword, newPassword, confirmPassword);
    } catch (err: any) {
        dispatch(settingsFailed(err.message));
        throw err;
    }
}

export default settingsReducer;