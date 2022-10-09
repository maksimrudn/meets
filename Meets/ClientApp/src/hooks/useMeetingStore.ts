import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/createStore";
import {
    cancel,
    confirm,
    discuss,
    edit,
    IMeetingState,
    sendMessage,
    updateMeeting,
    updateMessages
} from "../store/meeting";

interface IMeetingsStore extends IMeetingState {
    updateMeeting: (meetingId: any) => Promise<void>
    updateMessages: (meetingId: any) => Promise<void>
    sendMessage: (meetingId: any, text: any, receiverId: any) => Promise<void>
    discuss: (meetingId: any) => Promise<void>
    cancel: (meetingId: any) => Promise<void>
    confirm: (meetingId: any) => Promise<void>
    edit: (meetingId: any, value: string, fieldName: string) => Promise<void>
}

function useMeetingStore(): IMeetingsStore {
    const meeting = useSelector((state: RootState) => state.meeting);
    const dispatch = useDispatch();

    return {
        ...meeting,
        updateMeeting: async (meetingId) => { await dispatch(updateMeeting(meetingId)); },
        updateMessages: async (meetingId) => { await dispatch(updateMessages(meetingId)); },
        sendMessage: async (meetingId, text, receiverId) => { await dispatch(sendMessage(meetingId, text, receiverId)); },
        discuss: async (meetingId) => { await dispatch(discuss(meetingId)); },
        cancel: async (meetingId) => { await dispatch(cancel(meetingId)); },
        confirm: async (meetingId) => { await dispatch(confirm(meetingId)); },
        edit: async (meetingId, value, fieldName) => { await dispatch(edit(meetingId, value, fieldName)); }
    };
}

export default useMeetingStore;