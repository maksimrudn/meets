import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './BottomMenu.scss';
import { BottomMenuItems } from '../common/BottomMenuItems';
import TimeIconSvg from '../icons/TimeIconSvg';
import NotificationIconSvg from '../icons/NotificationIconSvg';
import UserSearchIconSvg from '../icons/UserSearchIconSvg';
import ProfileIconSvg from '../icons/ProfileIconSvg';
import MessageIconSvg from '../icons/MessageIconSvg';
import Routes from '../common/Routes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/createStore';
import useCurrentUserStore from '../hooks/useCurrentUserStore';



interface BottomMenuProps {
    selectedMenuItem: any

    selectMenuItemOnClick: (item: string) => void
}

export default function BottomMenu(props: BottomMenuProps) {
    const currentUser = useCurrentUserStore();

    //useEffect(() => {
    //    currentUser.update();
    //}, []);

    return (
        <div className="BottomMenu position-relative" >
            <div className="Menu col-12 position-fixed bottom-0 start-50 translate-middle-x">

                <span className={props.selectedMenuItem === BottomMenuItems.TimeTable ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.TimeTable} onClick={() => props.selectMenuItemOnClick(BottomMenuItems.TimeTable)}>
                        <TimeIconSvg />
                    </Link>
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
                    <Link to={Routes.UserCardBuild(currentUser.id)} onClick={() => props.selectMenuItemOnClick(BottomMenuItems.Profie)}>
                        <ProfileIconSvg />
                    </Link>
                </span>

            </div>
        </div >
    );
}
