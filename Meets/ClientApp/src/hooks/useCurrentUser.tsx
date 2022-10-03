import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/createStore";
import { updateCurrentUser, ICurrentUserState } from "../store/currentUser";


interface ICurrentUserStore extends ICurrentUserState {
    update(): void
}

function useStoreCurrentUser(): ICurrentUserStore {
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();

    return { ...currentUser, update: () => { dispatch(updateCurrentUser()); } }

}

export default useStoreCurrentUser;