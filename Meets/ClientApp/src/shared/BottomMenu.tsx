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
import useAccountStore from '../hooks/useAccountStore';
import useMenuStore from '../hooks/useMenuStore';




export default function BottomMenu() {
    //const currentUser = useCurrentUserStore();
    const { currentUser } = useAccountStore();
    const { selectedMenuItem, setSelectedItem } = useMenuStore();

    //useEffect(() => {
    //    currentUser.update();
    //}, []);

    return (
        <div className="BottomMenu position-relative" >
            <div className="Menu col-12 position-fixed bottom-0 start-50 translate-middle-x">

                <span className={selectedMenuItem === BottomMenuItems.TimeTable ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.TimeTable} onClick={() => setSelectedItem(BottomMenuItems.TimeTable)}> {/*props.selectMenuItemOnClick(BottomMenuItems.TimeTable)*/}
                        <TimeIconSvg />
                    </Link>
                </span>

                <span className={selectedMenuItem === BottomMenuItems.Notifications ? "MenuItem active" : "MenuItem"}>
                    <span className="Notify"></span>
                    <Link to={Routes.Notifications} onClick={() => setSelectedItem(BottomMenuItems.Notifications)}>
                        <NotificationIconSvg />
                    </Link>
                </span>

                <span className={selectedMenuItem === BottomMenuItems.UserSearch ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.UserSearch} onClick={() => setSelectedItem(BottomMenuItems.UserSearch)}>
                        <UserSearchIconSvg />
                    </Link>
                </span>

                <span className={selectedMenuItem === BottomMenuItems.Meetings ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.MeetingList} onClick={() => setSelectedItem(BottomMenuItems.Meetings)}>
                        <MessageIconSvg width='46' hieght='37' />
                    </Link>
                </span>

                <span className={selectedMenuItem === BottomMenuItems.Profie ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.UserCardBuild(currentUser.id)} onClick={() => setSelectedItem(BottomMenuItems.Profie)}>
                        <ProfileIconSvg />
                    </Link>
                </span>

            </div>
        </div >
    );
}
