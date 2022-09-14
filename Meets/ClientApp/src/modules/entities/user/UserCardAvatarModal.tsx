import React, { Component, useEffect, useRef, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AppConfig from '../../../common/AppConfig';
import { UserFieldNames } from '../../../common/UserFieldNames';
import { getAllowedPhotoFilesByMask, getAvatarPathForUser, loadPhotoContentFromFiles } from '../../../common/Utils';

import './UserCardAvatarModal.scss';


interface UserCardAvatarModalProps {
    isOpen: boolean
    toggle: any

    user: any
    onSaveChanges: any
}

export default function UserCardAvatarModal(props: UserCardAvatarModalProps) {
    const [newAvatar, setNewAvatar] = useState<File | any | null>(null);


    const onFileUploadChange = async (e: Event | any) => {
        let target = e.target as HTMLInputElement;
        let files = getAllowedPhotoFilesByMask(target.files);

        setNewAvatar(files[0]);
    }

    const onSaveChanges = () => {
        props.toggle();
        props.onSaveChanges(UserFieldNames.Photo, newAvatar);
    }

    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggle}
            size='md'
            container='div.container-xl'
            className="UserCardAvatarModal"
            contentClassName="Content"
            centered={true}
        >
            <ModalHeader
                toggle={props.toggle}
                cssModule={{
                    'modal-title': 'mb-0'
                }}
                className="Header"
            >
                Аватар
            </ModalHeader>
            <ModalBody
                className="Body"
            >
                <div className="FileUpload d-flex flex-column">
                    <ul id="photoPreview" className="d-flex justify-content-center align-items-center list-group list-group-horizontal list-unstyled border-0 p-0 mb-2">
                        <li className="Add list-group-item border-0">
                            <div className="d-flex align-items-center justify-content-center">
                                <label htmlFor="fileupload">
                                    <i className="icofont-image fs-1"></i>
                                </label>
                            </div>
                        </li>
                        <input type="file" id="fileupload" name="photo" onChange={onFileUploadChange} />
                    </ul>

                    <button type="button" className="Save btn" onClick={onSaveChanges}>Сохранить</button>
                </div>
            </ModalBody>
        </Modal>
    );
}