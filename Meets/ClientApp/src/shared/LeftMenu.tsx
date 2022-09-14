import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { connect } from 'react-redux';
import mapStateToProps from '../store/mapStateToProps';
import mapDispatchToProps from '../store/mapDispatchToProps';

import EventEditorModal from 'modules/entities/event/EventEditorModal';

import userService from 'api/UserService';

import AppConfig from '../common/AppConfig';
import $ from 'jquery';

import './LeftMenu.scss';
import getPosition from '../common/GeoUtils';
import Coordinates from '../contracts/Coordinates';
import { getAvatarPathForUser } from '../common/Utils';
import RepeatIcon from '../icons/RepeatIcon';
import MenuCloseIcon from '../icons/MenuCloseIcon';


interface LeftMenuProps {
    userInfo: any,
    UpdateUserInfo: any
    leftMenuIsOpen: any
    hideLeftMenu: any
}

function LeftMenu({ userInfo, UpdateUserInfo, leftMenuIsOpen, hideLeftMenu }: LeftMenuProps) {
    const [showModal, setShowModal] = useState(false);

    const showEventCreateModal = (renewEvents: any) => {
        hideMainMenu();

        setShowModal(!showModal);
    }

    const hideMainMenu = () => {
        $('.LeftMenu').toggleClass('open');
        $('.body').toggleClass('hide');
    }

    const onDetectLocality = async () => {
        //if (!userInfo.hasGeolocation && !userInfo.city) {
            let coordinates = new Coordinates();
            coordinates = await getPosition();

            saveUserGeo(
                coordinates.latitude.toLocaleString('ru-Ru'),
                coordinates.longitude.toLocaleString('ru-Ru')
            );

            try {
                let locality = userService.getLocalityFromDadata(
                    coordinates.latitude.toLocaleString('en-EN'),
                    coordinates.longitude.toLocaleString('en-EN')
                );

                userService.saveUserCity(locality);

                UpdateUserInfo(userService.getAuthInfo());
            } catch (err: any) {
                NotificationManager.error(err.message, err.name);
            }
        //}
    }

    const saveUserGeo = (latitude: any, longitude: any) => {
        let userGeo = new FormData();
        userGeo.append('id', userInfo.user.id);
        userGeo.append('latitude', latitude);
        userGeo.append('longitude', longitude);

        try {
            userService.saveUserGeo(userGeo);
            NotificationManager.success('Геопозиция сохранена');
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }


        return (
            <React.Fragment>

                <NotificationContainer />

                <div>
                    <div className={leftMenuIsOpen ? "LeftMenu open col-12 h-100" : "LeftMenu hide col-12 h-100"}>{/* position-fixed bottom-0 start-50 translate-middle-x */}
                        <div className="d-flex flex-column justify-content-center">

                            <div className="d-flex justify-content-end mb-3">
                                <div className="col-6 d-flex justify-content-center align-items-center">
                                    {userInfo.isAuthenticated &&
                                        (() => {
                                            if (userInfo.city) {
                                                return <h2>{userInfo.city}</h2>;
                                            } else {
                                                return <span className="fs-5">Город не указан</span>;
                                            }
                                        })()
                                    }
                                </div>
                                <div className="col-3 d-flex justify-content-between align-items-center">
                                    <span className="UpdateGeoIcon" role="button" onClick={onDetectLocality}><RepeatIcon /></span>
                                    {/*<button type="button" className="btn btn-outline-primary w-100" onClick={onDetectLocality}><small>Определить местоположение</small></button>*/}
                                    <span className="MenuCloseIcon" onClick={hideLeftMenu} role="button"><MenuCloseIcon /></span>
                                </div>
                            </div>


                            <div className="d-block">
                                {userInfo.isAuthenticated &&
                                    <div className="Info d-flex flex-column mb-5">
                                        
                                        <div className="d-flex flex-row justify-content-center align-items-center">
                                            <span className="AvatarContainer me-3"><img className="Avatar avatar rounded-circle" src={getAvatarPathForUser(userInfo.user)} alt="" /></span>
                                            <span className="Name">{userInfo.user.fullName}</span>
                                        </div>
                                    </div>
                                }
                                <div className="fs-3 w-100 text-center mb-5">
                                    <Link className="Item" to="/">Настройки</Link>
                                </div>

                                {userInfo.isAuthenticated &&
                                    <div className="fs-3 w-100 text-center mb-5">
                                        <Link className="Item" to={`/user/card/${userInfo.user.id}`} onClick={hideLeftMenu}>Профиль</Link>
                                    </div>
                                }

                                <div className="fs-3 w-100 text-center mb-5">
                                    <Link className="Item" to="/">Друзья</Link>
                                </div>

                                <div className="fs-3 w-100 text-center mb-5">
                                    <Link className="Item" to="/">События</Link>
                                </div>

                                <div className="fs-3 w-100 text-center mb-5">
                                    <Link className="Item" to="/">Объявления</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );

    }

export default connect(mapStateToProps("LeftMenu"), mapDispatchToProps("LeftMenu"))(LeftMenu);