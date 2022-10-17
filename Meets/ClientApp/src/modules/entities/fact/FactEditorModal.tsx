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

import './FactEditorModal.scss'
import { Fact } from '../../../contracts/fact/Fact';
import factService from '../../../api/FactService';
import useAccountStore from '../../../hooks/useAccountStore';
import useUserStore from '../../../hooks/useUserStore';
import { toast } from 'react-toastify';


interface FactEditorModalProps {
    isOpen: boolean
    toggle: () => void
    fact: Fact
}

export default function FactEditorModal(props: FactEditorModalProps) {
    const userStore = useUserStore();

    const onSaveChanges = async () => {
        if (props.fact.id) {
            try {
                await userStore.editFact();
                props.toggle();
            } catch (err: any) {
                toast.error(`Ошибка, ${err.message}`);
            }
        } else {
            try {
                await userStore.createFact();
                props.toggle();
            } catch (err: any) {
                toast.error(`Ошибка, ${err.message}`);
            }
        }
    }

    const onChangeTitle = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            await userStore.setFact({
                ...userStore.fact,
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
                {props.fact.id ? 'Редактировать' : 'Создать'}
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="col-12 mb-2">
                    <label className="form-label">Название</label>
                    <textarea
                        className="form-control"
                        defaultValue={props.fact.title}
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
