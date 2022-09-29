import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/ru';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css'
import AppConfig from '../../../common/AppConfig';
import MeetingFieldNames from '../../../common/MeetingFieldNames';
import GetMeetingDTO from '../../../contracts/meeting/GetMeetingDTO';

import './MeetingEditModal.scss'

interface IMeetingEditModal {
    isOpen: boolean
    toggle: () => void
    fieldName: string
    meeting: GetMeetingDTO
    onSaveChanges: (value: string, fieldName: string) => void
}

export default function MeetingEditModal(props: IMeetingEditModal) {
    moment.locale('ru');

    const [value, setValue] = useState<string>('');

    const dateOnChange = (res: any) => {
        console.log();
        setValue(moment(res).format()); //'DD-MM-YYYYTHH:mm:ss' moment(res).toISOString() , 'DD MMMM YYYY HH:mm'
        console.log();
    }

    const onSaveChanges = () => {
        props.onSaveChanges(value, props.fieldName);
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
            className="MeetingEditModal"
            contentClassName="Content"
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                {props.fieldName === MeetingFieldNames.Date ? 'Дата' : 'Место'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                {(() => {
                    switch (props.fieldName) {
                        case MeetingFieldNames.Place:
                            return (
                                <div className="col-12 mb-2">
                                    <AddressSuggestions
                                        token={AppConfig.TokenDadata}
                                        value={{ value: props.meeting.place }}
                                        onChange={(city: any) => setValue(city?.value)}
                                        minChars={3}
                                        inputProps={{ className: 'form-control' }}
                                    />
                                </div>
                            );
                        case MeetingFieldNames.Date:
                            return (
                                <div className="col-12 mb-2">
                                    <DateTime
                                        onChange={(res: any) => setValue(moment(res).format())}
                                        initialValue={moment(props.meeting.meetingDate).format('DD MMMM YYYY HH:mm')}
                                        inputProps={{ placeholder: 'dd.mm.yyyy hh:mm', className: 'form-control' }}
                                        dateFormat='DD MMMM YYYY'
                                        timeFormat='HH:mm'
                                        closeOnSelect={true}
                                        //locale='ru'
                                    />
                                </div>
                            );
                    }
                })()}

                <button type="button" className="SaveBtn btn mt-3" onClick={onSaveChanges}><span className="fs-6 text-white">Сохранить</span></button>

            </ModalBody>

        </Modal>

    );
}