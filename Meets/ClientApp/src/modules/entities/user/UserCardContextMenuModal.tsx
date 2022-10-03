import React, { Component, useEffect, useRef, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import userService from '../../../api/UserService';
import { UserFieldNames } from '../../../common/UserFieldNames';
import { getAllowedPhotoFilesByMask } from '../../../common/Utils';
import useStoreCurrentUser from '../../../hooks/useCurrentUser';
import ConfirmationModal from '../../ConfirmationModal';
import ShowUserAvatarModal from './ShowUserAvatarModal';
import './UserCardContextMenuModal.scss';


interface UserCardContextMenuModalProps {
    isOpen: boolean
    toggle: any

    user: any

    onSaveChanges: any

    update(): void
}

export default function UserCardContextMenuModal(props: UserCardContextMenuModalProps) {

    const cuStore = useStoreCurrentUser();

    const [isOpenRemoveAvatarModal, setIsOpenRemoveAvatarModal] = useState(false);
    const [isOpenShowAvatarModal, setIsShowAvatar] = useState(false);


    const toggleRemoveAvatarModal = () => {
        setIsOpenRemoveAvatarModal(!isOpenRemoveAvatarModal);
    }

    const toggleShowAvatarModal = () => {
        setIsShowAvatar(!isOpenShowAvatarModal);
    }

    const removeAvatar = () => {
        try {
            userService.removeAvatar();
            props.update();

            toggleRemoveAvatarModal();
        }
        catch (err: any) {

        }
    }


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
            className="UserCardSettingsModal"
            contentClassName="Content"
        >
            <ModalBody
                className="Body"
            >
                <div className="d-flex flex-column justify-content-center">
                    <button type="button" className="Action btn mb-3" onClick={toggleShowAvatarModal} disabled={props.user.avatar ? false : true}>Открыть фото</button>
                    {props.user.id === cuStore.user.user.id &&
                        <>
                            <div className="FileUpload">
                                <label className="Action btn mb-3" htmlFor="fileupload">Изменить фото</label>
                                <input type="file" id="fileupload" name="photo" onChange={onFileUploadChange} />
                            </div>
                            <button type="button" className="Action btn mb-3" onClick={toggleRemoveAvatarModal}>Удалить фото</button>
                        </>
                    }
                    <button type="button" className="Cancel btn" onClick={props.toggle}>Отменить</button>
                </div>


                {isOpenShowAvatarModal &&
                    <ShowUserAvatarModal
                        isOpen={isOpenShowAvatarModal}
                        toggle={toggleShowAvatarModal}
                        user={props.user}
                    />
                }

                {isOpenRemoveAvatarModal &&
                    <ConfirmationModal
                        isOpen={isOpenRemoveAvatarModal}
                        toggle={toggleRemoveAvatarModal}
                        message="Удалить ваше фото?"
                        confirmAction={removeAvatar}
                        parrentToggle={props.toggle}
                    />
                }

            </ModalBody>
        </Modal>
    );
}
