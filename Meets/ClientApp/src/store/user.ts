import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import UserCardResponse from '../contracts/user/UserCardResponse';
import userService from '../api/UserService';
import { objectToFormData } from '../common/Utils';
import { UserFieldNames } from '../common/UserFieldNames';
import { updateCurrentUserOrThrow } from './account';
import { UserCardTabsNames } from '../common/UserCardTabsNames';
import { Learning } from '../contracts/learning/Learning';
import { Work } from '../contracts/work/Work';
import { Activity } from '../contracts/activity/Activity';
import { Fact } from '../contracts/fact/Fact';
import IUserCardResponse from '../contracts/user/IUserCardResponse';

interface ITabInfo {
    birthDate: any
    city: any
    description: any
    growth: any
    weight: any
}

interface ITabHeaderItem {
    title: string
    count: number
}

export interface IUserState { 
    user: UserCardResponse | null
    
    tabHeader: ITabHeaderItem[]

    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: IUserState = {
    user: null,
 
    tabHeader: [],

    isLoading: false,
    error: null,
    dataLoaded: false 
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        userRequested: state => {
            state.isLoading = true;
        },
        userReceived: (state, action) => {
            state.user = action.payload;
            
            state.tabHeader = [
                {
                    title: UserCardTabsNames.Info,
                    count: 1
                },
                {
                    title: UserCardTabsNames.Learning,
                    count: action.payload.learnings?.length
                },
                {
                    title: UserCardTabsNames.Work,
                    count: action.payload.works?.length
                },
                {
                    title: UserCardTabsNames.Activity,
                    count: action.payload.activities?.length
                },
                {
                    title: UserCardTabsNames.Facts,
                    count: action.payload.facts?.length
                }
            ];
           
            state.isLoading = false;
            state.dataLoaded = true;
            state.error = null;
        },
        userFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
    }
});

const { actions, reducer: userReducer } = userSlice;
const { userRequested, userReceived, userFailed } = actions;

export const updateUser = (userId: any): AppThunk => async (dispatch, getState) => {
    dispatch(userRequested());

    try {
        const userCard = userService.getCard(userId);
        await dispatch(userReceived(userCard));
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const editUser = (fieldName: string, value: any): AppThunk => async (dispatch, getState) => {
    const state = getState().user;

    let newData = {
        ...state.user,
        [fieldName]: value
    };

    let userData = objectToFormData(newData);

    if (state.user?.latitude && state.user?.longitude) {
        userData.set('latitude', `${state.user.latitude.toLocaleString('ru-Ru')}`);
        userData.set('longitude', `${state.user.longitude.toLocaleString('ru-Ru')}`);
    }

    userData.delete('tags');

    if (fieldName === UserFieldNames.Tags) {
        value.map((tag: any) => userData.append('Tags', tag));
    } else {
        state.user?.tags?.map((tag: any) => userData.append('Tags', tag));
    }

    try {
        userService.edit(userData);
        //updateUser(state.user?.id);
        const userCard = userService.getCard(state.user?.id);
        await dispatch(userReceived(userCard));

        await dispatch(updateCurrentUserOrThrow());
    }
    catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const removeAvatar = (): AppThunk => async (dispatch, getState) => {
    const state = getState().user;

    try {
        userService.removeAvatar();

        const userCard = userService.getCard(state.user?.id);
        await dispatch(userReceived(userCard));
    }
    catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }

    try {
        await dispatch(updateCurrentUserOrThrow());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export default userReducer;