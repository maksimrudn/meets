import React, { Component, useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import moment from 'moment';

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
import UserCardResponse from '../../../contracts/user/UserCardResponse';
import useAccountStore from '../../../hooks/useAccountStore';
import useUserStore from '../../../hooks/useUserStore';
import useMeetRequestStore from '../../../hooks/useMeetRequestStore';
import UserListItemDTO from '../../../contracts/user/UserListItemDTO';



interface IMeetRequestModalProps {
    isOpen: boolean
    toggle: () => void

    user?: UserListItemDTO
}

export default function MeetRequestModal(props: IMeetRequestModalProps) {
    moment.locale('ru');

    const history = useHistory();
    const { register, getValues, formState: { errors }, handleSubmit } = useForm();

    const { currentUser } = useAccountStore();
    const userStore = useUserStore();
    const meeting = useMeetRequestStore();

    const [isOpenMapSelectModal, setIsOpenMapSelectModal] = useState(false);

    const mapSelectModalToggle = () => {
        setIsOpenMapSelectModal(!isOpenMapSelectModal);
    }

    useEffect(() => {
        const setmeetreq = async () => {
            await meeting.setMeetRequest(
                MeetingRequest.create(
                    props.user || userStore.user,
                    `Привет ${(props.user?.fullName || userStore.user.fullName)}! Приглашаю тебя попить кофе`
                )
            );
        }

        setmeetreq();

    }, []);


    const handleInvite = async () => {
        try {
            await meeting.invite();

            if (!props.user) {
                userStore.updateUser(meeting.meetRequest.targetId);
            }

        } catch (err) {
            
        }

        if (!meeting.isLoading && meeting.error != null) {
            props.toggle();
        }
    }

    const onChangeDate = async (res: any) => {
        try {
            await meeting.setMeetRequest({ ...meeting.meetRequest, meetingDate: moment(res, 'DD.MM.YYYY HH:mm').format() })
        }
        catch (err) { }
    }

    const onChangeIsOnline = async (e: any) => {
        try {
            await meeting.setMeetRequest({ ...meeting.meetRequest, place: '', isOnline: e.target.checked });
        }
        catch (err) { }
    }

    const onChangePlace = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            await meeting.setMeetRequest({ ...meeting.meetRequest, place: e.target.value });
        }
        catch (err) { }
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
                <form onSubmit={handleSubmit(handleInvite)}>
                    <div className="col-12 mb-2">
                        <label className="form-label">Дата / Время</label>
                        <DateTime
                            onChange={onChangeDate}
                            initialValue={meeting.meetRequest.meetingDate && moment(meeting.meetRequest.meetingDate).format('DD.MM.YYYY HH:mm')  }
                            inputProps={{
                                placeholder: 'dd.mm.yyyy hh:mm',
                                ...register('Date',
                                    {
                                        required: true
                                    }
                                ),
                                disabled: (meeting.isLoading && !meeting.dataLoaded)
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
                            defaultValue={meeting.meetRequest.message}
                            //onChange={(e: any) => meeting.setMeetRequest({ ...meeting.meetRequest, message: e.target.value })}
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
                                checked={meeting.meetRequest.isOnline}
                                onChange={onChangeIsOnline}
                                disabled={(meeting.isLoading && !meeting.dataLoaded)}
                            />
                            <label htmlFor="isOnline"></label>
                        </div>
                    </div>

                    {(() => {
                        if (!meeting.meetRequest.isOnline) {
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
                                            value={meeting.meetRequest.place}
                                            placeholder="Тверская ул., 22, Москва, 127006"
                                            onChange={onChangePlace}
                                            rows={4}
                                            disabled={(meeting.isLoading && !meeting.dataLoaded)}
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
                                            value={meeting.meetRequest.place}

                                            onChange={onChangePlace}
                                            rows={4}
                                            disabled={(meeting.isLoading && !meeting.dataLoaded)}
                                        />
                                        {errors.Place && <p className='w-100 text-center text-danger mt-2'>Обязательно к заполнению</p>}
                                    </div>

                                    <div className="col-12 text-start text-muted">Здесь можно указать место встречи онлайн - ссылка на встречу в zoom или другой контакт</div>
                                </>
                            );
                        }
                    })()}

                    {meeting.error && <p className='text-danger w-100 text-center mt-2'>{meeting.error}</p>}

                    <button type="submit" className="SaveBtn btn mt-3">Отправить</button>
                </form>

                {isOpenMapSelectModal &&
                    <MapSelectorModal
                        isOpen={isOpenMapSelectModal}
                        toggle={mapSelectModalToggle}
                    />
                }
                
            </ModalBody>

        </Modal>
    );
}
