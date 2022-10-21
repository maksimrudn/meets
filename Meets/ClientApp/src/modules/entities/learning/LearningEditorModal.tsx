import React, { Component, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';


import EventListItem from '../../../pages/event/EventListItem';
import PlusIcon from '../../../icons/PlusIcon';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css';
import learningService from '../../../api/LearningService';
import { Learning } from '../../../contracts/learning/Learning';
import CalendarAltIcon from '../../../icons/CalendarAltIcon';
import MenuCloseIcon from '../../../icons/MenuCloseIcon';

import './LearningEditorModal.scss'
import useAccountStore from '../../../hooks/useAccountStore';
import useUserStore from '../../../hooks/useUserStore';
import { toast } from 'react-toastify';


interface LearningEditorModalProps {
    isOpen: boolean
    toggle: () => void
    learning: Learning
}

export default function LearningEditorModal(props: LearningEditorModalProps) {
    const userStore = useUserStore();

    const onSaveChanges = async () => {
        if (props.learning.id) {
            try {
                await userStore.editLearning();
                props.toggle();
            } catch (err: any) {
                toast.error(`Ошибка, ${err.message}`);
            }
        } else {
            try {
                await userStore.createLearning();
                props.toggle();
            } catch (err: any) {
                toast.error(`Ошибка, ${err.message}`);
            }
        }
    }

    const onChangeStartDate = async (date: any) => {
        try {
            await userStore.setLearning({
                ...userStore.learning,
                startDate: moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : null
            })
        } catch (err) { }
    }

    const onChangeEndDate = async (date: any) => {
        try {
            await userStore.setLearning({
                ...userStore.learning,
                endDate: moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : null
            })
        } catch (err) { }
    }

    const onChangeTitle = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            await userStore.setLearning({
                ...userStore.learning,
                title: e.target.value
            })
        } catch (err) { }
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
                {props.learning.id ? 'Редактировать' : 'Создать'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Дата начала</label>
                    <DateTime
                        onChange={onChangeStartDate}
                        initialValue={props.learning.startDate && moment(props.learning.startDate).format('DD.MM.YYYY')}
                        inputProps={{ placeholder: 'dd.mm.yyyy' }}
                        dateFormat="DD.MM.YYYY"
                        timeFormat={false}
                        closeOnSelect={true}

                    />
                </div>

                <div className="col-12 mb-2">
                    <label className="form-label">Дата окончания</label>
                    <DateTime
                        onChange={onChangeEndDate}
                        initialValue={props.learning.endDate && moment(props.learning.endDate).format('DD.MM.YYYY')}
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
                        defaultValue={props.learning.title}
                        onChange={onChangeTitle}
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
