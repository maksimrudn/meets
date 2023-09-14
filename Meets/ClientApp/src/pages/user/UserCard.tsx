import React, { Component, SetStateAction, useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { scrollIntoView } from 'scroll-polyfill';

import ReactDOM from 'react-dom';

import userService from '../../api/UserService';
import { Helmet } from 'react-helmet';
import AppConfig from '../../common/AppConfig';
import { getAllowedPhotoFilesByMask, getAvatarPathForUser, loadPhotoContentFromFiles, objectToFormData } from '../../common/Utils';
import YMapsGeoViewer from '../../modules/geo/YMapsGeoViewer';
import $ from 'jquery';

import SubscribeButton from '../../modules/entities/user/SubscribeButton';
import './UserCard.scss';
import Date from '../../modules/entities/user/edit/Date';
import { AddressSuggestions } from 'react-dadata';


import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'
import { connect, useSelector } from 'react-redux';
import mapStateToProps from '../../store/mapStateToProps';
import mapDispatchToProps from '../../store/mapDispatchToProps';
import UserEditorModal from '../../modules/entities/user/UserEditorModal';
import { UserFieldNames } from '../../common/UserFieldNames';
import GoBackIcon from '../../icons/GoBackIcon';
import SettingsIcon from '../../icons/SettingsIcon';
import EditIconSvg from '../../icons/EditIconSvg';
import LocationIconSvg from '../../icons/LocationIconSvg';
import MessageIcon from '../../icons/MessageIcon';
import UserPlusIcon from '../../icons/UserPlusIcon';
import EditIcon from '../../icons/EditIcon';
import BirthDateIconSvg from '../../icons/BirthDateIconSvg';
import GrowthIconSvg from '../../icons/GrowthIconSvg';
import WeightIconSvg from '../../icons/WeightIconSvg';
import SwiperTabs from '../../modules/tabs/SwiperTabs';
import UserCardTabs from '../../modules/entities/user/UserCardTabs';
import { UserCardTabsNames } from '../../common/UserCardTabsNames';
import UserCardAvatarModal from '../../modules/entities/user/UserCardAvatarModal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import UserCardContextMenuModal from '../../modules/entities/user/UserCardContextMenuModal';
import CompanyIconSvg from '../../icons/CompanyIconSvg';
import UserCardResponse from '../../contracts/user/UserCardResponse';
import JobIconSvg from '../../icons/JobIconSvg';
import ApiError from '../../common/ApiError';
import Routes from '../../common/Routes';
import subscribtionService from '../../api/SubscribtionService';
import ProfileSettingsIcon from '../../icons/ProfileSettingsIcon';

import 'moment-timezone';
import 'moment/locale/ru';

import MeetRequestModal from '../../modules/entities/user/MeetRequestModal';

import CoffeeIcon from '../../icons/CoffeeIcon';
import UserAuthInfo from '../../contracts/UserAuthInfo';
import WaitingScreen from '../common/WaitingScreen';
import { RootState, useAppDispatch } from '../../store/createStore';
import { updateCurrentUser } from '../../store/currentUser';



interface UserCardParams {
    id?: string
}

function UserCard(): JSX.Element {

    let params = useParams<UserCardParams>();

    const history = useHistory();

    const currentUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();


    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [userCard, setUserCard] = useState<UserCardResponse>(new UserCardResponse());

    const [isOpenUserEditModal, setIsOpenUserEditModal] = useState(false);
    const [fieldName, setFieldName] = useState<any>('');

    const [selectedTab, setSelectedTab] = useState<any>(UserCardTabsNames.Info);
    const [isOpenUserCardContextMenuModal, setIsOpenOpenUserCardContextMenuModal] = useState(false);

    

    const [isOpenMeetModal, setIsOpenMeetModal] = useState(false);

    // элемент к которому скроллит после изменеия id пользователя
    let topElement: any = useRef();

    useEffect(() => {

        update();
    }, [params.id]);

    const update = () => {
        try {
            setIsLoading(true);

            const userCard = userService.getCard(params.id);
            setUserCard(userCard);

            setIsLoading(false);
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }


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
        setFieldName(fieldName); //e.target.dataset.fieldName
        toggleUserEditorModal();
    }

    

    const onSubscribe = () => {
        try {
            subscribtionService.subscribe(userCard.id);
            update();
        }
        catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const onUnSubscribe = () => {
        try {
            subscribtionService.unSubscribe(userCard.id);
            update();
        }
        catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const onSaveChanges = (fieldName: string, value: any) => {
        let newData = {
            ...userCard,
            [fieldName]: value
        };

        let userData = objectToFormData(newData);

        if (userCard.latitude && userCard.longitude) {
            userData.set('latitude', `${userCard.latitude.toLocaleString('ru-Ru')}`);
            userData.set('longitude', `${userCard.longitude.toLocaleString('ru-Ru')}`);
        }

        userData.delete('tags');

        if (fieldName === UserFieldNames.Tags) {
            value.map((tag: any) => userData.append('Tags', tag));
        } else {
            userCard.tags?.map((tag: any) => userData.append('Tags', tag));
        }

        try {
            userService.edit(userData);
            update();

            dispatch(updateCurrentUser);
        }
        catch (err: any) {
            NotificationManager.error(err.message, 0);
        }
    }

    const getSEO = () => {
        var title = '';
        var keywords = '';
        var description = '';

        var userTitle = userCard.fullName ?? "Название не указано";
        title = "Пользователь: " + userTitle + " - посмотреть все события на EventSurfing";
        keywords = "пользователь " + userTitle + ", " + "расписание " + userTitle;
        description = "Описание пользователя " + userTitle;

        return { title, keywords, description };
    }

    var seo = getSEO();

    return (

        <>
            {isLoading ?
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
                    <NotificationContainer />

                    <div className="UserCard col-12">
                        {/* UserDetails container: Start */}

                        <div className="Actions mt-3">
                            <span className="Button ms-3" onClick={() => { history.goBack(); }}><GoBackIcon /></span>
                            <span className="Button me-3" onClick={toggleUserCardContextMenuModal}><SettingsIcon /></span>
                        </div>
                        {userCard.avatar
                            ? (
                                <div className="MainAvatarContainer col-12">
                                    <div className="AvatarContainerBlur">
                                        <img className="AvatarBlur" src={getAvatarPathForUser(userCard)} alt="" />
                                    </div>
                                    <div className="AvatarContainer">
                                        <img className="Avatar" src={getAvatarPathForUser(userCard)} alt="" />
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
                                    <h2>{userCard.fullName || 'not specified'}</h2>
                                </span>

                                <span className="col-2 d-flex justify-content-end">
                                    {(currentUser.userId === userCard.id) &&
                                        <span className="text-white" role="button" onClick={() => onClickEditIcon(UserFieldNames.FullName)}>
                                            <EditIconSvg />
                                        </span>
                                    }
                                </span>
                            </div>

                            {userCard.specialization && // сфера деятельности
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                    <span>{userCard.specialization}</span>
                                </div>
                            }

                            {userCard.company &&
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                    <span className="text-white me-3">
                                        <CompanyIconSvg />
                                    </span>
                                    <span>{userCard.company}</span>
                                </div>
                            }

                            {userCard.job &&
                                <div className="col-12 d-flex align-items-center justify-content-center mb-2">
                                    <span className="text-white me-3">
                                        <JobIconSvg />
                                    </span>
                                    <span>{userCard.job}</span>
                                </div>
                            }

                            {(() => {
                                if (currentUser.userId !== userCard.id) {
                                    if (userCard.distance) {
                                        return (
                                            <div className="d-flex justify-content-center mb-2">
                                                <span>

                                                    <span className="text-white me-1">
                                                        <LocationIconSvg />
                                                    </span>
                                                    <span>{userCard.distance} km far</span>


                                                </span>
                                            </div>);
                                    }
                                }
                            })()}

                            {(currentUser.user?.user?.id !== userCard.id)
                                ? (<div className="d-flex justify-content-around">
                                    <div className="col-9 me-3">
                                        <button className="Invite btn" type="button" onClick={toggleMeetRequestModal} disabled={userCard.isInvited}>
                                            <span className="me-4"><CoffeeIcon /></span>
                                            <span className="fs-5 text-black">Invite</span>
                                        </button>
                                    </div>

                                    <div className="col-3 d-flex justify-content-center">
                                        <SubscribeButton
                                            subscribed={userCard.isSubscribed}
                                            onSubscribe={onSubscribe}
                                            onUnsubscribe={onUnSubscribe}
                                        />
                                    </div>

                                </div>)
                                : (
                                    <div className="col-12">
                                        <Link className="SettingsBtn btn btn-white p-2" to={Routes.ProfileSettingsBuild(userCard.id)}>
                                            <span className="me-4"><ProfileSettingsIcon /></span>
                                            <span className="fs-5 text-black">Settings</span>
                                        </Link>
                                    </div>
                                )
                            }

                        </div>

                        <div className="BaseInfo">

                            <div className="ActivityInfo d-flex justify-content-evenly">
                                <div className="d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{userCard.subscribers}</span>
                                    <small>Subscribers</small>
                                </div>

                                <div className="d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{userCard.subscriptions}</span>
                                    <small>Subscribes</small>
                                </div>

                                <div className=" d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{userCard.meetings}</span>
                                    <small>Meetings</small>
                                </div>
                            </div>

                            <div className="Tags">
                                <div className="d-flex justify-content-start align-items-center ms-2 my-3">
                                    <span className="fs-4 me-3">Tags</span>
                                    {(currentUser.user?.user?.id === userCard.id) &&
                                        <span className="IconEdit" role="button" onClick={() => onClickEditIcon(UserFieldNames.Tags)}><EditIcon /></span>
                                    }
                                </div>
                                <div className="ms-2">
                                    {!userCard.tags?.length ? 'not specified' : userCard.tags.map((tag: any) =>
                                        <span key={tag} className="Tag badge bg-secondary rounded-pill text-black py-2 px-3 me-2">{tag}</span>
                                    )}
                                </div>
                            </div>

                        </div>

                        <UserCardTabs
                            user={userCard}
                            tabs={UserCardTabsNames}
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            onClickEditIcon={onClickEditIcon}
                            updateUser={update}
                            learnings={userCard?.learnings}
                            works={userCard?.works}
                            activities={userCard?.activities}
                            facts={userCard?.facts}
                        />

                        {isOpenUserEditModal &&
                            <UserEditorModal
                                user={userCard}
                                isOpen={isOpenUserEditModal}
                                toggle={toggleUserEditorModal}
                                fieldName={fieldName}
                                onSaveChanges={onSaveChanges}
                            />
                        }

                        {isOpenUserCardContextMenuModal &&
                            <UserCardContextMenuModal
                                isOpen={isOpenUserCardContextMenuModal}
                                toggle={toggleUserCardContextMenuModal}
                                
                                user={userCard}
                                update={update}

                                onSaveChanges={onSaveChanges}
                            />
                        }

                        

                        

                        {isOpenMeetModal &&
                            <MeetRequestModal
                                isOpen={isOpenMeetModal}
                                toggle={toggleMeetRequestModal}
                                user={userCard}
                                updateUser={update}
                            //updateNotifications={props.updateNotifications}
                            />
                        }
                        

                        

                    </div>
                </>
            }
        </>
    );

}

export default UserCard;