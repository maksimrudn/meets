import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import GetTimeTableDTO from '../contracts/meeting/GetTimeTableDTO';
import meetingsService from '../api/MeetingsService';



interface ITimeTableInitialState {
    timeTable: GetTimeTableDTO[] | null
    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: ITimeTableInitialState = {
    timeTable: null,
    isLoading: false,
    error: null,
    dataLoaded: false
}

const plansSlice = createSlice({
    name: 'timeTable',
    initialState: initialState,
    reducers: {
        plansRequested: state => {
            state.isLoading = true;
        },
        plansReceived: (state, action) => {
            state.timeTable = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
        plansFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        }
    }
});

const { actions, reducer: timeTableReducer } = plansSlice;
const { plansRequested, plansReceived, plansFailed } = actions;

export const updateTimeTable = (): AppThunk => async dispatch => {
    dispatch(plansRequested());

    try {
        const td = meetingsService.getTimeTable();
        dispatch(plansReceived(td));
    } catch (err: any) {
        dispatch(plansFailed(err.message));
    }
}

export default timeTableReducer;