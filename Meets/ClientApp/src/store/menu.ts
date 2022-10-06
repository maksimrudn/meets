import { AppThunk, RootState } from './createStore';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { BottomMenuItems } from '../common/BottomMenuItems';

export interface IMenuState {
    selectedMenuItem: string

}

const initialState: IMenuState = {
    selectedMenuItem: BottomMenuItems.UserSearch
}

const menuSlice = createSlice({
    name: 'menu',
    initialState: initialState,
    reducers: {
        updated: (state, action) => {
            state.selectedMenuItem = action.payload;
        }
    }
});

const { actions, reducer: menuReducer } = menuSlice;
const { updated } = actions;

export const setSelectedMenuItem = (item: string): AppThunk => async dispatch => {
    switch (item) {
        case BottomMenuItems.UserSearch:
            dispatch(updated(BottomMenuItems.UserSearch));
            //setSelectedMenuItem(BottomMenuItems.UserSearch);
            break;
        case BottomMenuItems.Profie:
            dispatch(updated(BottomMenuItems.Profie));
            //setSelectedMenuItem(BottomMenuItems.Profie);
            break;
        case BottomMenuItems.Meetings:
            dispatch(updated(BottomMenuItems.Meetings));
            //setSelectedMenuItem(BottomMenuItems.Meetings);
            break;
        case BottomMenuItems.Notifications:
            dispatch(updated(BottomMenuItems.Notifications));
            //setSelectedMenuItem(BottomMenuItems.Notifications);
            break;
        case BottomMenuItems.TimeTable:
            dispatch(updated(BottomMenuItems.TimeTable));
            //setSelectedMenuItem(BottomMenuItems.TimeTable);
            break;
    }
}

export default menuReducer;