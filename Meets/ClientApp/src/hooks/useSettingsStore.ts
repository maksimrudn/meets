import { useDispatch, useSelector } from "react-redux";
import ProfileSettingsDTO from "../contracts/user/ProfileSettingsDTO";
import { RootState } from "../store/createStore";
import {
    changePassword,
    confirmEmail,
    editSettings,
    ISettingsState,
    removeAccount,
    setProfile,
    updateSettings
} from "../store/settings";

interface ISettingsStore extends ISettingsState {
    update: () => Promise<void>
    edit: () => Promise<void>
    setProfile: (profile: ProfileSettingsDTO) => Promise<void>
    removeAccount: () => Promise<void>
    confirmEmail: (email: string) => Promise<void>
    changePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<void>
}

function useSettingsStore(): ISettingsStore {
    const settings = useSelector((state: RootState) => state.settings);
    const dispatch = useDispatch();

    return {
        ...settings,
        update: async () => { await dispatch(updateSettings()); },
        edit: async () => { await dispatch(editSettings()); },
        setProfile: async (profile) => { await dispatch(setProfile(profile)); },
        removeAccount: async () => { await dispatch(removeAccount()); },
        confirmEmail: async (email) => { await dispatch(confirmEmail(email)); },
        changePassword: async (oldPassword, newPassword, confirmPassword) => { await dispatch(changePassword(oldPassword, newPassword, confirmPassword)); }
    };
}

export default useSettingsStore;