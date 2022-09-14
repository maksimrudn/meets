import React, { Component, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';


import EventListItem from '../../../pages/event/EventListItem';
import PlusIcon from '../../../icons/PlusIcon';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import learningService from '../../../api/LearningService';
import { Learning } from '../../../contracts/learning/Learning';
import CalendarAltIcon from '../../../icons/CalendarAltIcon';
import MenuCloseIcon from '../../../icons/MenuCloseIcon';

import './LearningEditorModal.scss'



interface LearningEditorModalProps {
    isOpen: boolean
    toggle: () => void

    LearningId: any
    updateUser: () => void
}

export default function LearningEditorModal(props: LearningEditorModalProps) {
    const [learning, setLearning] = useState<Learning>(new Learning());

    useEffect(() => {
        try {
            if (props.LearningId) {
                let formData = new FormData();
                formData.append('id', props.LearningId);
                let learn: Learning = learningService.get(formData);
                setLearning(learn);
            }
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }, [props.LearningId]);

    const onSaveChanges = () => {
        if (props.LearningId) {
            try {
                let formData = new FormData();
                formData.append('id', learning.id);

                if (learning.startDate !== 'Invalid date') {
                    formData.append('startDate', learning.startDate as string);
                }

                if (learning.endDate !== 'Invalid date') {
                    formData.append('endDate', learning.endDate as string);
                }
                formData.append('title', learning.title);

                learningService.edit(formData);
                props.updateUser();
                props.toggle();
            } catch (err: any) {
                NotificationManager.error(err.message, err.name);
            }
        } else {
            try {
                learningService.create(learning);
                props.updateUser();
                props.toggle();
            } catch (err: any) {
                NotificationManager.error(err.message, err.name);
            }
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
            className="LearningEditorModal"
            contentClassName="Content"
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                {props.LearningId ? 'Редактировать' : 'Создать'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Дата начала</label>
                    <DateTime
                        onChange={(date: any) => {
                            setLearning({
                                ...learning,
                                startDate: moment(date).format('YYYY-MM-DD')
                            })
                        }}
                        initialValue={learning.startDate && moment(learning.startDate).format('DD.MM.YYYY')}
                        inputProps={{ placeholder: 'dd.mm.yyyy' }}
                        dateFormat="DD.MM.YYYY"
                        timeFormat={false}
                        closeOnSelect={true}

                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Дата окончания</label>
                    <DateTime
                        onChange={(date: any) => {
                            setLearning({
                                ...learning,
                                endDate: moment(date).format('YYYY-MM-DD')
                            })
                        }}
                        initialValue={learning.endDate && moment(learning.endDate).format('DD.MM.YYYY')}
                        inputProps={{ placeholder: 'dd.mm.yyyy' }}
                        dateFormat="DD.MM.YYYY"
                        timeFormat={false}
                        closeOnSelect={true}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Название</label>
                    <textarea
                        className="form-control"
                        defaultValue={learning.title}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setLearning({
                                ...learning,
                                title: e.target.value
                            })
                        }}
                        cols={5}
                        rows={6}
                    //style={{ resize: 'none' }}
                    />
                </div>

                <button type="button" className="Save btn mt-3" onClick={onSaveChanges}><span className="fs-6 text-white">Сохранить</span></button>
            </ModalBody>
        </Modal>
    );
}
