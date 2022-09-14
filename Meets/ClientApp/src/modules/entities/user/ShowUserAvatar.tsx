import React, { Component, useEffect, useRef, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getAvatarPathForUser } from '../../../common/Utils';

import './ShowUserAvatar.scss';



interface ShowUserAvatarProps {
    isOpen: any
    toggle: () => void
    user: any
}

export default function ShowUserAvatar(props: ShowUserAvatarProps) {
    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggle}
            className="ShowUserAvatar"
            contentClassName="Content"
            fade={false}
            fullscreen
        >
            <ModalBody
                className="Body"
                onClick={props.toggle}
            >
                <img src={getAvatarPathForUser(props.user)} alt="" />
            </ModalBody>
        </Modal>
    );
}