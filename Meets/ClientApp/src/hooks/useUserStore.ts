import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/createStore";
import { editUser, IUserState, removeAvatar, updateUser } from "../store/user";

interface IUserStore extends IUserState {
    updateUser: (userId: any) => Promise<void>
    editUser: (fieldName: string, value: any) => Promise<void>
    removeAvatar: () => Promise<void>
}

function useUserStore(): IUserStore {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    return {
        ...user,
        updateUser: async (userId) => { await dispatch(updateUser(userId)); },
        editUser: async (fieldName, value) => { await dispatch(editUser(fieldName, value)); },
        removeAvatar: async () => { await dispatch(removeAvatar()); }
    };
} 

export default useUserStore;