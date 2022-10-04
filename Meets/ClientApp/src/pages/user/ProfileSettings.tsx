import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import userService from '../../api/UserService';
import Routes from '../../common/Routes';
import CheckMarkIconSvg from '../../icons/CheckMarkIconSvg';
import ArrowIcon from '../../icons/GoBackIcon';
import * as Cookies from 'js-cookie';


import './ProfileSettings.scss';
import ProfileSettingsDTO from '../../contracts/user/ProfileSettingsDTO';
import EditProfileSettingsDTO from '../../contracts/user/EditProfileSettingsDTO';
import accountService from '../../api/AccountService';
import ConfirmationModal from '../../modules/ConfirmationModal';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/createStore';
import { updateCurrentUser } from '../../store/currentUser';



interface IProfileSettingsParams {
    id?: string
}

function ProfileSettings() {
    let history = useHistory();
    let params = useParams<IProfileSettingsParams>();

    const currentUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();

    const [profile, setProfile] = useState<ProfileSettingsDTO>(new ProfileSettingsDTO());

    const [isOpenRemoveAccountModal, setIsOpenRemoveAccountModal] = useState(false);

    useEffect(() => {
        update();
    }, [params.id]);

    const update = () => {
        try {
            const profile = userService.getProfileSettings(params.id);
            setProfile(profile);
        } catch (err: any) {
            history.push(Routes.Error, err);
        }
    }

    const onSaveChanges = () => {
        let data = new EditProfileSettingsDTO();
        data = { ...profile, userId: params.id };

        try {
            userService.editProfileSettings(data);
            history.goBack();
            //update();
        } catch (err: any) {
            history.push(Routes.Error, err);
        }
    }

    const removeAccount = () => {
        accountService.removeAccount();
        history.push('/account/login');
    }

    const LogOut = () => {
        Cookies.remove('access_token');

        dispatch(updateCurrentUser);

        history.push('/account/login');
    }

    const toggleRemoveAccountModal = () => {
        setIsOpenRemoveAccountModal(!isOpenRemoveAccountModal);
    }

    return (
        <div className="ProfileSettings">

            <div className="Header mt-3">
                <span className="GoBackBtn" onClick={() => { history.goBack(); }}><ArrowIcon /></span>
                <span className="Title">Настройки</span>
                <span className="SaveChangesBtn" onClick={onSaveChanges}><CheckMarkIconSvg /></span>
            </div>

            <div className="card">
                <div className="ConfirmEmail">
                    <Link className="Link" to={Routes.UserConfirmEmailBuild(params.id)}>
                        <div className="Row">
                            <div className="Wrap">
                                <span className="Text">{profile.email}</span>
                            </div>
                            <div className="Icon"><ArrowIcon /></div>
                        </div>


                        {!profile.emailConfirmed &&
                            <div className="Message">Подтвердите адрес эл.почты чтобы защитить аккаунт</div>
                        }
                    </Link>
                </div>

                <div className="ChangePassword">
                    <Link className="Link" to={Routes.UserChangePasswordBuild(params.id)}>
                        <div className="Row">
                            <div className="Wrap">
                                <div className="Text">Пароль</div>
                            </div>
                            <div className="Icon"><ArrowIcon /></div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="TG mb-3">
                <label className="form-label ms-2">Telegram</label>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="email">@</span>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={profile.telegram?.replace('@', '')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, telegram: e.target.value })}
                    />
                </div>
            </div>

            <div className="Invite mb-3">
                <div className="d-inline-flex align-items-center mb-3">
                    <div className="CustomCheckBox">
                        <input
                            type="checkbox"
                            className="checkbox"
                            id="invite"
                            defaultChecked={profile.isInvitable}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, isInvitable: e.target.checked })}
                        />
                        <label htmlFor="invite"></label>
                    </div>
                    <span className="Title">Открыт для приглашений</span>
                </div>
                <div className="Desc">
                    Снимите эту галочку, чтобы вам не могли присылать приглашения. Например пока вы слишком заняты.
                    На вас смогут подписаться и как только вы станете доступны - подписчики будут проинформированы.
                </div>
            </div>

            <div className="Search mb-3">
                <div className="d-inline-flex align-items-center mb-3">
                    <div className="CustomCheckBox">
                        <input
                            type="checkbox"
                            className="checkbox"
                            id="search"
                            defaultChecked={profile.isSearchable}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, isSearchable: e.target.checked })}
                        />
                        <label htmlFor="search"></label>
                    </div>
                    <span className="Title">Показывать меня в поиске</span>
                </div>
            </div>

            <div className="GeoTracking mb-3">
                <div className="d-inline-flex w-100 align-items-center justify-content-between">
                    <span className="Title">Гео-отслеживание</span>
                    <div className="Switch mb-4">
                        <input
                            type="checkbox"
                            id="switch"
                            defaultChecked={profile.isGeoTracking}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, isGeoTracking: e.target.checked })}
                        />
                        <label htmlFor="switch"></label>
                    </div>
                </div>
                <div className="Desc">
                    Ваше текущее местоположение будет отслеживаться для того, чтобы люди по близости могли вас найти
                </div>
            </div>

            <div className="Activity mb-4">
                <label className="form-label ms-2">Сфера деятельности</label>
                <input
                    className="form-control"
                    type="text"
                    defaultValue={profile.specialization}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, specialization: e.target.value })}
                />
            </div>

            <div className="Company mb-4">
                <label className="form-label ms-2">Компания</label>
                <input
                    className="form-control"
                    type="text"
                    defaultValue={profile.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, company: e.target.value })}
                />
            </div>

            <div className="Post mb-5">
                <label className="form-label ms-2">Должность</label>
                <input
                    className="form-control"
                    type="text"
                    defaultValue={profile.job}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, job: e.target.value })}
                />
            </div>

            <button type="button" className="LogOut btn mb-5" onClick={LogOut}>Выйти</button>

            <button type="button" className="RemoveAccount btn mb-5" onClick={toggleRemoveAccountModal}>Удалить аккаунт</button>

            <ConfirmationModal
                isOpen={isOpenRemoveAccountModal}
                toggle={toggleRemoveAccountModal}
                message='Уверены что хотите удалить аккаунт?'
                confirmAction={removeAccount}
            />

        </div>
    );
}

export default ProfileSettings;