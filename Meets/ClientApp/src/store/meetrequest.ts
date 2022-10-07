import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import MeetingRequest from '../contracts/meeting/MeetingRequest';
import meetingsService from '../api/MeetingsService';
import { updateUser } from './user';

export interface IMeetRequestState {
    meetRequest: MeetingRequest
    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: IMeetRequestState = {
    meetRequest: {} as MeetingRequest,
    isLoading: false,
    error: null,
    dataLoaded: false
};

const meetRequestSlice = createSlice({
    name: 'meetRequest',
    initialState: initialState,
    reducers: {
        meetRequestRequested: state => {
            state.isLoading = true;
            state.dataLoaded = false;
        },
        meetRequestReceived: (state) => {
            //state.meetRequest = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
            state.error = null;
        },
        meetRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
        meetRequestUpdated: (state, action) => {
            state.meetRequest = action.payload;
        },
    }
});

const { actions, reducer: meetRequestReducer } = meetRequestSlice;
const {
    meetRequestRequested,
    meetRequestReceived,
    meetRequestFailed,
    meetRequestUpdated
} = actions;

export const setMeetRequest = (meetRequest: MeetingRequest): AppThunk => async (dispatch, getState) => {
    await dispatch(meetRequestUpdated(meetRequest));
}

export const invite = (): AppThunk => async (dispatch, getState) => {
    dispatch(meetRequestRequested());

    const state = getState().meetRequest;

    try {
        meetingsService.invite(state.meetRequest);
    } catch (err: any) {
        dispatch(meetRequestFailed(err.message));
        throw err;
    }

    //await dispatch(updateUser(state.meetRequest.targetId));
    await dispatch(meetRequestReceived());
}

export default meetRequestReducer;