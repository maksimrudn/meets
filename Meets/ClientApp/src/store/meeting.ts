import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import GetMeetingDTO from '../contracts/meeting/GetMeetingDTO';
import MessageDTO from '../contracts/message/MessageDTO';
import meetingsService from '../api/MeetingsService';
import messageService from '../api/MessageService';
import MeetingFieldNames from '../common/MeetingFieldNames';

export interface IMeetingState {
    meeting: GetMeetingDTO
    messages: MessageDTO[]
    isLoading: boolean
    error: string | null
    dataLoaded: boolean
}

const initialState: IMeetingState = {
    meeting: {} as GetMeetingDTO,
    messages: [] as MessageDTO[],
    isLoading: false,
    error: null,
    dataLoaded: false
};

const meetingSlice = createSlice({
    name: 'meeting',
    initialState: initialState,
    reducers: {
        meetingRequested: state => {
            state.isLoading = true;
            state.dataLoaded = false;
        },
        meetingReceived: (state, action) => {
            state.meeting = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
            state.error = null;
        },
        meetingFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
        },
        messagesReceived: (state, action) => {
            state.messages = action.payload;
            //state.isLoading = false;
            //state.dataLoaded = true;
        },
        messagesFailed: (state, action) => {
            state.error = action.payload;
            //state.isLoading = false;
            //state.dataLoaded = true;
        },
    }
});

const { actions, reducer: meetingReducer } = meetingSlice;
const {
    meetingRequested,
    meetingReceived,
    meetingFailed,
    messagesReceived,
    messagesFailed
} = actions;

export const updateMeeting = (meetingId: any): AppThunk => async (dispatch, getState) => {
    dispatch(meetingRequested());

    try {
        let mt = await meetingsService.get(meetingId);
        await dispatch(meetingReceived(mt));
    } catch (err: any) {
        dispatch(meetingFailed(err.message));
        throw err;
    }
}

export const updateMessages = (meetingId: any): AppThunk => async (dispatch, getState) => {
    try {
        let res = await messageService.getMessages(meetingId);
        await dispatch(messagesReceived(res));
    } catch (err: any) {
        dispatch(messagesFailed(err.message));
        throw err;
    }
}

export const sendMessage = (meetingId: any, text: any, receiverId: any): AppThunk => async (dispatch, getState) => {
    try {
        var msgDto = {
            receiverId: receiverId,
            text: text,
            meetingId: meetingId
        };

        await messageService.sendMessage(msgDto);
        await dispatch(updateMessages(meetingId));
    } catch (err: any) {
        dispatch(messagesFailed(err.message));
        throw err;
    }
}

export const discuss = (meetingId: any): AppThunk => async (dispatch, getState) => {
    try {
        await meetingsService.discuss(meetingId);
        await dispatch(updateMeeting(meetingId));
    } catch (err: any) {
        dispatch(messagesFailed(err.message));
        throw err;
    }
}

export const cancel = (meetingId: any): AppThunk => async (dispatch, getState) => {
    try {
        await meetingsService.cancel(meetingId);
        await dispatch(updateMeeting(meetingId));
    } catch (err: any) {
        dispatch(messagesFailed(err.message));
        throw err;
    }
}

export const confirm = (meetingId: any): AppThunk => async (dispatch, getState) => {
    try {
        await meetingsService.confirm(meetingId);
        await dispatch(updateMeeting(meetingId));
    } catch (err: any) {
        dispatch(messagesFailed(err.message));
        throw err;
    }
}

export const edit = (meetingId: any, value: string, fieldName: string): AppThunk => async (dispatch, getState) => {
    try {
        const state = getState().meeting;

        let mt = {
            id: meetingId,
            place: '',
            meetingDate: ''
        }

        if (fieldName === MeetingFieldNames.Date) {
            mt.place = state.meeting.place;
            mt.meetingDate = value;
        } else {
            mt.meetingDate = state.meeting.meetingDate;
            mt.place = value;
        }

        await meetingsService.edit(mt);
        await dispatch(updateMeeting(meetingId));
    } catch (err: any) {
        dispatch(messagesFailed(err.message));
        throw err;
    }
}

export default meetingReducer;