import { useDispatch, useSelector } from "react-redux";
import {
    confirmEmail,
    forgotPassword,
    IAccountState,
    login,
    logout,
    register,
    resetPassword,
    updateCurrentUserOrThrow
} from "../store/account";
import { RootState, useAppDispatch } from "../store/createStore";

interface IAuthStore extends IAccountState {
    login(email: string, password: string): void
    logout(): void
    register: (fullName: string, email: string, password: string, confirmPassword: string) => void
    confirmEmail: (userId: any, code: any) => void
    forgotPassword: (email: string) => void
    resetPassword: (code: string, email: string, password: string, confirmPassword: string) => void
    update: () => void
}

function useAccountStore(): IAuthStore {
    const account = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch();

    return {
        ...account,
        login: (email: string, password: string) => { dispatch(login(email, password)); },
        logout: () => { dispatch(logout); },
        register: (fullName, email, password, confirmPassword) => { dispatch(register(fullName, email, password, confirmPassword)); },
        confirmEmail: (userId, code) => { dispatch(confirmEmail(userId, code)); },
        forgotPassword: (email) => { dispatch(forgotPassword(email)); },
        resetPassword: (code, email, password, confirmPassword) => { dispatch(resetPassword(code, email, password, confirmPassword)); },
        update: () => { dispatch(updateCurrentUserOrThrow()) }
    }

}

export default useAccountStore;