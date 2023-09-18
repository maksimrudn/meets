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

import './ActivityEditorModal.scss'
import { Activity } from '../../../contracts/activity/Activity';
import activityService from '../../../api/ActivityService';
import useAccountStore from '../../../hooks/useAccountStore';
import useUserStore from '../../../hooks/useUserStore';
import { toast } from 'react-toastify';


interface ActivityEditorModalProps {
    isOpen: boolean
    toggle: () => void
    activity: Activity
}

export default function ActivityEditorModal(props: ActivityEditorModalProps) {
    const userStore = useUserStore();

    const onSaveChanges = async () => {
        if (props.activity.id) {
            try {
                await userStore.editActivity();
                props.toggle();
            } catch (err: any) {
                toast.error(`Ошибка, ${err.message}`);
            }
        } else {
            try {
                await userStore.createActivity();
                props.toggle();
            } catch (err: any) {
                toast.error(`Ошибка, ${err.message}`);
            }
        }
    }

    const onChangeTitle = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            await userStore.setActivity({
                ...userStore.activity,
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
            className="ActivityEditorModal"
            contentClassName="Content"
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                {props.activity.id ? 'Редактировать' : 'Создать'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Название</label>
                    <textarea
                        className="form-control"
                        defaultValue={props.activity.title}
                        onChange={onChangeTitle}
                        cols={5}
                        rows={6}
                    />
                </div>

                <button type="button" className="Save btn mt-3" onClick={onSaveChanges}><span className="fs-6 text-white">Сохранить</span></button>
            </ModalBody>
        </Modal>
    );
}
