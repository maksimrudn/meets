import React, { Component, useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Routes from '../../../common/Routes';
import meetingsService from '../../../api/MeetingsService';
import 'moment-timezone';
import 'moment/locale/ru';
import MeetingRequest from '../../../contracts/meeting/MeetingRequest';
import LocateMapIcon from '../../../icons/LocateMapIcon';

import './MeetRequestModal.scss';

interface IMeeting{
    date: any
    isOnline: boolean
    place: string
}

interface IMeetRequestModalProps {
    isOpen: boolean
    toggle: () => void

    user: any

    mapSelectModalToggle: () => void
    meetingAddress: string
}

export default function MeetRequestModal(props: IMeetRequestModalProps) {
    moment.locale('ru');

    const history = useHistory();

    const [meeting, setMeeting] = useState<IMeeting>({
        date: moment().format('DD MMMM YYYY HH:mm'),
        isOnline: false,
        place: ''
    });

    const messageRef: React.MutableRefObject<HTMLTextAreaElement> = useRef();

    useEffect(() => {
        setMeeting({
            ...meeting,
            place: props.meetingAddress
        });
    }, [props.meetingAddress]);

    const inviteOnClick = () => {
        try {
            let mt = new MeetingRequest();
            mt.targetId = props.user.id;
            mt.meetingDate = moment(meeting.date, 'DD MMMM YYYY HH:mm').toISOString(); //.format('DD-MM-YYYYTHH:mm:ss');
            mt.isOnline = meeting.isOnline;
            mt.place = meeting.place;
            mt.message = messageRef.current.value;

            meetingsService.invite(mt);
            props.toggle();
        } catch (err: any) {
            history.push(Routes.Error, err);
            //NotificationManager.error(err.message, err.name);
        }
    }


    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggle}
            size='md'
            container='div.container-xl'
            cssModule={{
                //'modal-open': 'p-0'
            }}
            className="MeetRequestModal"
            contentClassName="Content"
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                Приглашение
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Дата / Время</label>
                    <DateTime
                        onChange={(res: any) => setMeeting({ ...meeting, date: res })}
                        initialValue={meeting.date}
                        inputProps={{ placeholder: 'dd.mm.yyyy hh:mm' }}
                        dateFormat="DD MMMM YYYY"
                        timeFormat="HH:mm"
                        locale='ru'
                        //timeFormat={false}
                        closeOnSelect={true}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Сообщение</label>
                    <textarea
                        className="form-control"
                        value={`Привет ${props.user.fullName}! Приглашаю тебя попить кофе ${moment(meeting.date, 'DD MMMM YYYY HH:mm').format('DD MMMM')} в ${moment(meeting.date, 'DD MMMM YYYY HH:mm').format('HH:mm')}`}
                        ref={messageRef}
                        rows={4}
                        readOnly
                    />
                </div>

                <div className="col-12 d-flex justify-content-between align-items-center">
                    <span className="form-label">Онлайн встреча</span>
                    <div className="Switch mb-3">
                        <input
                            type="checkbox"
                            id="isOnline"
                            checked={meeting.isOnline}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeeting({ ...meeting, place: '', isOnline: e.target.checked })}
                        />
                        <label htmlFor="isOnline"></label>
                    </div>
                </div>

                {(() => {
                    if (!meeting.isOnline) {
                        return (
                            <>
                                <div className="col-12 mb-2">
                                    <span className="form-label">Место встречи</span>
                                    <textarea
                                        className="form-control"
                                        defaultValue={meeting.place}
                                        placeholder="Тверская ул., 22, Москва, 127006"
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMeeting({ ...meeting, place: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                <button type="button" className="SetPlaceBtn btn mt-3" onClick={props.mapSelectModalToggle}>
                                    <span className="me-3"><LocateMapIcon /></span>
                                    <span>Указать на карте</span>
                                </button>
                            </>
                        );
                    } else {
                        return (
                            <>
                                <div className="col-12 mb-2">
                                    <span className="form-label">Место встречи</span>
                                    <textarea
                                        className="form-control"
                                        placeholder="zoomid ….."
                                        defaultValue={meeting.place}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMeeting({ ...meeting, place: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                <div className="col-12 text-start text-muted">Здесь можно указать место встречи онлайн - ссылка на встречу в zoom или другой контакт</div>
                            </>
                        );
                    }
                })()}

                <button type="button" className="SaveBtn btn mt-3" onClick={inviteOnClick}>Отправить</button>

            </ModalBody>

        </Modal>
    );
}
