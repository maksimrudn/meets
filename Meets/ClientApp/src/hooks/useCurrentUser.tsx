import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/createStore";
import { updateCurrentUser } from "../store/currentUser";


function useCurrentUser() {
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();

    return { ...currentUser, update: ()=> { dispatch(updateCurrentUser()); }}

}

export default useCurrentUser;