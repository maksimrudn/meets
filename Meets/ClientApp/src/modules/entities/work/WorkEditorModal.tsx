import React, { Component, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';


import EventListItem from '../../../pages/event/EventListItem';
import PlusIcon from '../../../icons/PlusIcon';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DateTime from 'react-date-time-new';
import 'react-date-time-new/css/react-datetime.css';
import CalendarAltIcon from '../../../icons/CalendarAltIcon';
import MenuCloseIcon from '../../../icons/MenuCloseIcon';

import './WorkEditorModal.scss'
import { Work } from '../../../contracts/work/Work';
import workService from '../../../api/WorkService';
import useAccountStore from '../../../hooks/useAccountStore';
import useUserStore from '../../../hooks/useUserStore';
import { toast } from 'react-toastify';


interface WorkEditorModalProps {
    isOpen: boolean
    toggle: () => void
    work: Work
}

export default function WorkEditorModal(props: WorkEditorModalProps) {
    const userStore = useUserStore();

    const onSaveChanges = async () => {
        if (props.work.id) {
            try {
                await userStore.editWork();
                props.toggle();
            } catch (err: any) {
                toast.error(`Ошибка, ${err.message}`);
            }
        } else {
            try {
                await userStore.createWork();
                props.toggle();
            } catch (err: any) {
                toast.error(`Ошибка, ${err.message}`);
            }
        }
    }

    const onChangeStartDate = async (date: any) => {
        try {
            await userStore.setWork({
                ...userStore.work,
                startDate: moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : null
            })
        } catch (err) { }
    }

    const onChangeEndDate = async (date: any) => {
        try {
            await userStore.setWork({
                ...userStore.work,
                endDate: moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : null
            })
        } catch (err) { }
    }

    const onChangeTitle = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            await userStore.setWork({
                ...userStore.work,
                title: e.target.value
            })
        } catch (err) { }
    }

    const onChangePost = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            await userStore.setWork({
                ...userStore.work,
                post: e.target.value
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
                {props.work.id ? 'Редактировать' : 'Создать'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Дата начала</label>
                    <DateTime
                        onChange={onChangeStartDate}
                    initialValue={props.work.startDate && moment(props.work.startDate).format('DD.MM.YYYY')}
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
                        initialValue={props.work.endDate && moment(props.work.endDate).format('DD.MM.YYYY')}
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
                        defaultValue={props.work.title}
                        onChange={onChangeTitle}
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
                        defaultValue={props.work.post}
                        onChange={onChangePost}
                    />
                </div>

                <button type="button" className="Save btn mt-3" onClick={onSaveChanges}><span className="fs-6 text-white">Сохранить</span></button>
            </ModalBody>
        </Modal>
    );
}
