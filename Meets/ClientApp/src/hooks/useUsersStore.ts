import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/createStore";
import { IFilter, IUsersState, updateFilter, updateUsers } from "../store/users";


interface IUsersStore extends IUsersState {
    updateUsers: () => void
    updateFilter: (filter: IFilter) => void
}

function useUsersStore(): IUsersStore {
    const users = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();

    return {
        ...users,
        updateUsers: () => { dispatch(updateUsers()) },
        updateFilter: (filter) => { dispatch(updateFilter(filter)) }
    }
}

export default useUsersStore;