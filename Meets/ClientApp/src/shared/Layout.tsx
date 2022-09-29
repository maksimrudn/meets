import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import { connect } from 'react-redux';
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


interface LayoutProps {
    userInfo: UserAuthInfo,
    UpdateUserInfo: any
}

function Layout(props: LayoutProps) {
    const [isOpenMeeting, setIsOpenMeeting] = useState(false);
    //const meetingPage = useRouteMatch({ path: Routes.Meeting }); //{ path: Routes.Meeting }
    //const meetingPage = matchPath('/meeting/', { path: Routes.Meeting, exact: true });

    const [selectedMenuItem, setSelectedMenuItem] = useState('');
    const [leftMenuIsOpen, setLeftMenuIsOpen] = useState(false);

    const selectMenuItemOnClick = (item: string) => {
        //const item = e.target.dataset.item;
        switch (item) {
            case BottomMenuItems.UserSearch:
                setSelectedMenuItem(BottomMenuItems.UserSearch);
                setLeftMenuIsOpen(false);
                break;
            case BottomMenuItems.Profie:
                setSelectedMenuItem(BottomMenuItems.Profie);
            case BottomMenuItems.Meetings:
                setSelectedMenuItem(BottomMenuItems.Meetings);
                setLeftMenuIsOpen(false);
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
                                            return props.userInfo.isAuthenticated ? <UserSearch userInfo={props.userInfo} /> : <Login />
                                        }} />


                                        {props.userInfo.isAuthenticated &&
                                            <>
                                                <Route path={Routes.UserCard} render={(props) => <UserCard userInfo={props.userInfo} {...props} />}></Route>
                                                <Route path={Routes.ProfileSettings} render={(props) => <ProfileSettings userInfo={props.userInfo} {...props} />}></Route>
                                                <Route path="/user/Search">
                                                    <UserSearch userInfo={props.userInfo} />
                                                </Route>
                                                <Route path={Routes.UserChangePassword} render={props => <UserChangePassword {...props} />} />
                                                <Route path={Routes.UserConfirmEmail} render={() => <UserConfirmEmail userInfo={props.userInfo} />} />
                                                <Route path={Routes.MeetingList} render={(props) => <MeetingList userInfo={props.userInfo} {...props} />} />
                                                <Route path={Routes.Meeting} render={(routeProps) => (
                                                    <Meeting
                                                            userInfo={props.userInfo}
                                                            setIsOpenMeeting={setIsOpenMeeting}
                                                            {...routeProps}
                                                        />
                                                    )} />
                                                <Route path={Routes.Error} render={() => <Error />} />
                                            </>
                                        }
                                    </Switch>
                                </div>
                            </div>

                            {(props.userInfo.isAuthenticated && !isOpenMeeting) &&
                                <BottomMenu
                                    userInfo={props.userInfo}
                                    selectedMenuItem={selectedMenuItem}
                                    selectMenuItemOnClick={selectMenuItemOnClick}
                                //openLeftMenu={openLeftMenu}
                                />
                            }

                        </div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );

}

export default connect(mapStateToProps("Layout"), mapDispatchToProps("Layout"))(Layout);