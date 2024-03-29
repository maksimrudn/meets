﻿import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/createStore";
import { ITimeTableState, updateTimeTable } from "../store/timetable";

interface ITimeTableStore extends ITimeTableState {
    update: () => Promise<void>
}

function useTimeTableStore(): ITimeTableStore {
    const timeTable = useSelector((state: RootState) => state.timeTable);
    const dispatch = useDispatch();

    return { ...timeTable, update: async () => { await dispatch(updateTimeTable()); } };
}

export default useTimeTableStore;