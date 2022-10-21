import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import UserCardResponse from '../contracts/user/UserCardResponse';
import userService from '../api/UserService';
import { objectToFormData } from '../common/Utils';
import { UserFieldNames } from '../common/UserFieldNames';
import { updateCurrentUser } from './account';
import { UserCardTabsNames } from '../common/UserCardTabsNames';
import { Learning } from '../contracts/learning/Learning';
import { Work } from '../contracts/work/Work';
import { Activity } from '../contracts/activity/Activity';
import { Fact } from '../contracts/fact/Fact';
import IUserCardResponse from '../contracts/user/IUserCardResponse';
import subscribtionService from '../api/SubscribtionService';
import learningService from '../api/LearningService';
import workService from '../api/WorkService';
import activityService from '../api/ActivityService';
import factService from '../api/FactService';

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

    isOwner: boolean
    
    tabHeader: ITabHeaderItem[]

    learning: Learning
    work: Work
    activity: Activity
    fact: Fact

    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: IUserState = {
    user: null,
    isOwner: false,
    tabHeader: [],
    learning: {} as Learning,
    work: {} as Work,
    activity: {} as Activity,
    fact: {} as Fact,
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
            state.user = action.payload.userCard;
            state.isOwner = action.payload.isOwnUserCard;
            
            state.tabHeader = [
                {
                    title: UserCardTabsNames.Info,
                    count: 1
                },
                {
                    title: UserCardTabsNames.Learning,
                    count: action.payload.userCard.learnings?.length
                },
                {
                    title: UserCardTabsNames.Work,
                    count: action.payload.userCard.works?.length
                },
                {
                    title: UserCardTabsNames.Activity,
                    count: action.payload.userCard.activities?.length
                },
                {
                    title: UserCardTabsNames.Facts,
                    count: action.payload.userCard.facts?.length
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
        learningUpdated: (state, action) => {
            state.learning = action.payload;
        },
        learningCleaned: state => {
            state.learning = {} as Learning;
        },
        workUpdated: (state, action) => {
            state.work = action.payload;
        },
        workCleaned: state => {
            state.work = {} as Work;
        },
        activityUpdated: (state, action) => {
            state.activity = action.payload;
        },
        activityCleaned: state => {
            state.activity = {} as Activity;
        },
        factUpdated: (state, action) => {
            state.fact = action.payload;
        },
        factCleaned: state => {
            state.fact = {} as Fact;
        },
    }
});

const { actions, reducer: userReducer } = userSlice;
const {
    userRequested,
    userReceived,
    userFailed,
    learningUpdated,
    learningCleaned,
    workUpdated,
    workCleaned,
    activityUpdated,
    activityCleaned,
    factUpdated,
    factCleaned
} = actions;

export const updateUser = (userId: any): AppThunk => async (dispatch, getState) => {
    dispatch(userRequested());

    try {
        const userCard = await userService.getCard(userId);
        const payload = {
            userCard,
            isOwnUserCard: getState().account.currentUser?.id === userCard.id
        }

        await dispatch(userReceived(payload));
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
        await userService.edit(userData);

        await dispatch(updateUser(state.user?.id));
        await dispatch(updateCurrentUser());
    }
    catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const removeAvatar = (): AppThunk => async (dispatch, getState) => {
    const state = getState().user;

    try {
        await userService.removeAvatar();

        await dispatch(updateUser(state.user?.id));
        await dispatch(updateCurrentUser());
    }
    catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const subscribe = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState().user;

        await subscribtionService.subscribe(state.user?.id);
        await dispatch(updateUser(state.user?.id));
    }
    catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const unSubscribe = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState().user;

        await subscribtionService.unSubscribe(state.user?.id);
        await dispatch(updateUser(state.user?.id));
    }
    catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const setLearning = (learning: Learning): AppThunk => async (dispatch, getState) => {
    await dispatch(learningUpdated(learning));
}

export const createLearning = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        await learningService.create(state.user.learning);
        await dispatch(updateUser(state.account.currentUser?.id));
        await dispatch(learningCleaned());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }

}

export const editLearning = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        const payload = {
            id: state.user.learning.id,
            startDate: state.user.learning.startDate as string,
            endDate: state.user.learning.endDate as string,
            title: state.user.learning.title
        };

        await learningService.edit(payload);
        await dispatch(updateUser(state.account.currentUser?.id));
        await dispatch(learningCleaned());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const removeLearning = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        const payload = {
            id: state.user.learning.id
        };
        await learningService.remove(payload);

        await dispatch(updateUser(state.account.currentUser?.id));
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const setWork = (work: Work): AppThunk => async (dispatch, getState) => {
    await dispatch(workUpdated(work));
}

export const createWork = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        await workService.create(state.user.work);
        await dispatch(updateUser(state.account.currentUser?.id));
        await dispatch(workCleaned());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }

}

export const editWork = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        const payload = {
            id: state.user.work.id,
            startDate: state.user.work.startDate as string,
            endDate: state.user.work.endDate as string,
            title: state.user.work.title,
            post: state.user.work.post
        };

        await workService.edit(payload);
        await dispatch(updateUser(state.account.currentUser?.id));
        await dispatch(workCleaned());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const removeWork = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        const payload = { id: state.user.work.id };
        await workService.remove(payload);

        await dispatch(updateUser(state.account.currentUser?.id));
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const setActivity = (activity: Activity): AppThunk => async (dispatch, getState) => {
    await dispatch(activityUpdated(activity));
}

export const createActivity = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        await activityService.create(state.user.activity);
        await dispatch(updateUser(state.account.currentUser?.id));
        await dispatch(activityCleaned());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }

}

export const editActivity = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        const payload = {
            id: state.user.activity.id,
            title: state.user.activity.title
        };

        await activityService.edit(payload);
        await dispatch(updateUser(state.account.currentUser?.id));
        await dispatch(activityCleaned());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const removeActivity = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        const payload = {
            id: state.user.activity.id
        };
        await activityService.remove(payload);

        await dispatch(updateUser(state.account.currentUser?.id));
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const setFact = (fact: Fact): AppThunk => async (dispatch, getState) => {
    await dispatch(factUpdated(fact));
}

export const createFact = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        await factService.create(state.user.fact);
        await dispatch(updateUser(state.account.currentUser?.id));
        await dispatch(factCleaned());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }

}

export const editFact = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        const payload = {
            id: state.user.fact.id,
            title: state.user.fact.title
        };

        await factService.edit(payload);
        await dispatch(updateUser(state.account.currentUser?.id));
        await dispatch(factCleaned());
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export const removeFact = (): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState();

        const payload = {
            id: state.user.fact.id
        };
        await factService.remove(payload);

        await dispatch(updateUser(state.account.currentUser?.id));
    } catch (err: any) {
        dispatch(userFailed(err.message));
        throw err;
    }
}

export default userReducer;