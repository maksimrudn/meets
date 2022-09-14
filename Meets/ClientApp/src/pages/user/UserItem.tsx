import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { getAvatarPathForUser } from '../../common/Utils';
import Routes from '../../common/Routes';


interface UserItemProps {
    userInfo: any
    user: any
}

export default function UserItem(props: UserItemProps) {
    
    

    return (
        <div className="col-12">
            <div className="card teacher-card shadow">
                <div className="card-body d-flex">
                    <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                        <img src={getAvatarPathForUser(props.user)} alt="" className="avatar xl rounded-circle img-thumbnail shadow-sm" />
                    </div>
                    <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                        <h6 className="mb-0 mt-2  fw-bold d-block fs-6">{props.user.fullName == null ? props.user.email : props.user.fullName}</h6>
                        {
                            props.user.tags && props.user.tags.map((tag: any) =>
                                <span className="light-info-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1">{tag}</span>
                            )
                        }
                        
                        <Link to={Routes.UserCardBuild(props.user.id)} className="btn btn-primary btn-sm mt-1 bg-gradient w-100">
                            <i className="icofont-invisible me-2 fs-6"></i>
                            Перейти в профиль
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
