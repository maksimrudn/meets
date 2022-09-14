import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { Component, useEffect, useRef, useState } from 'react';
import PlaceEditor from './PlaceEditor';



export default function PlaceEditorModal({ isOpen, toggle, placeId, placeTitle, setNewPlaceToSelect }) {

    return (
        <>
            <Modal
                isOpen={isOpen}
                toggle={toggle}
                size='lg'
                container='div.container-xl'
                cssModule={{ 'modal-title': 'fw-bold' }}
            >
                <ModalHeader
                    toggle={toggle}
                >
                    {placeId ? 'Изменение места' : 'Создание места'}
                </ModalHeader>
                <ModalBody>
                    <PlaceEditor toggle={toggle} placeId={placeId} placeTitle={placeTitle} setNewPlaceToSelect={setNewPlaceToSelect} />
                </ModalBody>
                
            </Modal>
        </>
        );
}