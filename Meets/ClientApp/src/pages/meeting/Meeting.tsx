import { Location } from 'history';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useHistory, useParams } from 'react-router-dom';
import meetingsService from '../../api/MeetingsService';
import Routes from '../../common/Routes';
import MeetingDTO from '../../contracts/meeting/MeetingDTO';
import UserAuthInfo from '../../contracts/UserAuthInfo';
import ArrowIcon from '../../icons/GoBackIcon';
import MeetingIcon from '../../icons/MeetingIcon';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/ru';

import './Meeting.scss';
import CalendarAltIcon from '../../icons/CalendarAltIcon';
import AccessTimeIcon from '../../icons/AccessTimeIcon';
import LocationIconSvg from '../../icons/LocationIconSvg';
import EditIcon from '../../icons/EditIcon';
import GetMeetingDTO from '../../contracts/meeting/GetMeetingDTO';
import PersonIcon from '../../icons/PersonIcon';
import { MeetingStatus, MeetingStatusItems } from '../../common/MeetingStatus';
import { getAvatarPathForUser } from '../../common/Utils';
import EmptyAvatarIcon from '../../icons/EmptyAvatarIcon';
import messageService from '../../api/MessageService';
import MessageList from '../messanger/MessageList';
import MessageDTO from '../../contracts/message/MessageDTO';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'
import AppConfig from '../../common/AppConfig';
import MeetingFieldNames from '../../common/MeetingFieldNames';
import MeetingEditModal from '../../modules/entities/meeting/MeetingEditModal';

interface IMeetingParams {
    id?: string
}

interface ILocationState{
    meetingId: any
}

interface IMeetingProps {
    userInfo: UserAuthInfo,
    setIsOpenMeeting: any,
    location: Location<ILocationState>
    //updateNotifications: () => void
}

export default function Meeting(props: IMeetingProps) {
    const history = useHistory();
    const params = useParams<IMeetingParams>();

    const [meeting, setMeeting] = useState<GetMeetingDTO>(new GetMeetingDTO());
    const [messages, setMessages] = useState<MessageDTO[]>([]);

    const [isOpenMeetingModal, setIsOpenMeetingModal] = useState(false);
    const [selectedFieldName, setSelectedFieldName] = useState<string>('');

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        updateMeeting();
        updateMessages();
    }, []);

    useEffect(() => {
        props.setIsOpenMeeting(true);

        return () => {
            props.setIsOpenMeeting(false);
        };
    });

    const updateMeeting = () => {
        try {
            let mt = meetingsService.get(props.location.state.meetingId);
            setMeeting(mt);
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }

    const updateMessages = () => {
        try {
            let res = messageService.getMessages(props.location.state.meetingId);
            setMessages(res);
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }

    const onSendMessage = (text: any, receiverId: any) => {

        var msgDto = {
            receiverId: receiverId,
            text: text,
            meetingId: props.location.state.meetingId
        };

        messageService.sendMessage(msgDto);
        updateMessages();
    }

    const discussOnClick = () => {
        try {
            meetingsService.discuss(props.location.state.meetingId);
            updateMeeting();
            //props.updateNotifications();
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }

    const cancelOnClick = () => {
        try {
            meetingsService.cancel(props.location.state.meetingId);
            updateMeeting();
            //props.updateNotifications();
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }

    const confirmOnClick = () => {
        try {
            meetingsService.confirm(props.location.state.meetingId);
            updateMeeting();
            //props.updateNotifications();
        } catch (err) {
            history.push(Routes.Error, err);
        }
    }

    const onEditMeetingSave = (value: string, fieldName: string) => {
        try {
            let mt = {
                id: props.location.state.meetingId,
                place: '',
                meetingDate: ''
            }

            if (fieldName === MeetingFieldNames.Date) {
                mt.place = meeting.place;
                mt.meetingDate = value;
            } else {
                mt.meetingDate = meeting.meetingDate;
                mt.place = value;
            }

            meetingsService.edit(mt);
            updateMeeting();
            //props.updateNotifications();
            meetingModalToggle();

        } catch (err) {
            history.push(Routes.Error, err);
        }
    }

    const editOnClick = (fieldName: string) => {
        setSelectedFieldName(fieldName);
        meetingModalToggle();
    }

    const meetingModalToggle = () => {
        setIsOpenMeetingModal(!isOpenMeetingModal);
    }

    const expandToggle = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <div className="Meeting">

            <div className="Header col-12">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="GoBackBtn" onClick={() => history.goBack()}><ArrowIcon /></span>
                    <span className="Title">Встреча</span>
                    <span className="MeetingBtn" onClick={() => history.push(Routes.MeetingList)}><MeetingIcon /></span>
                </div>

                {(() => {
                    if (!isExpanded) {
                        return (
                            <div className="NotExpanded">
                                <div className="col-md-7 col-10 d-flex flex-column">
                                    <div className="DateTime mb-2">
                                        <span className="CalendarIcon me-2"><CalendarAltIcon /></span>
                                        <span className="me-3">{moment(meeting.meetingDate).format('DD MMMM, YYYY')} ({moment(meeting.meetingDate).format('ddd')})</span>
                                        <span className="TimeIcon me-2"><AccessTimeIcon /></span>
                                        <span className="me-2">{moment(meeting.meetingDate).format('HH:mm')}</span>
                                        {(meeting.isOwner && meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Place mb-2">
                                        <span className="me-2"><LocationIconSvg width='10.47' height='16.75' color='#000' /></span>
                                        <span className="me-2">{meeting.place}</span>
                                        {(meeting.isOwner && meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Place)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Companion mb-2">
                                        <span className="me-2"><PersonIcon /></span>
                                        <span>{meeting.companion?.fullName}</span>
                                    </div>
                                    <div className="Status mb-2">{MeetingStatus[meeting.status as MeetingStatusItems]?.Title}</div>
                                    <button className="ExpandBtn" type="button" onClick={expandToggle}><ArrowIcon /></button>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className="Expanded">
                                <div className="col-md-7 col-12 d-flex flex-column">
                                    <div className="Date mb-2">
                                        <span className="CalendarIcon me-2"><CalendarAltIcon /></span>
                                        <span className="me-3">{moment(meeting.meetingDate).format('DD MMMM, YYYY')} ({moment(meeting.meetingDate).format('ddd')})</span>
                                        {(meeting.isOwner && meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Time mb-2">
                                        <span className="TimeIcon me-2"><AccessTimeIcon /></span>
                                        <span className="me-2">{moment(meeting.meetingDate).format('HH:mm')}</span>
                                        {(meeting.isOwner && meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Place mb-2">
                                        <span className="me-2"><LocationIconSvg width='10.47' height='16.75' color='#000' /></span>
                                        <span className="me-2">{meeting.place}</span>
                                        {(meeting.isOwner && meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Place)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Companion mb-2">
                                        {meeting.companion?.avatar
                                            ? <span className="Avatar me-3"><img src={getAvatarPathForUser(meeting.companion)} alt="" /></span>
                                            : <span className="EmptyAvatar me-3"><EmptyAvatarIcon color='#000' /></span>
                                        }
                                        <span className="Name">{meeting.companion?.fullName}</span>
                                    </div>
                                    <div className="Status mb-3">
                                        <span className="me-2">Статус</span>
                                        <span className="Badge">{MeetingStatus[meeting.status as MeetingStatusItems]?.Title}</span>
                                    </div>
                                    {(() => {
                                        if (!meeting.isOwner) {

                                            if (meeting.status !== MeetingStatus.Discussion.Code &&
                                                meeting.status !== MeetingStatus.Confirmed.Code &&
                                                meeting.status !== MeetingStatus.Canceled.Code) {
                                                return (<button className="StatusBtn" type="button" onClick={discussOnClick}>Обсудить</button>);
                                            }
                                        }
                                    })()}
                                    {(() => {
                                        if (!meeting.isOwner) {

                                            if (meeting.status !== MeetingStatus.Confirmed.Code &&
                                                meeting.status !== MeetingStatus.Canceled.Code) {
                                                return (<button className="StatusBtn" type="button" onClick={confirmOnClick}>Подтвердить</button>);
                                            }
                                        }
                                    })()}
                                    {meeting.status !== MeetingStatus.Canceled.Code &&
                                        <button className="StatusBtn" type="button" onClick={cancelOnClick}>Завершить</button>
                                    }

                                    <button className="ExpandBtn" type="button" onClick={expandToggle}><ArrowIcon /></button>
                                </div>
                            </div>
                        );
                    }
                })()}
            </div>

            <div className="Messanger">
                <MessageList
                    messages={messages}
                    onSendMessage={onSendMessage}
                    targetUserId={params.id}
                    isCanSendMessage={meeting.status === MeetingStatus.Discussion.Code || meeting.status === MeetingStatus.Confirmed.Code}
                />
            </div>

            <MeetingEditModal
                isOpen={isOpenMeetingModal}
                toggle={meetingModalToggle}
                fieldName={selectedFieldName}
                meeting={meeting}
                onSaveChanges={onEditMeetingSave}
            />
        </div>
    );
}