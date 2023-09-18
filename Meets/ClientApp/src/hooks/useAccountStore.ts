import { useDispatch, useSelector } from "react-redux";
import {
    confirmEmail,
    forgotPassword,
    IAccountState,
    login,
    logout,
    refreshToken,
    register,
    resetPassword,
    updateCurrentUser
} from "../store/account";
import { RootState, useAppDispatch } from "../store/createStore";

interface IAuthStore extends IAccountState {
    //refreshToken: () => Promise<void>
    login(email: string, password: string): Promise<void>
    logout(): Promise<void>
    register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>
    confirmEmail: (userId: any, code: any) => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (code: string, email: string, password: string, confirmPassword: string) => Promise<void>
    update: () => Promise<void>
}

function useAccountStore(): IAuthStore {
    const account = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch();

    return {
        ...account,
        //refreshToken: async () => { await dispatch(refreshToken()); },
        login: async (email: string, password: string) => { await dispatch(login(email, password)); },
        logout: async () => { await dispatch(logout()); },
        register: async (fullName, email, password, confirmPassword) => { await dispatch(register(fullName, email, password, confirmPassword)); },
        confirmEmail: async (userId, code) => { await dispatch(confirmEmail(userId, code)); },
        forgotPassword: async (email) => { await dispatch(forgotPassword(email)); },
        resetPassword: async (code, email, password, confirmPassword) => { await dispatch(resetPassword(code, email, password, confirmPassword)); },
        update: async () => { await dispatch(updateCurrentUser()) }
    }

}

export default useAccountStore;