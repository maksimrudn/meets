import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { Component, useEffect, useRef, useState } from 'react';
import EventEditor from './EventEditor';


export default function EventEditorModal({ isOpen, toggle, eventId }) {


    return (
        <>
            <Modal
                isOpen={isOpen}
                toggle={toggle}
                size='lg'
                container='div.container-xl'
            >
                <ModalHeader
                    toggle={toggle}
                    cssModule={{ 'modal-title': 'fw-bold' }}
                >
                    {eventId ? 'Изменение события' : 'Создание события'}
                </ModalHeader>
                <ModalBody>
                    <EventEditor toggle={toggle} eventId={eventId} />
                </ModalBody>
                
            </Modal>
        </>
        );
}