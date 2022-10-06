import { useDispatch, useSelector } from "react-redux";
import { IAccountState, login, logout, updateCurrentUserOrThrow } from "../store/account";
import { RootState, useAppDispatch } from "../store/createStore";

interface IAuthStore extends IAccountState {
    login(email: string, password: string): void
    logout(): void
    update: () => void
}

function useAccountStore(): IAuthStore {
    const account = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch();

    return {
        ...account,
        login: (email: string, password: string) => { dispatch(login(email, password)); },
        logout: () => { dispatch(logout); },
        update: () => { dispatch(updateCurrentUserOrThrow()) }
    }

}

export default useAccountStore;