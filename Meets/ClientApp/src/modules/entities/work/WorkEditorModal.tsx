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
import CalendarAltIcon from '../../../icons/CalendarAltIcon';
import MenuCloseIcon from '../../../icons/MenuCloseIcon';

import './WorkEditorModal.scss'
import { Work } from '../../../contracts/work/Work';
import workService from '../../../api/WorkService';



interface WorkEditorModalProps {
    isOpen: boolean
    toggle: () => void

    WorkId: any
    updateUser: () => void
}

export default function WorkEditorModal(props: WorkEditorModalProps) {
    const [work, setWork] = useState<Work>(new Work());

    useEffect(() => {
        try {
            if (props.WorkId) {
                let formData = new FormData();
                formData.append('id', props.WorkId);
                let work: Work = workService.get(formData);
                setWork(work);
            }
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }, [props.WorkId]);

    const onSaveChanges = () => {
        if (props.WorkId) {
            try {
                let formData = new FormData();
                formData.append('id', work.id);

                if (work.startDate !== 'Invalid date') {
                    formData.append('startDate', work.startDate as string);
                }

                if (work.endDate !== 'Invalid date') {
                    formData.append('endDate', work.endDate as string);
                }
                formData.append('title', work.title);
                formData.append('post', work.post);

                workService.edit(formData);
                props.updateUser();
                props.toggle();
            } catch (err: any) {
                NotificationManager.error(err.message, err.name);
            }
        } else {
            try {
                workService.create(work);
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
            className="WorkEditorModal"
            contentClassName="Content"
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                {props.WorkId ? 'Редактировать' : 'Создать'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Дата начала</label>
                    <DateTime
                        onChange={(date: any) => {
                            setWork({
                                ...work,
                                startDate: moment(date).format('YYYY-MM-DD')
                            })
                        }}
                        initialValue={work.startDate && moment(work.startDate).format('DD.MM.YYYY')}
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
                            setWork({
                                ...work,
                                endDate: moment(date).format('YYYY-MM-DD')
                            })
                        }}
                        initialValue={work.endDate && moment(work.endDate).format('DD.MM.YYYY')}
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
                        defaultValue={work.title}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setWork({
                                ...work,
                                title: e.target.value
                            })
                        }}
                        cols={5}
                        rows={6}
                    //style={{ resize: 'none' }}
                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Должность</label>
                    <input
                        className="form-control"
                        type="text"
                        defaultValue={work.post}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setWork({
                                ...work,
                                post: e.target.value
                            })
                        }}
                    />
                </div>

                <button type="button" className="Save btn mt-3" onClick={onSaveChanges}><span className="fs-6 text-white">Сохранить</span></button>
            </ModalBody>
        </Modal>
    );
}
