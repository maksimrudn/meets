import { Location } from 'history';
import React, { useEffect, useRef, useState } from 'react';
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
import { toast } from 'react-toastify';
import WebRTC from '../webrtc/WebRTC';
import WebRTCService, { IRoomInfo } from '../../api/WebRTCService';
import useWebRTCStore from '../../hooks/useWebRTCStore';

interface IWebRTCActions {
    grabWebCamVideo: () => void
    createRoom: (receierId: any) => void
    leaveRoom: () => void
}

interface IWebRTCModalProps {
    isOpen: boolean
    toggle: () => void
    isCaller: boolean
    receiverId: any

    localVideoRef: React.MutableRefObject<HTMLVideoElement>
    remoteVideoRef: React.MutableRefObject<HTMLVideoElement>
    connectionStatusMessageRef: React.MutableRefObject<HTMLParagraphElement>

    meetingId: any,
    companionId: any

    webRTCService: WebRTCService
    //actions: IWebRTCActions
}

function WebRTCModal(props: IWebRTCModalProps) {
    const rtcStore = useWebRTCStore();

    //const localVideoRef = useRef<HTMLVideoElement>();
    //const remoteVideoRef = useRef<HTMLVideoElement>();

    useEffect(() => {
        //const onCall = async () => {
        //    try {
        //        await rtcStore.setLocalVideo(localVideoRef.current);
        //        await rtcStore.setRemoteVideo(remoteVideoRef.current);

        //        await rtcStore.grabWebCamVideo();
        //        //props.webRTCService.startServerSignaling();

        //        if (props.isCaller) {
        //            await rtcStore.createRoom(props.meetingId, props.companionId);
        //        } else {
        //            //props.webRTCService.joinRoom(roomData);
        //        }
        //    } catch (err: any) {
        //        toast.error(err.message);
        //    }
        //}
        //onCall();
        
        //props.webRTCService.startServerSignaling();

        if (props.isCaller) {
            props.webRTCService.createRoom(props.meetingId, props.companionId);
        } else {
            //props.webRTCService.joinRoom(roomData);
        }

        props.webRTCService.grabWebCamVideo();

        return () => {
            props.webRTCService.leaveRoom();
        //    const leave = async () => {
        //        await rtcStore.leaveRoom();
        //    }
        //    leave();
        };
    }, []);

    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggle}
            size='lg'
        >
            <ModalHeader
                toggle={props.toggle}
            >
                RTC
            </ModalHeader>
            <ModalBody>

                {/********************************************************************************
                 * VideoChat:
                 * - connectionStatusMessage статус подключения
                 * - localVideo захваченое видео текущего пользователя (sender)
                 * - remoteVideo захваченное видео подключенного пользователя (receiver)
                 ********************************************************************************/}
                <div className="VideoChat">
                    <div className="ConnectionStatus">
                        <p id="connectionStatusMessage" ref={props.connectionStatusMessageRef}>Waiting...</p>
                    </div>
                    <h5>Video chat</h5>
                    <div className="VideoArea">
                        <video id="localVideo" autoPlay playsInline ref={props.localVideoRef}></video>
                        <video id="remoteVideo" autoPlay playsInline ref={props.remoteVideoRef}></video>
                    </div>

                </div>
                {/*<WebRTC*/}
                {/*    isCaller={props.isCaller}*/}
                {/*    receiverId={props.receiverId}*/}
                {/*/>*/}

            </ModalBody>

        </Modal >
    );
}

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
    const meetingStore = useMeetingStore();

    const rtcStore = useWebRTCStore();

    const [isOpenMeetingModal, setIsOpenMeetingModal] = useState(false);
    const [selectedFieldName, setSelectedFieldName] = useState<string>('');

    const [isExpanded, setIsExpanded] = useState(false);

    const [showRTCWin, setShowRTCWin] = useState(false);
    const [isRTCCaller, setIsRTCCaller] = useState(false);

    //const [roomData, setRoomData] = useState<IRoomInfo>({} as IRoomInfo);
    const localVideoRef = useRef<HTMLVideoElement>();
    const remoteVideoRef = useRef<HTMLVideoElement>();
    const connectionStatusMessageRef = useRef<HTMLParagraphElement>();

    const [webRTCService, setWebRTCService] = useState({} as WebRTCService);


    useEffect(() => {
        const update = async () => {

            try {
                await meetingStore.updateMeeting(meetingId);
                await meetingStore.updateMessages(meetingId);
            }
            catch (err: any) {
                history.push(Routes.Error, err);
            }
        }
        update();

        //const createConnectionsAndStartSignaling = async () => {


        //    try {
        //        //await rtcStore.update(webRTCService as IWebRTCService);
        //        await rtcStore.createConnections();
        //        await rtcStore.startSignalingServer();
        //    } catch (err) { }
        //}
        //createConnectionsAndStartSignaling();

        let webRTCService = new WebRTCService(
            connectionStatusMessageRef.current,
            localVideoRef.current,
            remoteVideoRef.current,
            //setRoomData
            //history.location.pathname
        );
        webRTCService.startServerSignaling();

        setWebRTCService(webRTCService);
        //rtcStore.webRTCService.startServerSignaling();
    }, []);

    useEffect(() => {
        props.setIsOpenMeeting(true);

        return () => {
            props.setIsOpenMeeting(false);
        };
    });

    const onSendMessage = async (text: any, receiverId: any) => {
        try {
            await meetingStore.sendMessage(meetingId, text, receiverId);
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const discussOnClick = async () => {
        try {
            await meetingStore.discuss(meetingId);
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const cancelOnClick = async () => {
        try {
            await meetingStore.cancel(meetingId);
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const confirmOnClick = async () => {
        try {
            await meetingStore.confirm(meetingId);
        } catch (err: any) {
            toast.error(`Ошибка, ${err.message}`);
        }
    }

    const handleEdit = async (value: string, fieldName: string) => {
        try {
            await meetingStore.edit(meetingId, value, fieldName);
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

    const showRTCWinToggle = () => {
        setShowRTCWin(!showRTCWin);
    }

    return (
        <>
            <div className="Meeting">

                <div className="Header col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="GoBackBtn" onClick={() => history.goBack()}><ArrowIcon /></span>
                        <span className="Title">Встреча</span>
                        <span className="MeetingBtn" onClick={() => history.push(Routes.MeetingList)}><MeetingIcon /></span>
                    </div>

                    {/* WebRTC signalR */}
                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={() => {
                            setIsRTCCaller(true);
                            showRTCWinToggle();
                        }}
                    >video call</button>
                    {/*<Link to={Routes.WebRTC} className="btn btn-primary w-100">WebRTC</Link>*/}

                    {(() => {
                        if (!isExpanded) {
                            return (
                                <div className="NotExpanded">
                                    <div className="col-md-7 col-10 d-flex flex-column">
                                        <div className="DateTime mb-2">
                                            <span className="CalendarIcon me-2"><CalendarAltIcon /></span>
                                            <span className="me-3">{moment(meetingStore.meeting.meetingDate).format('DD MMMM, YYYY')} ({moment(meetingStore.meeting.meetingDate).format('ddd')})</span>
                                            <span className="TimeIcon me-2"><AccessTimeIcon /></span>
                                            <span className="me-2">{moment(meetingStore.meeting.meetingDate).format('HH:mm')}</span>
                                            {(meetingStore.meeting.isOwner && meetingStore.meeting.status !== MeetingStatus.Canceled.Code) &&
                                                <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                            }
                                        </div>
                                        <div className="Place mb-2">
                                            <span className="me-2"><LocationIconSvg width='10.47' height='16.75' color='#000' /></span>
                                            <span className="me-2">{meetingStore.meeting.place}</span>
                                            {(meetingStore.meeting.isOwner && meetingStore.meeting.status !== MeetingStatus.Canceled.Code) &&
                                                <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Place)}><EditIcon /></span>
                                            }
                                        </div>
                                        <div className="Companion mb-2">
                                            <span className="me-2"><PersonIcon /></span>
                                            <span>{meetingStore.meeting.companion?.fullName}</span>
                                        </div>
                                        <div className="Status mb-2">{MeetingStatus[meetingStore.meeting.status as MeetingStatusItems]?.Title}</div>
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
                                            <span className="me-3">{moment(meetingStore.meeting.meetingDate).format('DD MMMM, YYYY')} ({moment(meetingStore.meeting.meetingDate).format('ddd')})</span>
                                            {(meetingStore.meeting.isOwner && meetingStore.meeting.status !== MeetingStatus.Canceled.Code) &&
                                                <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                            }
                                        </div>
                                        <div className="Time mb-2">
                                            <span className="TimeIcon me-2"><AccessTimeIcon /></span>
                                            <span className="me-2">{moment(meetingStore.meeting.meetingDate).format('HH:mm')}</span>
                                            {(meetingStore.meeting.isOwner && meetingStore.meeting.status !== MeetingStatus.Canceled.Code) &&
                                                <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Date)}><EditIcon /></span>
                                            }
                                        </div>
                                        <div className="Place mb-2">
                                            <span className="me-2"><LocationIconSvg width='10.47' height='16.75' color='#000' /></span>
                                            <span className="me-2">{meetingStore.meeting.place}</span>
                                            {(meetingStore.meeting.isOwner && meetingStore.meeting.status !== MeetingStatus.Canceled.Code) &&
                                                <span className="EditIcon" role="button" onClick={() => editOnClick(MeetingFieldNames.Place)}><EditIcon /></span>
                                            }
                                        </div>
                                        <div className="Companion mb-2">
                                            {meetingStore.meeting.companion?.avatar
                                                ? <span className="Avatar me-3"><img src={getAvatarPathForUser(meetingStore.meeting.companion)} alt="" /></span>
                                                : <span className="EmptyAvatar me-3"><EmptyAvatarIcon color='#000' /></span>
                                            }
                                            <span className="Name">{meetingStore.meeting.companion?.fullName}</span>
                                        </div>
                                        <div className="Status mb-3">
                                            <span className="me-2">Статус</span>
                                            <span className="Badge">{MeetingStatus[meetingStore.meeting.status as MeetingStatusItems]?.Title}</span>
                                        </div>
                                        {(() => {
                                            if (!meetingStore.meeting.isOwner) {

                                                if (meetingStore.meeting.status !== MeetingStatus.Discussion.Code &&
                                                    meetingStore.meeting.status !== MeetingStatus.Confirmed.Code &&
                                                    meetingStore.meeting.status !== MeetingStatus.Canceled.Code) {
                                                    return (<button className="StatusBtn" type="button" onClick={discussOnClick}>Обсудить</button>);
                                                }
                                            }
                                        })()}
                                        {(() => {
                                            if (!meetingStore.meeting.isOwner) {

                                                if (meetingStore.meeting.status !== MeetingStatus.Confirmed.Code &&
                                                    meetingStore.meeting.status !== MeetingStatus.Canceled.Code) {
                                                    return (<button className="StatusBtn" type="button" onClick={confirmOnClick}>Подтвердить</button>);
                                                }
                                            }
                                        })()}
                                        {meetingStore.meeting.status !== MeetingStatus.Canceled.Code &&
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
                        messages={meetingStore.messages}
                        onSendMessage={onSendMessage}
                        targetUserId={params.id}
                        isCanSendMessage={meetingStore.meeting.status === MeetingStatus.Discussion.Code || meetingStore.meeting.status === MeetingStatus.Confirmed.Code}
                    />
                </div>

                {/*showRTCWin && */}

                {showRTCWin &&
                    <WebRTCModal
                        isOpen={showRTCWin}
                        toggle={showRTCWinToggle}
                        isCaller={isRTCCaller}
                        receiverId={params.id}
                        localVideoRef={localVideoRef}
                        remoteVideoRef={remoteVideoRef}
                        connectionStatusMessageRef={connectionStatusMessageRef}
                        meetingId={props.location.state.meetingId}
                        companionId={meetingStore.meeting.companion?.email}
                        webRTCService={webRTCService}
                    />
                }

                {(isOpenMeetingModal && meetingStore.dataLoaded) &&
                    <MeetingEditModal
                        isOpen={isOpenMeetingModal}
                        toggle={meetingModalToggle}
                        fieldName={selectedFieldName}
                        onSaveChanges={handleEdit}
                    />
                }

            </div>

            {/*showRTCWin &&
                <div style={{ position: 'absolute', zIndex: 2500, width: '85vh', height: '80vh', display: 'flex', margin: 'auto' }}>
                    <WebRTC />
                </div>
            */}
        </>
    );
}