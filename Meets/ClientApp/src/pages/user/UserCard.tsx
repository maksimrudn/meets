import React, { Component, SetStateAction, useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';

import { Helmet } from 'react-helmet';
import { getAllowedPhotoFilesByMask, getAvatarPathForUser, loadPhotoContentFromFiles, objectToFormData } from '../../common/Utils';

import SubscribeButton from '../../modules/entities/user/SubscribeButton';
import './UserCard.scss';

import 'react-date-time-new/css/react-datetime.css'
import UserEditorModal from '../../modules/entities/user/UserEditorModal';
import { UserFieldNames } from '../../common/UserFieldNames';
import GoBackIcon from '../../icons/GoBackIcon';
import SettingsIcon from '../../icons/SettingsIcon';
import EditIconSvg from '../../icons/EditIconSvg';
import LocationIconSvg from '../../icons/LocationIconSvg';
import EditIcon from '../../icons/EditIcon';
import UserCardTabs from '../../modules/entities/user/UserCardTabs';
import { UserCardTabsNames } from '../../common/UserCardTabsNames';

import UserCardContextMenuModal from '../../modules/entities/user/UserCardContextMenuModal';
import CompanyIconSvg from '../../icons/CompanyIconSvg';
import JobIconSvg from '../../icons/JobIconSvg';
import Routes from '../../common/Routes';
import subscribtionService from '../../api/SubscribtionService';
import ProfileSettingsIcon from '../../icons/ProfileSettingsIcon';

import 'moment-timezone';
import 'moment/locale/ru';

import MeetRequestModal from '../../modules/entities/user/MeetRequestModal';

import CoffeeIcon from '../../icons/CoffeeIcon';
import WaitingScreen from '../common/WaitingScreen';
import useAccountStore from '../../hooks/useAccountStore';
import useUserStore from '../../hooks/useUserStore';
import { toast } from 'react-toastify';


interface UserCardParams {
    id?: string
}

function UserCard(): JSX.Element {

    let params = useParams<UserCardParams>();

    const history = useHistory();

    const userStore = useUserStore();


    const [isOpenUserEditModal, setIsOpenUserEditModal] = useState(false);
    const [fieldName, setFieldName] = useState<any>('');

    const [selectedTab, setSelectedTab] = useState<any>(UserCardTabsNames.Info);
    const [isOpenUserCardContextMenuModal, setIsOpenOpenUserCardContextMenuModal] = useState(false);

    const [isOpenMeetModal, setIsOpenMeetModal] = useState(false);

    // элемент к которому скроллит после изменеия id пользователя
    let topElement: any = useRef();

    useEffect(() => {
        const update = async () => {
            try {
                await userStore.updateUser(params.id);
            } catch (err) {
                history.push(Routes.Error, err);
            }
        }

        update();
    }, [params.id]);

    const toggleUserCardContextMenuModal = () => {
        setIsOpenOpenUserCardContextMenuModal(!isOpenUserCardContextMenuModal);
    }

    const toggleUserEditorModal = () => {
        setIsOpenUserEditModal(!isOpenUserEditModal);
    }
        

    const toggleMeetRequestModal = () => {
        setIsOpenMeetModal(!isOpenMeetModal);
    }

    

    const onClickEditIcon = (fieldName: any) => {
        setFieldName(fieldName);
        toggleUserEditorModal();
    }

    

    const handleSubscribe = async () => {
        try {
            await userStore.subscribe();
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const handleUnSubscribe = async () => {
        try {
            await userStore.unSubscribe();
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const getSEO = () => {
        var title = '';
        var keywords = '';
        var description = '';

        var userTitle = userStore.user?.fullName ?? "Название не указано";
        title = "Пользователь: " + userTitle + " - посмотреть все события на EventSurfing";
        keywords = "пользователь " + userTitle + ", " + "расписание " + userTitle;
        description = "Описание пользователя " + userTitle;

        return { title, keywords, description };
    }

    var seo = getSEO();

    return (

        <>
            {userStore.isLoading ?
                <WaitingScreen />
                :
                <>
                    <div ref={topElement} style={{ position: 'absolute', top: -100, left: 0 }}></div>
                    <Helmet>
                        <title>{seo.title}</title>
                        <meta className="meta-tag" data-type="name" name="keywords" content={seo.keywords} />
                        <meta name="description" content={seo.description} />
                        <meta property="og:title" content={seo.title} />
                        <meta property="og:description" content={seo.description} />
                    </Helmet>

                    <div className="UserCard col-12">
                        {/* UserDetails container: Start */}

                        <div className="Actions mt-3">
                            <span className="Button ms-3" onClick={() => { history.goBack(); }}><GoBackIcon /></span>
                            <span className="Button me-3" onClick={toggleUserCardContextMenuModal}><SettingsIcon /></span>
                        </div>
                        {userStore.user?.avatar
                            ? (
                                <div className="MainAvatarContainer col-12">
                                    <div className="AvatarContainerBlur">
                                        <img className="AvatarBlur" src={getAvatarPathForUser(userStore.user)} alt="" />
                                    </div>
                                    <div className="AvatarContainer">
                                        <img className="Avatar" src={getAvatarPathForUser(userStore.user)} alt="" />
                                    </div>
                                </div>
                            )
                            : (
                                <div className="AvatarEmpty col-12"></div>
                            )
                        }

                        <div className="UserInfo col-12">

                            <div className="d-flex justify-content-end">
                                <span className="col-8 d-flex justify-content-center">
                                    <h2>{userStore.user?.fullName || 'не указано'}</h2>
                                </span>

                                <span className="col-2 d-flex justify-content-end">
                                    {userStore.isOwner &&
                                        <span className="text-white" role="button" onClick={() => onClickEditIcon(UserFieldNames.FullName)}>
                                            <EditIconSvg />
                                        </span>
                                    }
                                </span>
                            </div>

                            {userStore.user?.specialization && // сфера деятельности
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                    <span>{userStore.user?.specialization}</span>
                                </div>
                            }

                            {userStore.user?.company &&
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                    <span className="text-white me-3">
                                        <CompanyIconSvg />
                                    </span>
                                    <span>{userStore.user?.company}</span>
                                </div>
                            }

                            {userStore.user?.job &&
                                <div className="col-12 d-flex align-items-center justify-content-center mb-2">
                                    <span className="text-white me-3">
                                        <JobIconSvg />
                                    </span>
                                    <span>{userStore.user?.job}</span>
                                </div>
                            }

                            {(() => {
                                if (!userStore.isOwner) {
                                    if (userStore.user?.distance) {
                                        return (
                                            <div className="d-flex justify-content-center mb-2">
                                                <span>

                                                    <span className="text-white me-1">
                                                        <LocationIconSvg />
                                                    </span>
                                                    <span>{userStore.user.distance} км от вас</span>


                                                </span>
                                            </div>);
                                    }
                                }
                            })()}

                            {(!userStore.isOwner)
                                ? (<div className="d-flex justify-content-around">
                                    <div className="col-9 me-3">
                                        <button className="Invite btn" type="button" onClick={toggleMeetRequestModal} disabled={userStore.user?.isInvited}>
                                            <span className="me-4"><CoffeeIcon /></span>
                                            <span className="fs-5 text-black">Пригласить</span>
                                        </button>
                                    </div>

                                    <div className="col-3 d-flex justify-content-center">
                                        <SubscribeButton
                                            subscribed={userStore.user?.isSubscribed as boolean}
                                            onSubscribe={handleSubscribe}
                                            onUnsubscribe={handleUnSubscribe}
                                        />
                                    </div>

                                </div>)
                                : (
                                    <div className="col-12">
                                        <Link className="SettingsBtn btn btn-white p-2" to={Routes.ProfileSettings}>
                                            <span className="me-4"><ProfileSettingsIcon /></span>
                                            <span className="fs-5 text-black">Настройки</span>
                                        </Link>
                                    </div>
                                )
                            }

                        </div>

                        <div className="BaseInfo">

                            <div className="ActivityInfo d-flex justify-content-evenly">
                                <div className="d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{userStore.user?.subscribers}</span>
                                    <small>подписчиков</small>
                                </div>

                                <div className="d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{userStore.user?.subscriptions}</span>
                                    <small>подписок</small>
                                </div>

                                <div className=" d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{userStore.user?.meetings}</span>
                                    <small>встречь</small>
                                </div>
                            </div>

                            <div className="Tags">
                                <div className="d-flex justify-content-start align-items-center ms-2 my-3">
                                    <span className="fs-4 me-3">Тэги</span>
                                    {userStore.isOwner &&
                                        <span className="IconEdit" role="button" onClick={() => onClickEditIcon(UserFieldNames.Tags)}><EditIcon /></span>
                                    }
                                </div>
                                <div className="ms-2">
                                    {!userStore.user?.tags?.length ? 'не указано' : userStore.user.tags.map((tag: any) =>
                                        <span key={tag} className="Tag badge bg-secondary rounded-pill text-black py-2 px-3 me-2">{tag}</span>
                                    )}
                                </div>
                            </div>

                        </div>

                        {(userStore.dataLoaded && !userStore.error) &&
                            <UserCardTabs
                                tabs={UserCardTabsNames}
                                selectedTab={selectedTab}
                                setSelectedTab={setSelectedTab}
                                onClickEditIcon={onClickEditIcon}
                            />
                        }
                        

                        {(userStore.dataLoaded && isOpenUserEditModal) &&
                            <UserEditorModal
                                isOpen={isOpenUserEditModal}
                                toggle={toggleUserEditorModal}
                                fieldName={fieldName}
                            />
                        }

                        {(userStore.dataLoaded && isOpenUserCardContextMenuModal) &&
                            <UserCardContextMenuModal
                                isOpen={isOpenUserCardContextMenuModal}
                                toggle={toggleUserCardContextMenuModal}
                            />
                        }

                        {(userStore.dataLoaded && isOpenMeetModal) &&
                            <MeetRequestModal
                                isOpen={isOpenMeetModal}
                                toggle={toggleMeetRequestModal}
                            />
                        }
                        
                    </div>
                </>
            }
        </>
    );

}

export default UserCard;