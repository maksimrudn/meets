import React, { Component, useEffect, useRef, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { UserFieldNames } from '../../../common/UserFieldNames';
import { getAllowedPhotoFilesByMask } from '../../../common/Utils';

import './UserCardContextMenuModal.scss';


interface UserCardContextMenuModalProps {
    isOpen: boolean
    toggle: any

    user: any
    userInfo: any

    onSaveChanges: any

    avatarModalToggle: any
    removeAvatarModalToggle: any
    showAvatarToggle: any
}

export default function UserCardContextMenuModal(props: UserCardContextMenuModalProps) {
    const onFileUploadChange = async (e: Event | any) => {
        let target = e.target as HTMLInputElement;
        let files = getAllowedPhotoFilesByMask(target.files);

        props.toggle();
        props.onSaveChanges(UserFieldNames.Photo, files[0]);
    }

    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggle}
            size='md'
            container='div.container-xl'
            //cssModule={{
            //    'modal-open': 'p-0'
            //}}
            className="UserCardSettingsModal"
            contentClassName="Content"
        >
            <ModalBody
                className="Body"
            >
                <div className="d-flex flex-column justify-content-center">
                    <button type="button" className="Action btn mb-3" onClick={props.showAvatarToggle} disabled={props.user.avatar ? false : true}>Открыть фото</button>
                    {props.user.id === props.userInfo.user.id &&
                        <>
                            {/*<button type="button" className="Action btn mb-3" onClick={props.avatarModalToggle}>Изменить фото</button>*/}
                            <div className="FileUpload">
                                <label className="Action btn mb-3" htmlFor="fileupload">Изменить фото</label>
                                <input type="file" id="fileupload" name="photo" onChange={onFileUploadChange} />
                            </div>
                            <button type="button" className="Action btn mb-3" onClick={props.removeAvatarModalToggle}>Удалить фото</button>
                        </>
                    }
                    <button type="button" className="Action btn mb-3">Поделиться профилем</button>
                    <button type="button" className="Cancel btn" onClick={props.toggle}>Отменить</button>
                </div>
            </ModalBody>
        </Modal>
    );
}
