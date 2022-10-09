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
import useAccountStore from '../../hooks/useAccountStore';
import useSettingsStore from '../../hooks/useSettingsStore';



function ProfileSettings() {
    let history = useHistory();

    const account = useAccountStore();
    const settings = useSettingsStore();

    const [isOpenRemoveAccountModal, setIsOpenRemoveAccountModal] = useState(false);

    useEffect(() => {
        const update = async () => {
            try {
                await settings.update();
            } catch (err) { }
        }

        update();
    }, []);

    const handleEdit = async () => {
        try {
            await settings.edit();
            history.goBack();
        } catch (err) { }
    }

    const handleRemoveAccount = async () => {
        try {
            try {
                await settings.removeAccount();
                history.push('/account/login');
            } catch (err) { }
        } catch (err) { }
    }

    const handleLogOut = async () => {
        try {
            await account.logout();
            history.push('/account/login');
        } catch (err) {

        }
    }

    const toggleRemoveAccountModal = () => {
        setIsOpenRemoveAccountModal(!isOpenRemoveAccountModal);
    }

    return (
        <div className="ProfileSettings">

            <div className="Header mt-3">
                <span className="GoBackBtn" onClick={() => { history.goBack(); }}><ArrowIcon /></span>
                <span className="Title">Настройки</span>
                <span className="SaveChangesBtn" onClick={handleEdit}><CheckMarkIconSvg /></span>
            </div>

            <div className="card">
                <div className="ConfirmEmail">
                    <Link className="Link" to={Routes.UserConfirmEmail}>
                        <div className="Row">
                            <div className="Wrap">
                                <span className="Text">{settings.profile.email}</span>
                            </div>
                            <div className="Icon"><ArrowIcon /></div>
                        </div>


                        {!settings.profile.emailConfirmed &&
                            <div className="Message">Подтвердите адрес эл.почты чтобы защитить аккаунт</div>
                        }
                    </Link>
                </div>

                <div className="ChangePassword">
                    <Link className="Link" to={Routes.UserChangePassword}>
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
                        defaultValue={settings.profile.telegram?.replace('@', '')}
                        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            try {
                                await settings.setProfile({ ...settings.profile, telegram: e.target.value });
                            } catch (err) { }
                        }}
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
                            defaultChecked={settings.profile.isInvitable}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                try {
                                    await settings.setProfile({ ...settings.profile, isInvitable: e.target.checked })
                                }
                                catch (err) { }
                            }}
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
                            defaultChecked={settings.profile.isSearchable}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                try {
                                    await settings.setProfile({ ...settings.profile, isSearchable: e.target.checked });
                                }
                                catch (err) { }
                            }}
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
                            defaultChecked={settings.profile.isGeoTracking}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                try {
                                    await settings.setProfile({ ...settings.profile, isGeoTracking: e.target.checked });
                                }
                                catch (err) { }
                            }
                            }
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
                    defaultValue={settings.profile.specialization}
                    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        try {
                            await settings.setProfile({ ...settings.profile, specialization: e.target.value });
                        }
                        catch (err) { }
                    }}
                />
            </div>

            <div className="Company mb-4">
                <label className="form-label ms-2">Компания</label>
                <input
                    className="form-control"
                    type="text"
                    defaultValue={settings.profile.company}
                    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        try {
                            await settings.setProfile({ ...settings.profile, company: e.target.value });
                        }
                        catch (err) { }
                    }
                    }
                />
            </div>

            <div className="Post mb-5">
                <label className="form-label ms-2">Должность</label>
                <input
                    className="form-control"
                    type="text"
                    defaultValue={settings.profile.job}
                    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        try {
                            await settings.setProfile({ ...settings.profile, job: e.target.value });
                        }
                        catch (err) { }
                    }}
                />
            </div>

            <button type="button" className="LogOut btn mb-5" onClick={handleLogOut}>Выйти</button>

            <button type="button" className="RemoveAccount btn mb-5" onClick={toggleRemoveAccountModal}>Удалить аккаунт</button>

            <ConfirmationModal
                isOpen={isOpenRemoveAccountModal}
                toggle={toggleRemoveAccountModal}
                message='Уверены что хотите удалить аккаунт?'
                confirmAction={handleRemoveAccount}
            />

        </div>
    );
}

export default ProfileSettings;