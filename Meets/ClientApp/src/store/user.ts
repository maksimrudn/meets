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

export interface IUserState { // extends IUserCardResponse
    user: UserCardResponse | null
    
    tabHeader: ITabHeaderItem[]
    //tabInfo: ITabInfo
    //tabLearnings: Learning[]
    //tabWorks: Work[]
    //tabActivities: Activity[]
    //tabFacts: Fact[]
    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: IUserState = {
    user: null,
    //id: 0,
    //gender: '',
    //birthDate: '',
    //avatar: '',
    //city: '',
    //company: '',
    //job: '',
    //specialization: '',
    //fullName: '',
    //lockoutEnabled: false,
    //tags: [],
    //latitude: 0,
    //longitude: 0,
    //description: '',
    //growth: 0,
    //weight: 0,
    //subscribers: 0,
    //subscriptions: 0,
    //learnings: [],
    //works: [],
    //activities: [],
    //facts: [],
    //distance: 0,
    //isSubscribed: false,
    //friendRequestIsRejected: false,
    //meetings: 0,
    //isInvited: false,
    tabHeader: [],
    //tabInfo: {
    //    birthDate: '',
    //    city: '',
    //    description: '',
    //    growth: 0,
    //    weight: 0
    //},
    //tabLearnings: [],
    //tabWorks: [],
    //tabActivities: [],
    //tabFacts: [],
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
            //state.id = action.payload.id;
            //state.gender = action.payload.gender;
            //state.birthDate = action.payload.birthDate;
            //state.avatar = action.payload.avatar;
            //state.city = action.payload.city;
            //state.company = action.payload.company;
            //state.job = action.payload.job;
            //state.specialization = action.payload.specialization;
            //state.fullName = action.payload.fullName;
            //state.lockoutEnabled = action.payload.lockoutEnabled;
            //state.tags = action.payload.tags;
            //state.latitude = action.payload.latitude;
            //state.longitude = action.payload.longitude;
            //state.description = action.payload.description;
            //state.growth = action.payload.growth;
            //state.weight = action.payload.weight;
            //state.subscribers = action.payload.subscribers;
            //state.subscriptions = action.payload.subscriptions;
            //state.learnings = action.payload.learnings;
            //state.works = action.payload.works;
            //state.activities = action.payload.activities;
            //state.facts = action.payload.facts;
            //state.distance = action.payload.distance;
            //state.isSubscribed = action.payload.isSubscribed;
            //state.friendRequestIsRejected = action.payload.friendRequestIsRejected;
            //state.meetings = action.payload.meetings;
            //state.isInvited = action.payload.isInvited;
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
            //state.tabInfo = action.payload;
            //state.tabLearnings = action.payload.learnings;
            //state.tabWorks = action.payload.works;
            //state.tabActivities = action.payload.activities;
            //state.tabFacts = action.payload.facts;
            state.isLoading = false;
            state.dataLoaded = true;
            state.error = null;
        },
        userFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
    //    userEdited: (state, action) => {

    //    }
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
        ...state,
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