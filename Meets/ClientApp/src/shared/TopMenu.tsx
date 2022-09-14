import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";


import { connect } from 'react-redux';
import mapStateToProps from '../store/mapStateToProps';
import mapDispatchToProps from '../store/mapDispatchToProps';
import $ from 'jquery';

import './TopMenu.scss';
import * as Cookies from 'js-cookie';
import { getAvatarPathForUser } from '../common/Utils';
import AppConfig from '../common/AppConfig';
import Routes from '../common/Routes';



function TopMenu(props: any) {
    const LogOut = (e: any) => {
        Cookies.remove('access_token');
    }

    const menuToggle = (e: any) => {
        $('.LeftMenu').toggleClass('open');
        $('.body').toggleClass('hide');

        // особенность связанная с templates.js, где-то стоит тогглер, котоый ставит hide
        //if ($('.body').hasClass('hide')) {
        //    $('.body').removeClass('hide');
        //}
        //else {
        //    $('.body').addClass('hide');
        //}
        
    }

        return (
            <div className="header" >
                <nav className="navbar">
                    <div className="header-container">

                        <Link className="logo" to="/event/search">
                            <img src={ AppConfig.Logo } />
                        </Link>

                        <div className="d-flex align-items-center">


                            {!props.userInfo.isAuthenticated &&
                                <div>
                                    <Link to="/account/login" className="btn btn-warning fw-bold">Войти</Link>
                                    <Link to="/account/register" className="btn btn-warning ms-2 fw-bold d-xs-none">Регистрация</Link>
                                </div>
                            }

                            {props.userInfo.isAuthenticated &&


                                <div className="user-profile dropdown ms-2 ms-sm-3 d-flex align-items-center zindex-popover">

                                    <div className="u-info me-2">
                                        <div className="mb-0 text-end line-height-sm ">
                                            <div className="font-weight-bold fullname">{props.userInfo.user.fullName}</div>
                                    </div>

                                        {props.userInfo.isAdmin ?
                                            (<small>Администратор</small>) :
                                            (<small>Пользователь</small>)
                                        }

                                    </div>
                                    <a className="nav-link dropdown-toggle pulse p-0" href="#" role="button" data-bs-toggle="dropdown" data-bs-display="static">
                                        <img src={getAvatarPathForUser(props.userInfo.user)} className="avatar rounded-circle img-thumbnail" alt="user" />
                                    </a>
                                    <div className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
                                        <div className="card border-0 w280">
                                            <div className="card-body pb-0">
                                                <div className="d-flex py-1">
                                                    <img className="avatar rounded-circle" src={getAvatarPathForUser(props.userInfo.user)} alt="" />
                                                    <div className="flex-fill ms-3">
                                                        <p className="mb-0"><span className="font-weight-bold">{props.userInfo.user.fullName}</span></p>
                                                        <small className="">{props.userInfo.user.Email}</small>
                                                    </div>
                                                </div>

                                                <div><hr className="dropdown-divider border-dark" /></div>
                                            </div>
                                            <div className="list-group m-2 ">
                                                <Link className="list-group-item list-group-item-action border-0" to={Routes.UserCardBuild(props.userInfo.user.id)}><i className="icofont-ui-user fs-5 me-3"></i>Профиль</Link>
                                                <div><hr className="dropdown-divider border-dark" /></div>
                                                <a href="/" className="list-group-item list-group-item-action border-0" onClick={LogOut}><i className="icofont-logout fs-6 me-3"></i>Выйти</a>
                                                {/*    <form className="form-inline" action="./Identity/Account/Logout?returnUrl=%2fr%2fevent%2fsearch" method="post"> */}{/*?returnUrl=%2fr%2fevent%2fsearch */}
                                                {/*        <button type="submit" className="list-group-item list-group-item-action border-0"><i className="icofont-logout fs-6 me-3"></i>Выйти</button>*/}
                                                {/*    </form>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {props.userInfo.isAuthenticated &&
                                <button className="navbar-toggler border-0 menu-toggle " type="button" data-bs-toggle="collapse" data-bs-target="#mainHeader" onClick={(e) => menuToggle(e)}>
                                    <span className="fa fa-bars"></span>
                                </button>
                            }
                        </div >
                    </div >
                </nav >
            </div >

        );

    }


export default  connect(mapStateToProps("TopMenu"), mapDispatchToProps("TopMenu"))(TopMenu);