import React, { Component, useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import friendRequestServie from '../../../api/FriendRequestService';
import UserCheckedIcon from '../../../icons/UserCheckedIcon';
import UserPlusIcon from '../../../icons/UserPlusIcon';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


import './SubscribeButton.scss';


interface SubscribeButtonProps {
    subscribed: boolean,
    onSubscribe(): void
    onUnsubscribe(): void
}

export default function SubscribeButton(props: SubscribeButtonProps): JSX.Element {

    const [unsubscribeModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [subscribeModalIsOpen, setAddModalIsOpen] = useState(false);

    const subscribeModalToggler = () => {
        setAddModalIsOpen(!subscribeModalIsOpen);
    }

    const unsubscribeModalToggler = () => {
        setDeleteModalIsOpen(!unsubscribeModalIsOpen);
    }


    return (
        <div className="SubscribeContainer">
            {(() => {
                if (props.subscribed) {
                    return (
                        <>
                            <span
                                role="button"
                                className="SubscribeButton"
                                onClick={unsubscribeModalToggler}
                            >
                                <UserCheckedIcon />
                            </span>
                        </>
                    );
                }
                else {
                    return (
                        <>
                            <span
                                role="button"
                                className="FrBtn"
                                onClick={subscribeModalToggler}
                            >
                                <UserPlusIcon />
                            </span>
                        </>
                    );
                }
                
            })()}

            <Modal
                isOpen={subscribeModalIsOpen}
                toggle={subscribeModalToggler}
                size='sm'
                container='div.container-xl'
                cssModule={{
                    'modal-open': 'p-0'
                }}
                className="SubscribeModal"
                contentClassName="Content"
                centered={true}
            >
                <ModalBody
                    className="Body"
                >
                    <span className="ms-1">Подписаться</span>
                    <div className="d-flex flex-row mt-2">
                        <button
                            type="button"
                            className="Save btn me-2"
                            onClick={() => {
                                subscribeModalToggler();
                                props.onSubscribe();
                            }}
                        >Да</button>
                        <button type="button" className="Cancel btn" onClick={() => subscribeModalToggler()}>Отмена</button>
                    </div>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={unsubscribeModalIsOpen}
                toggle={unsubscribeModalToggler}
                size='sm'
                container='div.container-xl'
                cssModule={{
                    'modal-open': 'p-0'
                }}
                className="SubscribeModal"
                contentClassName="Content"
                centered={true}
            >
                <ModalBody
                    className="Body"
                >
                    <span className="ms-1">Отписаться</span>
                    <div className="d-flex flex-row mt-2">
                        <button
                            type="button"
                            className="Save btn me-2"
                            onClick={() => {
                                unsubscribeModalToggler();
                                props.onUnsubscribe();
                            }}
                        >Да</button>
                        <button type="button" className="Cancel btn" onClick={() => unsubscribeModalToggler()}>Отмена</button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}