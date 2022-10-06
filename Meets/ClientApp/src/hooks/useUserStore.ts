import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/createStore";
import { editUser, IUserState, removeAvatar, updateUser } from "../store/user";

interface IUserStore extends IUserState {
    updateUser: (userId: any) => void
    editUser: (fieldName: string, value: any) => void
    removeAvatar: () => void
}

function useUserStore(): IUserStore {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    return {
        ...user,
        updateUser: (userId) => { dispatch(updateUser(userId)); },
        editUser: (fieldName, value) => { dispatch(editUser(fieldName, value)); },
        removeAvatar: () => { dispatch(removeAvatar()); }
    };
} 

export default useUserStore;