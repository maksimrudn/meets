
import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { getAvatarPathForUser } from '../../common/Utils';
import moment from 'moment';


import './UserItem.scss';
import CoffeeIcon from '../../icons/CoffeeIcon';
import JobIcon from '../../icons/JobIcon';
import CompanyIcon from '../../icons/CompanyIcon';
import Routes from '../../common/Routes';
import UserAuthInfo from '../../contracts/UserAuthInfo';
import MeetRequestModal from '../../modules/entities/user/MeetRequestModal';

interface UserItemProps {
    currentUserId: number
    user: any
}

export default function UserItem(props: UserItemProps) {


    const [isOpenMeetModal, setIsOpenMeetModal] = useState(false);

    const meetRequestModalToggle = () => {
        setIsOpenMeetModal(!isOpenMeetModal);
    }


    return (
        <div className="UserItem col-12">
            <div className="Item card teacher-card">
                <div className="Header card-header">
                    <div className="Avatar">
                        <img src={getAvatarPathForUser(props.user)} alt="" className="avatar" />
                    </div>
                        <div className="Name">
                            <Link to={Routes.UserCardBuild(props.user.id)} >
                                {!props.user.fullName ? props.user.email : props.user.fullName}
                            </Link>
                        </div>
                    <div className="Age">{props.user.birthDate && (moment().diff(moment(props.user.birthDate), 'years'))}</div>
                </div>
                <div className="Body card-body">
                    <div className="Data">
                        {props.user.company &&
                            <div className="d-flex align-items-center mb-2">
                                <span className="me-2">
                                    <CompanyIcon color="#000" />
                                </span>
                                <span>{props.user?.company}</span>
                            </div>
                        }

                        {props.user.job &&
                            <div className="d-flex align-items-center mb-2">
                                <span className="me-2">
                                    <JobIcon color="#000" />
                                </span>
                                <span>{props.user?.job}</span>
                            </div>
                        }

                        <div className="Tags mb-2">
                            {props.user.tags && props.user.tags.map((tag: any) =>
                                <span className="Tag badge bg-secondary rounded-pill text-black py-2 px-3 me-2">{tag}</span>
                            )}
                        </div>
                    </div>

                    {props.user.id != props.currentUserId &&
                        <button className="Meet btn" type="button" onClick={meetRequestModalToggle} disabled={props.user.isInvited}>
                            <span className="Icon"><CoffeeIcon /></span>
                            <span className="Text">Пригласить</span>
                        </button>
                    }

                   
                </div>
            </div>


            {/*<MeetRequestModal*/}
            {/*    isOpen={isOpenMeetModal}*/}
            {/*    toggle={meetRequestModalToggle}*/}
            {/*    user={props.user}*/}
            {/*    mapSelectModalToggle={mapSelectModalToggle}*/}
            {/*    meetingAddress={meetingAddress}*/}
            {/*    updateUser={update}*/}
            {/*//updateNotifications={props.updateNotifications}*/}
            {/*/>*/}

        </div>
    );
}
