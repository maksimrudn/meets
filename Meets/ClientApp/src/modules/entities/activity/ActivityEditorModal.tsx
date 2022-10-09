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

import './ActivityEditorModal.scss'
import { Activity } from '../../../contracts/activity/Activity';
import activityService from '../../../api/ActivityService';
import useAccountStore from '../../../hooks/useAccountStore';
import useUserStore from '../../../hooks/useUserStore';



interface ActivityEditorModalProps {
    isOpen: boolean
    toggle: () => void

    ActivityId: any
}

export default function ActivityEditorModal(props: ActivityEditorModalProps) {
    const accountStore = useAccountStore();
    const userStore = useUserStore();

    const [activity, setActivity] = useState<Activity>(new Activity());

    useEffect(() => {
        try {
            if (props.ActivityId) {
                let formData = new FormData();
                formData.append('id', props.ActivityId);
                let activity: Activity = activityService.get(formData);
                setActivity(activity);
            }
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }, [props.ActivityId]);

    const onSaveChanges = async () => {
        if (props.ActivityId) {
            try {
                let formData = new FormData();
                formData.append('id', activity.id);
                formData.append('title', activity.title);

                activityService.edit(formData);
                userStore.updateUser(accountStore.currentUser?.id);
                props.toggle();
            } catch (err: any) {
                NotificationManager.error(err.message, err.name);
            }
        } else {
            try {
                activityService.create(activity);
                userStore.updateUser(accountStore.currentUser?.id);
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
                {props.ActivityId ? 'Редактировать' : 'Создать'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Название</label>
                    <textarea
                        className="form-control"
                        defaultValue={activity.title}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setActivity({
                                ...activity,
                                title: e.target.value
                            })
                        }}
                        cols={5}
                        rows={6}
                    />
                </div>

                <button type="button" className="Save btn mt-3" onClick={onSaveChanges}><span className="fs-6 text-white">Сохранить</span></button>
            </ModalBody>
        </Modal>
    );
}
