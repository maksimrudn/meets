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
    id: 0,
    gender: '',
    birthDate: '',
    avatar: '',
    city: '',
    company: '',
    job: '',
    fullName: '',
    lockoutEnabled: false,
    tags: [],
    latitude: 0,
    longitude: 0,
    hasGeolocation: false,

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
        state.id = action.payload.id;
        state.gender = action.payload.gender;
        state.birthDate = action.payload.birthDate;
        state.avatar = action.payload.avatar;
        state.city = action.payload.city;
        state.company = action.payload.company;
        state.job = action.payload.job;
        state.fullName = action.payload.fullName;
        state.lockoutEnabled = action.payload.lockoutEnabled;
        state.tags = action.payload.tags;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.hasGeolocation = action.payload.hasGeolocation;
        state.isLoading = false;
        state.dataLoaded = true;
        state.error = null;
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


export const updateCurrentUserOrThrow = (): AppThunk => async dispatch => {
    dispatch(requested());

    try {
        const currentUser = accountService.getCurrentUser();
        dispatch(received(currentUser));
    } catch (error: any) {
        dispatch(failed(error.message));
        throw error;
    }
};

export const updateCurrentUser = (): AppThunk => async dispatch => {
    try {
        dispatch(updateCurrentUserOrThrow());
    } catch (error: any) {
        
    }
};




export default currentUserReducer;
