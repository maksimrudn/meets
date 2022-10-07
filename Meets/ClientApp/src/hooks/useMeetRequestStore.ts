import { useDispatch, useSelector } from "react-redux";
import MeetingRequest from "../contracts/meeting/MeetingRequest";
import { RootState } from "../store/createStore";
import { IMeetRequestState, invite, setMeetRequest } from "../store/meetrequest";

interface IMeetRequestStore extends IMeetRequestState {
    setMeetRequest: (meetRequest: MeetingRequest) => void
    invite: () => void
}

function useMeetRequestStore(): IMeetRequestStore {
    const meet = useSelector((state: RootState) => state.meetRequest);
    const dispatch = useDispatch();

    return {
        ...meet,
        setMeetRequest: (meetRequest) => { dispatch(setMeetRequest(meetRequest)); },
        invite: () => { dispatch(invite()); }
    };
}

export default useMeetRequestStore;