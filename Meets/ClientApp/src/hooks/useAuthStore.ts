import { useDispatch, useSelector } from "react-redux";
import { IAuthState, login, logout } from "../store/auth";
import { RootState, useAppDispatch } from "../store/createStore";

interface IAuthStore extends IAuthState {
    login(email: string, password: string): void
    logout(): void
}

function useAuthStore(): IAuthStore {
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    return {
        ...auth,
        login: (email: string, password: string) => { dispatch(login(email, password)); },
        logout: () => { dispatch(logout); }
    }

}

export default useAuthStore;