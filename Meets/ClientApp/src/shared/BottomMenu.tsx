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

                <span className={props.selectedMenuItem === BottomMenuItems.Notifications ? "MenuItem active" : "MenuItem"}>
                    <span className="Notify"></span>
                    <Link to={Routes.Notifications} onClick={() => props.selectMenuItemOnClick(BottomMenuItems.Notifications)}>
                        <NotificationIconSvg />
                    </Link>
                </span>

                <span className={props.selectedMenuItem === BottomMenuItems.UserSearch ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.UserSearch} onClick={() => props.selectMenuItemOnClick(BottomMenuItems.UserSearch)}>
                        <UserSearchIconSvg />
                    </Link>
                </span>

                <span className={props.selectedMenuItem === BottomMenuItems.Meetings ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.MeetingList} onClick={() => props.selectMenuItemOnClick(BottomMenuItems.Meetings)}>
                        <MessageIconSvg width='46' hieght='37' />
                    </Link>
                </span>

                <span className={props.selectedMenuItem === BottomMenuItems.Profie ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.UserCardBuild(props.userInfo.user.id)} onClick={() => props.selectMenuItemOnClick(BottomMenuItems.Profie)}>
                        <ProfileIconSvg />
                    </Link>
                </span>

            </div>
        </div>
    );
}