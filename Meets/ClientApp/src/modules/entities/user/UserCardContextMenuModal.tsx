﻿import React, { Component, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import userService from '../../../api/UserService';
import { UserFieldNames } from '../../../common/UserFieldNames';
import { getAllowedPhotoFilesByMask } from '../../../common/Utils';
import useCurrentUserStore from '../../../hooks/useCurrentUserStore';
import { RootState } from '../../../store/createStore';
import { editUser, removeAvatar, updateUser } from '../../../store/user';
import ConfirmationModal from '../../ConfirmationModal';
import ShowUserAvatarModal from './ShowUserAvatarModal';
import './UserCardContextMenuModal.scss';


interface UserCardContextMenuModalProps {
    isOpen: boolean
    toggle: any
}

export default function UserCardContextMenuModal(props: UserCardContextMenuModalProps) {

    const cuStore = useCurrentUserStore();
    const state = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const [isOpenRemoveAvatarModal, setIsOpenRemoveAvatarModal] = useState(false);
    const [isOpenShowAvatarModal, setIsShowAvatar] = useState(false);


    const toggleRemoveAvatarModal = () => {
        setIsOpenRemoveAvatarModal(!isOpenRemoveAvatarModal);
    }

    const toggleShowAvatarModal = () => {
        setIsShowAvatar(!isOpenShowAvatarModal);
    }

    const removeAvatarAction = () => {
        try {
            dispatch(removeAvatar());
            toggleRemoveAvatarModal();
        }
        catch (err: any) {

        }
    }


    const onFileUploadChange = async (e: Event | any) => {
        let target = e.target as HTMLInputElement;
        let files = getAllowedPhotoFilesByMask(target.files);

        props.toggle();
        dispatch(editUser(UserFieldNames.Photo, files[0]))
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
                    <button type="button" className="Action btn mb-3" onClick={toggleShowAvatarModal} disabled={cuStore.avatar ? false : true}>Открыть фото</button>
                    {state.user.id === cuStore.id &&
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
                        user={state.user}
                    />
                }

                {isOpenRemoveAvatarModal &&
                    <ConfirmationModal
                        isOpen={isOpenRemoveAvatarModal}
                        toggle={toggleRemoveAvatarModal}
                        message="Удалить ваше фото?"
                        confirmAction={removeAvatarAction}
                        parrentToggle={props.toggle}
                    />
                }

            </ModalBody>
        </Modal>
    );
}
