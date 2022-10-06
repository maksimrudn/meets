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

import './FactEditorModal.scss'
import { Fact } from '../../../contracts/fact/Fact';
import factService from '../../../api/FactService';
import useAccountStore from '../../../hooks/useAccountStore';
import useUserStore from '../../../hooks/useUserStore';



interface FactEditorModalProps {
    isOpen: boolean
    toggle: () => void

    FactId: any
}

export default function FactEditorModal(props: FactEditorModalProps) {
    const { currentUser } = useAccountStore();
    const { updateUser } = useUserStore();

    const [fact, setFact] = useState<Fact>(new Fact());

    useEffect(() => {
        try {
            if (props.FactId) {
                let formData = new FormData();
                formData.append('id', props.FactId);
                let fact: Fact = factService.get(formData);
                setFact(fact);
            }
        } catch (err: any) {
            NotificationManager.error(err.message, err.name);
        }
    }, [props.FactId]);

    const onSaveChanges = () => {
        if (props.FactId) {
            try {
                let formData = new FormData();
                formData.append('id', fact.id);
                formData.append('title', fact.title);

                factService.edit(formData);
                updateUser(currentUser?.id);
                props.toggle();
            } catch (err: any) {
                NotificationManager.error(err.message, err.name);
            }
        } else {
            try {
                factService.create(fact);
                updateUser(currentUser?.id);
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
            className="FactEditorModal"
            contentClassName="Content"
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                {props.FactId ? 'Редактировать' : 'Создать'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Название</label>
                    <textarea
                        className="form-control"
                        defaultValue={fact.title}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setFact({
                                ...fact,
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
