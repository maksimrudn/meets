import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import { connect, useSelector } from 'react-redux';
import mapStateToProps from '../store/mapStateToProps';
import mapDispatchToProps from '../store/mapDispatchToProps';


import UserCard from '../pages/user/UserCard';
import UserSearch from '../pages/user/UserSearch';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/scss/main.scss';
import './Layout.scss';
import Login from '../pages/account/Login';
import Register from '../pages/account/Register';
import ForgotPasswordStep1 from '../pages/account/ForgotPasswordStep1';
import ConfirmEmail from '../pages/account/ConfirmEmail';
import ConfirmEmailMessage from '../pages/account/ConfirmEmailMessage';
import ForgotPasswordStep2 from '../pages/account/ForgotPasswordStep2';
import AccessDenied from '../pages/account/AccessDenied';
import Lockout from '../pages/account/Lockout';

import 'bootstrap/dist/js/bootstrap.js';
import BottomMenu from './BottomMenu';
import { BottomMenuItems } from '../common/BottomMenuItems';
import ConfirmEmailSuccess from '../pages/account/ConfirmEmailSuccess';
import ConfirmEmailError from '../pages/account/ConfirmEmailError';
import ForgotPasswordStep3 from '../pages/account/ForgotPasswordStep3';
import ForgotPasswordStep4 from '../pages/account/ForgotPasswordStep4';
import Error from '../pages/common/Error';
import Routes from '../common/Routes';
import ProfileSettings from '../pages/user/ProfileSettings';
import UserChangePassword from '../pages/user/UserChangePassword';
import UserConfirmEmail from '../pages/user/UserConfirmEmail';
import UserAuthInfo from '../contracts/UserAuthInfo';
import MeetingList from '../pages/meeting/MeetingList';
import Meeting from '../pages/meeting/Meeting';
import NotificationList from '../pages/notifications/NotificationList';
import NotificationDTO from '../contracts/notifications/NotificationDTO';
import notificationService from '../api/NotificationService';
import { RootState, useAppDispatch } from '../store/createStore';
import { getIsLoggedIn } from '../store/currentUser';
import TimeTable from '../pages/meeting/TimeTable';



function Layout() {

    const currentUser = useSelector((state: RootState) => state.currentUser);
    const isLoggedIn = useSelector(getIsLoggedIn());
    const dispatch = useAppDispatch();

    const [isOpenMeeting, setIsOpenMeeting] = useState(false);

    const [selectedMenuItem, setSelectedMenuItem] = useState(BottomMenuItems.UserSearch);




    const selectMenuItemOnClick = (item: string) => {
        //const item = e.target.dataset.item;
        switch (item) {
            case BottomMenuItems.UserSearch:
                setSelectedMenuItem(BottomMenuItems.UserSearch);
                break;
            case BottomMenuItems.Profie:
                setSelectedMenuItem(BottomMenuItems.Profie);
                break;
            case BottomMenuItems.Meetings:
                setSelectedMenuItem(BottomMenuItems.Meetings);
                break;
            case BottomMenuItems.Notifications:
                setSelectedMenuItem(BottomMenuItems.Notifications);
                break;
            case BottomMenuItems.TimeTable:
                setSelectedMenuItem(BottomMenuItems.TimeTable);
                break;
        }

    }


    return (
        <Router basename="/">
            <div id="mytask-layout" className="Layout theme-indigo">

                <Switch>
                    <Route path="/account/">
                        <div className="body d-flex align-content-stretch align-self-stretch mx-auto h100" style={{ width: '768px' }}>
                            <div className="container-xl">
                                <Route path="/account/login"><Login /></Route>

                                <Route path="/account/register"><Register /></Route>
                                <Route path="/account/confirmEmailMessage" component={ConfirmEmailMessage} />
                                <Route path="/account/confirmEmail" component={ConfirmEmail} />
                                <Route path="/account/confirmEmailSuccess" component={ConfirmEmailSuccess} />
                                <Route path="/account/confirmEmailError" component={ConfirmEmailError} />

                                <Route path="/account/forgotPasswordStep1"><ForgotPasswordStep1 /></Route>
                                <Route path="/account/forgotPasswordStep2" component={ForgotPasswordStep2} />
                                <Route path="/account/forgotPasswordStep3" component={ForgotPasswordStep3} />
                                <Route path="/account/forgotPasswordStep4" component={ForgotPasswordStep4} />

                                <Route path={Routes.Error} component={Error} />
                                <Route path="/account/accessDenied" component={AccessDenied} />
                                <Route path="/account/lockout" component={Lockout} />
                            </div>
                        </div>
                    </Route>
                    <Route path='/' >

                        <div className="main">


                            <div className="body d-flex">
                                <div className="container-xl">
                                    <Switch>


                                        <Route exact path="/" render={(routeProps) => {
                                            return isLoggedIn ? <UserSearch userInfo={currentUser.user} /> : <Login />
                                        }} />


                                        {isLoggedIn &&
                                            <>
                                                <Route path={Routes.UserCard} render={(routeProps) => (
                                                    <UserCard
                                                        {...routeProps}
                                                    />

                                                )}></Route>
                                                <Route path={Routes.ProfileSettings} render={(props) => <ProfileSettings {...props} />}></Route>
                                                <Route path="/user/Search">
                                                    <UserSearch />
                                                </Route>
                                                <Route path={Routes.UserChangePassword} render={props => <UserChangePassword {...props} />} />
                                                <Route path={Routes.UserConfirmEmail} render={() => <UserConfirmEmail />} />
                                                <Route path={Routes.MeetingList} render={(props) => <MeetingList {...props} />} />
                                                <Route path={Routes.Meeting} render={(routeProps) => (
                                                    <Meeting

                                                        setIsOpenMeeting={setIsOpenMeeting}
                                                        {...routeProps}
                                                    />
                                                )} />
                                                <Route path={Routes.Notifications} render={() => (
                                                    <NotificationList />
                                                )} />
                                                <Route path={Routes.TimeTable} render={() => <TimeTable />} />
                                                <Route path={Routes.Error} render={() => <Error />} />
                                            </>
                                        }
                                    </Switch>
                                </div>
                            </div>

                            {(isLoggedIn && !isOpenMeeting) &&
                                <BottomMenu
                                    selectedMenuItem={selectedMenuItem}
                                    selectMenuItemOnClick={selectMenuItemOnClick}
                                />
                            }

                        </div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );

}

export default Layout;