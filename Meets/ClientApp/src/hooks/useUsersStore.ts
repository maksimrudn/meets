import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/createStore";
import { IFilter, IUsersState, updateFilter, updateUsers } from "../store/users";


interface IUsersStore extends IUsersState {
    updateFilter: (filter: IFilter) => void
}

function useUsersStore(): IUsersStore {
    const users = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();

    return {
        ...users,
        updateFilter: (filter) => { dispatch(updateFilter(filter)) }
    }
}

export default useUsersStore;