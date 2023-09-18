import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink } from "react-router-dom";
import './BottomMenu.scss';
import { BottomMenuItems } from '../common/BottomMenuItems';
import TimeIconSvg from '../icons/TimeIconSvg';
import NotificationIconSvg from '../icons/NotificationIconSvg';
import UserSearchIconSvg from '../icons/UserSearchIconSvg';
import ProfileIconSvg from '../icons/ProfileIconSvg';
import MessageIconSvg from '../icons/MessageIconSvg';
import Routes from '../common/Routes';
import useAccountStore from '../hooks/useAccountStore';
import useMenuStore from '../hooks/useMenuStore';




export default function BottomMenu() {
    const accountStore = useAccountStore();
    const menuStore = useMenuStore();

    return (
        <div className="BottomMenu position-relative" >
            <div className="Menu col-12 position-fixed bottom-0 start-50 translate-middle-x">

                <span className={menuStore.selectedMenuItem === BottomMenuItems.TimeTable ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.TimeTable} onClick={() => menuStore.setSelectedItem(BottomMenuItems.TimeTable)}>
                        <TimeIconSvg />
                    </Link>
                </span>

                <span className={menuStore.selectedMenuItem === BottomMenuItems.Notifications ? "MenuItem active" : "MenuItem"}>
                    <span className="Notify"></span>
                    <Link to={Routes.Notifications} onClick={() => menuStore.setSelectedItem(BottomMenuItems.Notifications)}>
                        <NotificationIconSvg />
                    </Link>
                </span>

                <span className={menuStore.selectedMenuItem === BottomMenuItems.UserSearch ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.UserSearch} onClick={() => menuStore.setSelectedItem(BottomMenuItems.UserSearch)}>
                        <UserSearchIconSvg />
                    </Link>
                </span>

                <span className={menuStore.selectedMenuItem === BottomMenuItems.Meetings ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.MeetingList} onClick={() => menuStore.setSelectedItem(BottomMenuItems.Meetings)}>
                        <MessageIconSvg width='46' hieght='37' />
                    </Link>
                </span>

                <span className={menuStore.selectedMenuItem === BottomMenuItems.Profie ? "MenuItem active" : "MenuItem"}>
                    <Link to={Routes.UserCardBuild(accountStore.currentUser?.id)} onClick={() => menuStore.setSelectedItem(BottomMenuItems.Profie)}>
                        <ProfileIconSvg />
                    </Link>
                </span>

            </div>
        </div >
    );
}
