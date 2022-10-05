import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import UserListItemDTO from '../contracts/user/UserListItemDTO';
import userService from '../api/UserService';

export interface IFilter {
    city: string
    tags: string[]
    growthFrom: number
    growthTo: number
    weightFrom: number
    weightTo: number
    ageFrom: number
    ageTo: number
    company: string
    learning: string
    activity: string
}


export interface IUsersState {
    users: UserListItemDTO[] | null
    filter: IFilter
    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: IUsersState = {
    users: null,
    filter: {
        city: '',
        tags: [],
        growthFrom: 0,
        growthTo: 0,
        weightFrom: 0,
        weightTo: 0,
        ageFrom: 0,
        ageTo: 0,
        company: '',
        learning: '',
        activity: ''
    },
    isLoading: false,
    error: null,
    dataLoaded: false 
}

const usersSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        usersRequested: state => {
            state.isLoading = true;
        },
        usersReceived: (state, action) => {
            state.users = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
            state.error = null;
        },
        usersFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
        filterUpdated: (state, action) => {
            //const { key, value } = action.payload;
            state.filter = action.payload;
        }
    }
});

const { actions, reducer: usersReducer } = usersSlice;
const { usersRequested, usersReceived, usersFailed, filterUpdated } = actions;

export const updateUsers = (): AppThunk => async (dispatch, getState) => {
    dispatch(usersRequested());

    try {
        const state = getState();

        const users = userService.getList(state.users.filter);
        dispatch(usersReceived(users));
    } catch (err: any) {
        dispatch(usersFailed(err.message));
    }
}

export const updateFilter = (/*filterField: string, value: any*/ filter: IFilter): AppThunk => async (dispatch, getState) => {
    dispatch(usersRequested());

    try {
        dispatch(filterUpdated(filter));
    } catch (err: any) {
        //dispatch(usersFailed(err.message));
    }
}

export default usersReducer;