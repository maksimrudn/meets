import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/createStore";
import { IMeetingsState, updateMeetings } from "../store/meetings";

interface IMeetingsStore extends IMeetingsState {
    update: () => Promise<void>
}

function useMeetingsStore(): IMeetingsStore {
    const meetings = useSelector((state: RootState) => state.meetings);
    const dispatch = useDispatch();

    return {
        ...meetings,
        update: async () => { await dispatch(updateMeetings()); }
    };
}

export default useMeetingsStore;