import { Location } from 'history';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useHistory, useParams } from 'react-router-dom';
import meetingsService from '../../api/MeetingsService';
import Routes from '../../common/Routes';
import MeetingDTO from '../../contracts/meeting/MeetingDTO';
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
import useMeetingStore from '../../hooks/useMeetingStore';

interface IMeetingParams {
    id?: string
}

interface ILocationState {
    meetingId: any
}

interface IMeetingProps {
    setIsOpenMeeting: any,
    location: Location<ILocationState>
}

export default function Meeting(props: IMeetingProps) {
    const history = useHistory();
    const params = useParams<IMeetingParams>();

    const { meetingId } = props.location.state;
    const state = useMeetingStore();

    const [isOpenMeetingModal, setIsOpenMeetingModal] = useState(false);
    const [selectedFieldName, setSelectedFieldName] = useState<string>('');

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        state.updateMeeting(meetingId);
        state.updateMessages(meetingId);
    }, []);

    useEffect(() => {
        props.setIsOpenMeeting(true);

        return () => {
            props.setIsOpenMeeting(false);
        };
    });

    const onSendMessage = (text: any, receiverId: any) => {
        try {
            state.sendMessage(meetingId, text, receiverId);
        } catch (err) { }
    }

    const discussOnClick = () => {
        try {
            state.discuss(meetingId);
        } catch (err) {
            
        }
    }

    const cancelOnClick = () => {
        try {
            state.cancel(meetingId);
        } catch (err) {
            
        }
    }

    const confirmOnClick = () => {
        try {
            state.confirm(meetingId);
        } catch (err) {
            
        }
    }

    const handleEdit = (value: string, fieldName: string) => {
        try {
            state.edit(meetingId, value, fieldName);
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
                                        <span className="me-3">{moment(state.meeting.meetingDate).format('DD MMMM, YYYY')} ({moment(state.meeting.meetingDate).format('ddd')})</span>
                                        <span className="TimeIcon me-2"><AccessTimeIcon /></span>
                                        <span className="me-2">{moment(state.meeting.meetingDate).format('HH:mm')}</span>
                                        {(state.meeting.isOwner && state.meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Place mb-2">
                                        <span className="me-2"><LocationIconSvg width='10.47' height='16.75' color='#000' /></span>
                                        <span className="me-2">{state.meeting.place}</span>
                                        {(state.meeting.isOwner && state.meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Place)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Companion mb-2">
                                        <span className="me-2"><PersonIcon /></span>
                                        <span>{state.meeting.companion?.fullName}</span>
                                    </div>
                                    <div className="Status mb-2">{MeetingStatus[state.meeting.status as MeetingStatusItems]?.Title}</div>
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
                                        <span className="me-3">{moment(state.meeting.meetingDate).format('DD MMMM, YYYY')} ({moment(state.meeting.meetingDate).format('ddd')})</span>
                                        {(state.meeting.isOwner && state.meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Time mb-2">
                                        <span className="TimeIcon me-2"><AccessTimeIcon /></span>
                                        <span className="me-2">{moment(state.meeting.meetingDate).format('HH:mm')}</span>
                                        {(state.meeting.isOwner && state.meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Place mb-2">
                                        <span className="me-2"><LocationIconSvg width='10.47' height='16.75' color='#000' /></span>
                                        <span className="me-2">{state.meeting.place}</span>
                                        {(state.meeting.isOwner && state.meeting.status !== MeetingStatus.Canceled.Code) &&
                                            <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Place)}><EditIcon /></span>
                                        }
                                    </div>
                                    <div className="Companion mb-2">
                                        {state.meeting.companion?.avatar
                                            ? <span className="Avatar me-3"><img src={getAvatarPathForUser(state.meeting.companion)} alt="" /></span>
                                            : <span className="EmptyAvatar me-3"><EmptyAvatarIcon color='#000' /></span>
                                        }
                                        <span className="Name">{state.meeting.companion?.fullName}</span>
                                    </div>
                                    <div className="Status mb-3">
                                        <span className="me-2">Статус</span>
                                        <span className="Badge">{MeetingStatus[state.meeting.status as MeetingStatusItems]?.Title}</span>
                                    </div>
                                    {(() => {
                                        if (!state.meeting.isOwner) {

                                            if (state.meeting.status !== MeetingStatus.Discussion.Code &&
                                                state.meeting.status !== MeetingStatus.Confirmed.Code &&
                                                state.meeting.status !== MeetingStatus.Canceled.Code) {
                                                return (<button className="StatusBtn" type="button" onClick={discussOnClick}>Обсудить</button>);
                                            }
                                        }
                                    })()}
                                    {(() => {
                                        if (!state.meeting.isOwner) {

                                            if (state.meeting.status !== MeetingStatus.Confirmed.Code &&
                                                state.meeting.status !== MeetingStatus.Canceled.Code) {
                                                return (<button className="StatusBtn" type="button" onClick={confirmOnClick}>Подтвердить</button>);
                                            }
                                        }
                                    })()}
                                    {state.meeting.status !== MeetingStatus.Canceled.Code &&
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
                    messages={state.messages}
                    onSendMessage={onSendMessage}
                    targetUserId={params.id}
                    isCanSendMessage={state.meeting.status === MeetingStatus.Discussion.Code || state.meeting.status === MeetingStatus.Confirmed.Code}
                />
            </div>

            {(isOpenMeetingModal && state.dataLoaded) &&
                <MeetingEditModal
                    isOpen={isOpenMeetingModal}
                    toggle={meetingModalToggle}
                    fieldName={selectedFieldName}
                    onSaveChanges={handleEdit}
                />
            }

        </div>
    );
}