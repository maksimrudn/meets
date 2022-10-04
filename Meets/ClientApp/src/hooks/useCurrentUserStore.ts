import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/createStore";
import { updateCurrentUser, ICurrentUserState } from "../store/currentUser";


interface ICurrentUserStore extends ICurrentUserState {
    update(): void
}

function useCurrentUserStore(): ICurrentUserStore {
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useDispatch();

    return { ...currentUser, update: () => { dispatch(updateCurrentUser()); } }

}

export default useCurrentUserStore;