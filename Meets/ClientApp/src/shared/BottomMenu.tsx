import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink } from "react-router-dom";
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
import './BottomMenu.scss';
import { select } from 'redux-saga/effects';
import { getAvatarPathForUser } from '../common/Utils';
import UserSearchIcon from '../icons/UserSearchIcon';
import CalendarIcon from '../icons/CalendarIcon';
import DocumentIcon from '../icons/DocumentIcon';
import MessageIcon from '../icons/MessageIcon';
import MenuIcon from '../icons/MenuIcon';
import { BottomMenuItems } from '../common/BottomMenuItems';
import TimeIconSvg from '../icons/TimeIconSvg';
import NotificationIconSvg from '../icons/NotificationIconSvg';
import UserSearchIconSvg from '../icons/UserSearchIconSvg';
import ProfileIconSvg from '../icons/ProfileIconSvg';
import MessageIconSvg from '../icons/MessageIconSvg';
import Routes from '../common/Routes';



interface BottomMenuProps {
    userInfo: any
    selectedMenuItem: any

    selectMenuItemOnClick: (item: string) => void
    //openLeftMenu: () => void
}

export default function BottomMenu(props: BottomMenuProps) {
    return (
        <div className="BottomMenu position-relative">
            <div className="Menu col-12 position-fixed bottom-0 start-50 translate-middle-x">

                <span className="MenuItem">
                    <TimeIconSvg />
                </span>

                <span className="MenuItem">
                    <NotificationIconSvg />
                </span>

                <NavLink
                    exact
                    to="/user/search"
                    activeClassName="active"
                    className="MenuItem"
                    isActive={(match, location) => {
                        return (!!match || location.pathname === '/');
                    }}
                >
                    <UserSearchIconSvg />
                </NavLink>

                <span className="MenuItem">
                    <MessageIconSvg />
                </span>

                <NavLink
                    //exact
                    to={`/user/card/${props.userInfo.user.id}`}
                    activeClassName="active"
                    className="MenuItem"
                    isActive={(match, location) => {
                        return (match || location.pathname.includes('settings') || location.pathname.includes('cnangepassword') || location.pathname.includes('confirmemail'));
                    }}
                >
                    <ProfileIconSvg />
                </NavLink>

            </div>
        </div>
    );
}