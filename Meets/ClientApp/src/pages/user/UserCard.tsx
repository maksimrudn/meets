import React, { Component, useEffect, useRef, useState } from 'react';
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
import { connect } from 'react-redux';
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
import ShowUserAvatar from '../../modules/entities/user/ShowUserAvatar';
import ConfirmationModal from '../../modules/entities/user/ConfirmationModal';
import UserCardContextMenuModal from '../../modules/entities/user/UserCardContextMenuModal';
import CompanyIconSvg from '../../icons/CompanyIconSvg';
import UserCardResponse from '../../contracts/user/UserCardResponse';
import JobIconSvg from '../../icons/JobIconSvg';
import ApiError from '../../common/ApiError';
import Routes from '../../common/Routes';
import subscribtionService from '../../api/SubscribtionService';


interface UserCardProps {
    userInfo: any,
    UpdateUserInfo: any
}

interface UserCardParams {
    id?: string
}

function UserCard(props: UserCardProps): JSX.Element {

    let params = useParams<UserCardParams>();

    const history = useHistory();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [user, setUser] = useState<UserCardResponse>(new UserCardResponse());

    const [userEditModalIsOpen, setUserEditModalIsOpen] = useState(false);
    const [fieldName, setFieldName] = useState<any>('');

    const [selectedTab, setSelectedTab] = useState<any>(UserCardTabsNames.Info);
    const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);

    const [avatarModalIsOpen, setAvatarModalIsOpen] = useState(false);
    const [removeAvatarModalIsOpen, setRemoveAvatarModalIsOpen] = useState(false);
    const [isShowAvatar, setIsShowAvatar] = useState(false);

    // элемент к которому скроллит после изменеия id пользователя
    let topElement: any = useRef();

    useEffect(() => {
        
        update();
    }, [params.id]);

    const update = () => {
        try {
            setIsLoading(true);

            const userCard = userService.getCard(params.id);
            setUser(userCard);

            setIsLoading(false);
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }


    const settingsModalToggle = () => {
        setSettingsModalIsOpen(!settingsModalIsOpen);
    }

    const userEditorModalToggle = () => {
        setUserEditModalIsOpen(!userEditModalIsOpen);
    }

    const avatarModalToggler = () => {
        setAvatarModalIsOpen(!avatarModalIsOpen);
    }

    const removeAvatarModalToggler = () => {
        setRemoveAvatarModalIsOpen(!removeAvatarModalIsOpen);
    }

    const showAvatarToggle = () => {
        setIsShowAvatar(!isShowAvatar);
    }

    const onClickEditIcon = (fieldName: any) => {
        setFieldName(fieldName); //e.target.dataset.fieldName
        userEditorModalToggle();
    }

    const removeAvatar = () => {
        try {
            userService.removeAvatar();
            update();

            removeAvatarModalToggler();

            props.UpdateUserInfo(userService.getAuthInfo());
        }
        catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const onSubscribe = () => {
        try {
            subscribtionService.subscribe(user.id);
            update();
        }
        catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }

    const onUnSubscribe = () => {
        try {
            subscribtionService.unSubscribe(user.id);
            update();
        }
        catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }


    const onSaveChanges = (fieldName: string, value: any) => {
        let newData = {
            ...user,
            [fieldName]: value
        };

        let userData = objectToFormData(newData);

        if (user.latitude && user.longitude) {
            userData.set('latitude', `${user.latitude.toLocaleString('ru-Ru')}`);
            userData.set('longitude', `${user.longitude.toLocaleString('ru-Ru')}`);
        }

        userData.delete('tags');

        if (fieldName === UserFieldNames.Tags) {
            value.map((tag: any) => userData.append('Tags', tag));
        } else {
            user.tags?.map((tag: any) => userData.append('Tags', tag));
        }

        try {
            userService.edit(userData);
            update();

            props.UpdateUserInfo(userService.getAuthInfo());
        }
        catch (err: any) {
            NotificationManager.error(err.message, 0);
        }
    }

    const getSEO = () => {
        var title = '';
        var keywords = '';
        var description = '';

        var userTitle = user.fullName ?? "Название не указано";
        title = "Пользователь: " + userTitle + " - посмотреть все события на EventSurfing";
        keywords = "пользователь " + userTitle + ", " + "расписание " + userTitle;
        description = "Описание пользователя " + userTitle;

        return { title, keywords, description };
    }

    var seo = getSEO();

    return (
        
        <>            
            {isLoading ?
                <div>ожидание</div>
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
                            <span className="Button me-3" onClick={settingsModalToggle}><SettingsIcon /></span>
                        </div>
                        {user.avatar
                            ? (
                                <div className="MainAvatarContainer col-12">
                                    <div className="AvatarContainerBlur">
                                        <img className="AvatarBlur" src={getAvatarPathForUser(user)} alt="" />
                                    </div>
                                    <div className="AvatarContainer">
                                        <img className="Avatar" src={getAvatarPathForUser(user)} alt="" />
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
                                    <h2>{user.fullName || 'не указано'}</h2>
                                </span>

                                <span className="col-2 d-flex justify-content-end">
                                    {(props.userInfo.user.id === user.id) &&
                                        <span className="text-white" role="button" onClick={() => onClickEditIcon(UserFieldNames.FullName)}>
                                            <EditIconSvg />
                                        </span>
                                    }
                                </span>
                            </div>

                            {user.company &&
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                    <span className="text-white me-3">
                                        <CompanyIconSvg />
                                    </span>
                                    <span>{user.company}</span>
                                </div>
                            }

                            {user.job &&
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                    <span className="text-white me-3">
                                        <JobIconSvg />
                                    </span>
                                    <span>{user.job}</span>
                                </div>
                            }

                            {(() => {
                                if (props.userInfo.user.id !== user.id) {
                                    if (user.distance) {
                                        return (
                                            <div className="d-flex justify-content-center mb-2">
                                                <span>

                                                    <span className="text-white me-1">
                                                        <LocationIconSvg />
                                                    </span>
                                                    <span>{user.distance} км от вас</span>


                                                </span>
                                            </div>);
                                    }
                                }
                            })()}

                            {(props.userInfo.user.id !== user.id) &&
                                <div className="d-flex justify-content-around">
                                    <div className="col-9 me-3">
                                        <Link className="SendMEessageBtn btn btn-white p-2" to={`/messanger/${user.id}`}>
                                            <span className="me-4"><MessageIcon /></span>
                                            <span className="fs-5 text-black">Написать</span>
                                        </Link>
                                    </div>

                                    <div className="col-3 d-flex justify-content-center">
                                        <SubscribeButton
                                            subscribed={user.isSubscribed}
                                            onSubscribe={onSubscribe}
                                            onUnsubscribe={onUnSubscribe}
                                        />
                                    </div>

                                </div>
                            }

                        </div>

                        <div className="BaseInfo">

                            <div className="ActivityInfo d-flex justify-content-evenly">
                                <div className="d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{user.subscribers}</span>
                                    <small>подписчиков</small>
                                </div>

                                <div className="d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{user.subscriptions}</span>
                                    <small>подписок</small>
                                </div>

                                <div className=" d-flex flex-column justify-content-center">
                                    <span className="fs-4 text-center">{user.meetings}</span>
                                    <small>встречь</small>
                                </div>
                            </div>

                            <div className="Tags">
                                <div className="d-flex justify-content-start align-items-center ms-2 my-3">
                                    <span className="fs-4 me-3">Тэги</span>
                                    {(props.userInfo.user.id === user.id) &&
                                        <span className="IconEdit" role="button" onClick={() => onClickEditIcon(UserFieldNames.Tags)}><EditIcon /></span>
                                    }
                                </div>
                                <div className="ms-2">
                                    {!user.Tags?.length ? 'не указано' : user.tags.map((tag: any) =>
                                        <span key={tag} className="Tag badge bg-secondary rounded-pill text-black py-2 px-3 me-2">{tag}</span>
                                    )}
                                </div>
                            </div>

                        </div>

                        <UserCardTabs
                            userInfo={props.userInfo}
                            user={user}
                            tabs={UserCardTabsNames}
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            onClickEditIcon={onClickEditIcon}
                            updateUser={update}
                            learnings={user?.learnings}
                            works={user?.works}
                            activities={user?.activities}
                            facts={user?.facts}
                        />

                        <UserEditorModal
                            user={user}
                            isOpen={userEditModalIsOpen}
                            toggle={userEditorModalToggle}
                            fieldName={fieldName}
                            onSaveChanges={onSaveChanges}
                        />

                        <UserCardContextMenuModal
                            isOpen={settingsModalIsOpen}
                            toggle={settingsModalToggle}
                            avatarModalToggle={avatarModalToggler}
                            removeAvatarModalToggle={removeAvatarModalToggler}
                            showAvatarToggle={showAvatarToggle}
                            user={user}
                            userInfo={props.userInfo}
                            onSaveChanges={onSaveChanges}
                        />

                        <UserCardAvatarModal
                            isOpen={avatarModalIsOpen}
                            toggle={avatarModalToggler}
                            user={user}
                            onSaveChanges={onSaveChanges}
                        />

                        <ConfirmationModal
                            isOpen={removeAvatarModalIsOpen}
                            toggle={removeAvatarModalToggler}
                            message="Удалить ваше фото?"
                            confirmAction={removeAvatar}
                            contextMenuModalToggle={settingsModalToggle}
                        />


                        <ShowUserAvatar
                            isOpen={isShowAvatar}
                            toggle={showAvatarToggle}
                            user={user}
                        />

                        {/* UserDetails container: End */}
                    </div>
                </>
            }
        </>
    );

}

export default connect(mapStateToProps("UserCard"), mapDispatchToProps("UserCard"))(UserCard);
