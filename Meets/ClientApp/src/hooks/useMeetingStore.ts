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
    updateMeeting: (meetingId: any) => void
    updateMessages: (meetingId: any) => void
    sendMessage: (meetingId: any, text: any, receiverId: any) => void
    discuss: (meetingId: any) => void
    cancel: (meetingId: any) => void
    confirm: (meetingId: any) => void
    edit: (meetingId: any, value: string, fieldName: string) => void
}

function useMeetingStore(): IMeetingsStore {
    const meeting = useSelector((state: RootState) => state.meeting);
    const dispatch = useDispatch();

    return {
        ...meeting,
        updateMeeting: (meetingId) => { dispatch(updateMeeting(meetingId)); },
        updateMessages: (meetingId) => { dispatch(updateMessages(meetingId)); },
        sendMessage: (meetingId, text, receiverId) => { dispatch(sendMessage(meetingId, text, receiverId)); },
        discuss: (meetingId) => { dispatch(discuss(meetingId)); },
        cancel: (meetingId) => { dispatch(cancel(meetingId)); },
        confirm: (meetingId) => { dispatch(confirm(meetingId)); },
        edit: (meetingId, value, fieldName) => { dispatch(edit(meetingId, value, fieldName)); }
    };
}

export default useMeetingStore;