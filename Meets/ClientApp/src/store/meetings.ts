import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import MeetingDTO from '../contracts/meeting/MeetingDTO';
import meetingsService from '../api/MeetingsService';

export interface IMeetingsState {
    meetings: MeetingDTO[]
    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: IMeetingsState = {
    meetings: [] as MeetingDTO[],
    isLoading: false,
    error: null,
    dataLoaded: false
}

const meetingsSlice = createSlice({
    name: 'meetings',
    initialState: initialState,
    reducers: {
        meetingsRequested: state => {
            state.isLoading = true;
            state.dataLoaded = false;
        },
        meetingsReceived: (state, action) => {
            state.meetings = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
            state.error = null;
        },
        meetingsFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
    }
});

const { actions, reducer: meetingsReducer } = meetingsSlice;
const { meetingsRequested, meetingsReceived, meetingsFailed } = actions;

export const updateMeetings = (): AppThunk => async dispatch => {
    dispatch(meetingsRequested());

    try {
        let meetings = meetingsService.getList();
        await dispatch(meetingsReceived(meetings));
    } catch (err: any) {
        dispatch(meetingsFailed(err.message));
        throw err;
    }
}

export default meetingsReducer;