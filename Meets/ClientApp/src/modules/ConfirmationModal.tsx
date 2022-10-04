import React, { Component, useEffect, useRef, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import './ConfirmationModal.scss';


interface ConfirmationModalProps {
    isOpen: boolean
    toggle: () => void
    message: string
    confirmAction: () => void
    parrentToggle?(): void
}

export default function ConfirmationModal(props: ConfirmationModalProps) {
    const onConfirm = () => {
        props.confirmAction && props.confirmAction();

        if (props.parrentToggle) {
            props.parrentToggle();
        }
        else {
            props.toggle();
        }
    }

    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggle}
            size='md'
            container='div.container-xl'
            className="ConfirmationModal"
            contentClassName="Content"
            centered={true}
        >
            <ModalBody
                className="Body"
            >
                <span className="ms-2">{props.message}</span>
                <div className="d-flex flex-row mt-3">
                    <button type="button" className="Action btn me-2" onClick={onConfirm}>ДА</button>
                    <button type="button" className="Cancel btn" onClick={props.toggle}>Отменить</button>
                </div>
            </ModalBody>
        </Modal>
    );
}