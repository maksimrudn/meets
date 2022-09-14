import { Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { Component, useEffect, useRef, useState } from 'react';
import CategoryEditor from './CategoryEditor';


export default function CategoryEditorModal({ isOpen, toggle, categoryId }) {

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
                    {categoryId ? 'Изменение категории' : 'Создание категории'}
                </ModalHeader>
                <ModalBody>
                    <CategoryEditor toggle={toggle} categoryId={categoryId} />
                </ModalBody>
                
            </Modal>
        </>
        );
}