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
import './BottomMenu.scss';
import { select } from 'redux-saga/effects';
import { getAvatarPathForUser } from '../common/Utils';
import UserSearchIcon from '../icons/UserSearchIcon';
import CalendarIcon from '../icons/CalendarIcon';
import DocumentIcon from '../icons/DocumentIcon';
import MessageIcon from '../icons/MessageIcon';
import MenuIcon from '../icons/MenuIcon';
import { BottomMenuItems } from '../common/BottomMenuItems';



interface BottomMenuProps {
    selectedMenuItem: any

    selectMenuItemOnClick: (item: string) => void
    openLeftMenu: () => void
}

export default function BottomMenu(props: BottomMenuProps) {
    

    return (
        <div className="BottomMenu position-relative">
            <div className="Menu col-12 position-fixed bottom-0 start-50 translate-middle-x">
                <span className={props.selectedMenuItem === BottomMenuItems.UserSearch ? "MenuItem active" : "MenuItem"}>
                    <Link to="/user/search" onClick={() => props.selectMenuItemOnClick(BottomMenuItems.UserSearch)}>
                        <UserSearchIcon />
                    </Link>
                </span>

                <span className="MenuItem">
                    <CalendarIcon />
                </span>

                <span className="MenuItem">
                    <DocumentIcon />
                </span>

                <span className={props.selectedMenuItem === BottomMenuItems.Meetings ? "MenuItem active" : "MenuItem"}>
                    <Link to="/meetings" onClick={() => props.selectMenuItemOnClick(BottomMenuItems.Messanger)}>
                        <MessageIcon />
                    </Link>
                </span>

                <span className={props.selectedMenuItem === BottomMenuItems.LeftMenu ? "MenuItem active" : "MenuItem"} onClick={props.openLeftMenu}>
                    <MenuIcon />
                </span>

            </div>
        </div>
    );
}