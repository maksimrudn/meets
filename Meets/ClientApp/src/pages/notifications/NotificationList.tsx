import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import NotificationDTO from '../../contracts/notifications/NotificationDTO';
import GoBackIcon from '../../icons/GoBackIcon';
import moment from 'moment';
import 'moment-timezone';

import './NotificationList.scss';
import InfoIcon from '../../icons/InfoIcon';
import Routes from '../../common/Routes';
import notificationService from '../../api/NotificationService';



export default function NotificationList() {
    const history = useHistory();

    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);

    useEffect(() => { updateNotifications(); }, []);

    const updateNotifications = async () => {
        try {
            let res = await notificationService.getList();
            setNotifications(res);
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }

    return (
        <div className="NotificationList">

            <div className="Header">
                <span className="GoBackBtn" onClick={() => history.goBack()}><GoBackIcon /></span>
                <span className="Title">Уведомления</span>
                <span></span>
            </div>

            <div className="Content">

                <div className="Today">
                    <div className="Title">Сегодня</div>
                    <div className="Notifications">
                        {notifications.length > 0 && notifications.filter((item: NotificationDTO) => moment(item.createdDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')).map((item: NotificationDTO) =>
                            <div className="Item">
                                <span className="InfoIcon"><InfoIcon /></span>
                                <div className="Message">
                                    <div className="Title">
                                        <div>Встреча {moment(item.meeting?.meetingDate).format('DD.MM.YYYY HH:mm')}</div>
                                        <div><Link
                                            to={location => ({
                                                ...location,
                                                pathname: Routes.MeetingBuild(item.senderId),
                                                state: {
                                                    meetingId: item.meetingId
                                                }
                                            })}
                                            className="Link"
                                        >
                                            ({item.sender?.fullName})
                                        </Link> -</div>
                                        {/*  == props.userInfo.user.id ? item.receiver?.id : item.sender?.id item.senderId == props.userInfo.user.id ? item.receiver?.fullName :  */}
                                    </div>
                                    <div className="Text">{item.message}</div>
                                </div>
                                <span className="Time">{moment(item.createdDate).format('HH:mm')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="Yesterday">
                    <div className="Title">Вчера</div>
                    <div className="Notifications">
                        {notifications.length > 0 && notifications.filter((item: NotificationDTO) => moment(item.createdDate).format('DD-MM-YYYY') === moment().add(-1, 'days').format('DD-MM-YYYY')).map((item: NotificationDTO) =>
                            <div className="Item">
                                <span className="InfoIcon"><InfoIcon /></span>
                                <div className="Message">
                                    <div className="Title">
                                        <div>Встреча {moment(item.meeting?.meetingDate).format('DD.MM.YYYY HH:mm')}</div>
                                        <div><Link
                                            to={location => ({
                                                ...location,
                                                pathname: Routes.MeetingBuild(item.senderId),
                                                state: {
                                                    meetingId: item.meetingId
                                                }
                                            })}
                                            className="Link"
                                        >
                                            ({item.sender?.fullName})
                                        </Link> -</div>
                                        {/*  == props.userInfo.user.id ? item.receiver?.id : item.sender?.id item.senderId == props.userInfo.user.id ? item.receiver?.fullName :  */}
                                    </div>
                                    <div className="Text">{item.message}</div>
                                </div>
                                <span className="Time">{moment(item.createdDate).format('HH:mm')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="Past">
                    <div className="Title">Прошедшие</div>
                    <div className="Notifications">
                        {notifications.length > 0 && notifications.filter((item: NotificationDTO) => moment(item.createdDate).format('DD-MM-YYYY') <= moment().add(1, 'days').format('DD-MM-YYYY')).map((item: NotificationDTO) =>
                            <div className="Item">
                                <span className="InfoIcon"><InfoIcon /></span>
                                <div className="Message">
                                    <div className="Title">
                                        <div>Встреча {moment(item.meeting?.meetingDate).format('DD.MM.YYYY HH:mm')}</div>
                                        <div><Link
                                            to={location => ({
                                                ...location,
                                                pathname: Routes.MeetingBuild(item.senderId),
                                                state: {
                                                    meetingId: item.meetingId
                                                }
                                            })}
                                            className="Link"
                                        >
                                            ({item.sender?.fullName})
                                        </Link> -</div>
                                        {/*  == props.userInfo.user.id ? item.receiver?.id : item.sender?.id item.senderId == props.userInfo.user.id ? item.receiver?.fullName :  */}
                                    </div>
                                    <div className="Text">{item.message}</div>
                                </div>
                                <span className="Time">{moment(item.createdDate).format('HH:mm')}</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}