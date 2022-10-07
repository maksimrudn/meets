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
    update: () => void
    edit: () => void
    setProfile: (profile: ProfileSettingsDTO) => void
    removeAccount: () => void
    confirmEmail: (email: string) => void
    changePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => void
}

function useSettingsStore(): ISettingsStore {
    const settings = useSelector((state: RootState) => state.settings);
    const dispatch = useDispatch();

    return {
        ...settings,
        update: () => { dispatch(updateSettings()); },
        edit: () => { dispatch(editSettings()); },
        setProfile: (profile) => { dispatch(setProfile(profile)); },
        removeAccount: () => { dispatch(removeAccount()); },
        confirmEmail: (email) => { dispatch(confirmEmail(email)); },
        changePassword: (oldPassword, newPassword, confirmPassword) => { dispatch(changePassword(oldPassword, newPassword, confirmPassword)); }
    };
}

export default useSettingsStore;