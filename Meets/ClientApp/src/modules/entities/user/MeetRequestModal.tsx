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
import { useForm } from 'react-hook-form';

import './MeetRequestModal.scss';
import UserDTO from '../../../contracts/user/UserDTO';
import MapSelectorModal from './MapSelectorModal';
import UserAuthInfo from '../../../contracts/UserAuthInfo';
import useCurrentUser from '../../../hooks/useCurrentUser';



interface IMeetRequestModalProps {
    isOpen: boolean
    toggle: () => void

    user: UserDTO

    updateUser: () => void

    //updateNotifications: () => void
}

export default function MeetRequestModal(props: IMeetRequestModalProps) {
    moment.locale('ru');

    const history = useHistory();
    const { register, getValues, formState: { errors }, handleSubmit } = useForm();

    const currentUser = useCurrentUser();

    const [meetingRequest, setMeetingRequest] = useState<MeetingRequest>(MeetingRequest.create(props.user));


    const [isOpenMapSelectModal, setIsOpenMapSelectModal] = useState(false);

    const mapSelectModalToggle = () => {
        setIsOpenMapSelectModal(!isOpenMapSelectModal);
    }



    useEffect(() => {
        setMeetingRequest({ ...meetingRequest, message: `Привет ${props.user.fullName}! Приглашаю тебя попить кофе` })
    }, []);


    const inviteOnSubmit = () => {
        try {
            meetingsService.invite(meetingRequest);
            props.updateUser();
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
                <form onSubmit={handleSubmit(inviteOnSubmit)}>
                    <div className="col-12 mb-2">
                        <label className="form-label">Дата / Время</label>
                        <DateTime
                            onChange={(res: any) => setMeetingRequest({ ...meetingRequest, meetingDate: moment(res, 'DD.MM.YYYY HH:mm').toISOString() })}
                            initialValue={meetingRequest.meetingDate && moment(meetingRequest.meetingDate).format('DD.MM.YYYY HH:mm')  }
                            inputProps={{
                                placeholder: 'dd.mm.yyyy hh:mm',
                                ...register('Date',
                                    {
                                        required: true
                                    }
                                )
                            }}
                            dateFormat="DD.MM.YYYY"
                            timeFormat="HH:mm"
                            locale='ru'
                            //timeFormat={false}
                            closeOnSelect={true}
                        />
                        {errors.Date && <p className='w-100 text-center text-danger mt-2'>Обязательно к заполнению</p>}
                    </div>

                    <div className="col-12 mb-2">
                        <label className="form-label">Сообщение</label>
                        <textarea
                            className="form-control"
                            defaultValue={meetingRequest.message}
                            onChange={(e: any) => setMeetingRequest({ ...meetingRequest, message: e.target.value })}
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
                                checked={meetingRequest.isOnline}
                                onChange={(e: any) => setMeetingRequest({ ...meetingRequest, place: '', isOnline: e.target.checked })}
                            />
                            <label htmlFor="isOnline"></label>
                        </div>
                    </div>

                    {(() => {
                        if (!meetingRequest.isOnline) {
                            return (
                                <>
                                    <div className="col-12 mb-2">
                                        <span className="form-label">Место встречи</span>
                                        <textarea {
                                            ...register('Place',
                                                {
                                                    required: true
                                                }
                                            )}
                                            className="form-control"
                                            value={meetingRequest.place}
                                            placeholder="Тверская ул., 22, Москва, 127006"
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMeetingRequest({ ...meetingRequest, place: e.target.value })}
                                            rows={4}
                                        />
                                        {errors.Place && <p className='w-100 text-center text-danger mt-2'>Обязательно к заполнению</p>}
                                    </div>

                                    <button type="button" className="SetPlaceBtn btn mt-3" onClick={mapSelectModalToggle}>
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
                                        <textarea {
                                            ...register('Place',
                                                {
                                                    required: true
                                                }
                                            )}
                                            className="form-control"
                                            placeholder="zoomid ….."
                                            value={meetingRequest.place}
                                            
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMeetingRequest({ ...meetingRequest, place: e.target.value })}
                                            rows={4}
                                        />
                                        {errors.Place && <p className='w-100 text-center text-danger mt-2'>Обязательно к заполнению</p>}
                                    </div>

                                    <div className="col-12 text-start text-muted">Здесь можно указать место встречи онлайн - ссылка на встречу в zoom или другой контакт</div>
                                </>
                            );
                        }
                    })()}

                    <button type="submit" className="SaveBtn btn mt-3">Отправить</button>
                </form>

                <MapSelectorModal
                    isOpen={isOpenMapSelectModal}
                    toggle={mapSelectModalToggle}
                    setMeetingAddress={(value)=>setMeetingRequest({ ...meetingRequest, place: value  })}
                />
            </ModalBody>

        </Modal>
    );
}
