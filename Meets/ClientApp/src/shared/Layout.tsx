import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

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
import ConfirmEmailSuccess from '../pages/account/ConfirmEmailSuccess';
import ConfirmEmailError from '../pages/account/ConfirmEmailError';
import ForgotPasswordStep3 from '../pages/account/ForgotPasswordStep3';
import ForgotPasswordStep4 from '../pages/account/ForgotPasswordStep4';
import Error from '../pages/common/Error';
import Routes from '../common/Routes';
import ProfileSettings from '../pages/user/ProfileSettings';
import UserChangePassword from '../pages/user/UserChangePassword';
import UserConfirmEmail from '../pages/user/UserConfirmEmail';
import MeetingList from '../pages/meeting/MeetingList';
import Meeting from '../pages/meeting/Meeting';
import NotificationList from '../pages/notifications/NotificationList';
import TimeTable from '../pages/meeting/TimeTable';
import useAccountStore from '../hooks/useAccountStore';
import ProtectedRoute from './ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WebRTC from '../pages/webrtc/WebRTC';


function Layout() {

    const account = useAccountStore();

    const [isOpenMeeting, setIsOpenMeeting] = useState(false);

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
                                            return account.isSignedIn ? <UserSearch /> : <Login />
                                        }} />


                                        <>
                                            <ProtectedRoute path={Routes.UserCard} render={(routeProps) => (
                                                <UserCard />

                                            )}></ProtectedRoute>
                                            <ProtectedRoute path={Routes.ProfileSettings} render={(props) => <ProfileSettings />}></ProtectedRoute>
                                            <ProtectedRoute path="/user/Search">
                                                <UserSearch />
                                            </ProtectedRoute>
                                            <ProtectedRoute path={Routes.UserChangePassword} render={props => <UserChangePassword />} />
                                            <ProtectedRoute path={Routes.UserConfirmEmail} render={() => <UserConfirmEmail />} />
                                            <ProtectedRoute path={Routes.MeetingList} render={(props) => <MeetingList {...props} />} />
                                            <ProtectedRoute path={Routes.Meeting} render={(routeProps) => (
                                                <Meeting

                                                    setIsOpenMeeting={setIsOpenMeeting}
                                                    {...routeProps}
                                                />
                                            )} />
                                            <ProtectedRoute path={Routes.Notifications} render={() => (
                                                <NotificationList />
                                            )} />
                                            <ProtectedRoute path={Routes.TimeTable} render={() => <TimeTable />} />
                                            <ProtectedRoute path={Routes.WebRTC} render={() => <WebRTC />} />
                                            <Route path={Routes.Error} render={() => <Error />} />
                                        </>

                                    </Switch>
                                </div>
                            </div>

                            {(account.isSignedIn && !isOpenMeeting) &&
                                <BottomMenu />
                            }

                            <ToastContainer
                                position="bottom-right"
                            />
                        </div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );

}

export default Layout;