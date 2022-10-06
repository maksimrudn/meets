import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/createStore";
import { IMenuState, setSelectedMenuItem } from '../store/menu';

interface IMenuStore extends IMenuState {
    setSelectedItem: (item: string) => void
}

function useMenuStore(): IMenuStore {
    const menu = useSelector((state: RootState) => state.menu);
    const dispatch = useDispatch();

    return { ...menu, setSelectedItem: (item) => { dispatch(setSelectedMenuItem(item)); } };
}

export default useMenuStore;