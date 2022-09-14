import React, { Component, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { getAvatarPathForUser } from 'common/Utils';
import './Participants.scss';


interface ParticipantsProps {
    participations: any,
    history: any
}

/**
 * Компонент отвечает за участников события
 * выводяться пять аватарок первых в списке участников, по клику открывается модалка со всеми участниками
 * 
 */

export default function Participants({ participations, history }: ParticipantsProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    const modalToggle = (): void => {
        setIsOpen(!isOpen);
    }

    const toUserDetailsOnClick = (e: any): void => {
        e.preventDefault();
        let id = e.currentTarget.getAttribute("data-partid");
        modalToggle();
        history.push(`/user/Details/${id}`);
    }

    return (
        <>
            <div className="Participants" onClick={modalToggle}>
                <div className="d-flex align-items-center justify-content-start" >
                    <div className="avatar-list-stacked" >
                        {
                            participations.length !== 0
                                ? <>
                                    {participations.slice(0, 5).map((part: any) =>
                                        <img src={getAvatarPathForUser(part.participant)
                                        } className="avatar bg-transparent rounded-circle sm" alt="user" />
                                    )}
                                </>
                                : <span className="avatar bg-transparent rounded-circle text-center sm" style={{ color: 'grey' }}> <i className="icofont-close-circled fs-5" > </i></span >
                        }
                    </div>
                </div>
            </div>
            {participations?.length
                ? (<Modal
                    isOpen={isOpen}
                    toggle={modalToggle}
                    size='sm'
                //container='div.container-xl'
                >
                    <ModalHeader
                        toggle={modalToggle}
                        cssModule={{ 'modal-title': 'fw-bold' }
                        }
                    >
                        Кто идёт:
                    </ModalHeader>
                    < ModalBody >
                        <div className="card border-0" >
                            <div className="card-body" >
                                <ul className="part-lst-result list-unstyled list mb-0" >
                                    {participations?.length && participations.map((part: any) =>
                                        <li className="py-2 mb-1 border-bottom" >
                                            <div data-partid={part.participantId} className="d-flex Participants Link" onClick={toUserDetailsOnClick} >
                                                <img src={getAvatarPathForUser(part.participant)} className="avatar bg-transparent rounded-circle sm" alt="user" />
                                                <div className="flex-fill ms-2" >
                                                    <div className="fw-bold mb-0" >{part.participant.fullName}</div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={modalToggle}>Закрыть</Button>
                    </ModalFooter>
                </Modal>)
                : null
            }
        </>
    );
}